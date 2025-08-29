import React, { useState, useEffect } from "react";
import { Tab, Tabs, Table, Badge, Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client"; // ✅ import createRoot
import LoginPage from "./loginpage";

function OrderStatus({ user, setUser }) {
    const [key, setKey] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    useEffect(() => {
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเข้าสู่ระบบ",
                html: `<div id="login-popup"></div>`,
                didOpen: () => {
                    const container = document.getElementById("login-popup");
                    const root = createRoot(container);
                    root.render(
                        <LoginPage setUser={setUser} onClose={() => Swal.close()} />
                    );
                },
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            return; // ✅ ป้องกันการเรียก fetchOrders() ถ้า user ยังไม่ได้ login
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/orders/user/${user.id}`);
                const data = await res.json();
                if (data.success) setOrders(data.orders || []);
                else setOrders([]);
            } catch (err) {
                console.error(err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, setUser]);

    if (!user) return null; // ✅ ไม่ render ตารางจนกว่า login

    const handleShowDetail = (order) => setSelectedOrder(order) || setShowModal(true);
    const handleClose = () => { setShowModal(false); setSelectedOrder(null); }

    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ยกเลิกคำสั่งซื้อ',
            cancelButtonText: 'กลับ',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`http://localhost:3001/orders/${orderId}/cancel`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.success) {
                setOrders((prev) =>
                    prev.map(o =>
                        o.id === orderId
                            ? { ...o, status: 'cancelled', cancelled_at: data.cancelled_at }
                            : o
                    )
                );

                // แจ้ง success
                Swal.fire('ยกเลิกแล้ว!', 'คำสั่งซื้อของคุณถูกยกเลิกเรียบร้อย', 'success');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถยกเลิกคำสั่งซื้อได้', 'error');
        }
    };


    const statusColor = {
        pending: "warning",
        checking: "primary",
        preparing: "info",
        ready_to_ship: "secondary",
        shipping: "info",
        delivered: "success",
        cancelled: "danger",
    };

    const filteredOrders = orders.filter((order) =>
        key === "all" ? true : order.status === key
    );

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /> กำลังโหลดคำสั่งซื้อ...</div>;
    if (!orders.length) return <div className="text-center mt-5">คุณยังไม่มีคำสั่งซื้อ</div>;

    return (
        <div className="container" style={{ paddingTop: '80px',paddingBottom: '20px' }}>
            <h4 className="mb-3">ตรวจสอบสถานะคำสั่งซื้อ</h4>

            <Tabs id="statusTab" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                <Tab eventKey="all" title="ทั้งหมด" />
                <Tab eventKey="pending" title="รอชำระเงิน" />
                <Tab eventKey="checking" title="รอตรวจสอบ" />
                <Tab eventKey="preparing" title="รอจัดเตรียม" />
                <Tab eventKey="ready_to_ship" title="รอจัดส่ง" />
                <Tab eventKey="shipping" title="ระหว่างจัดส่ง" />
                <Tab eventKey="delivered" title="จัดส่งเสร็จสิ้น" />
                <Tab eventKey="cancelled" title="ยกเลิก" />
            </Tabs>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>หมายเลขคำสั่งซื้อ</th>
                        <th>วันที่</th>
                        <th>รายการสินค้า</th>
                        <th>สถานะ</th>
                        <th>จำนวนเงิน</th>
                        <th>ดูรายละเอียด</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>#{order.order_number}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>{order.items?.map((p) => p.product_name).join(", ")}</td>
                            <td>
                                <Badge bg={statusColor[order.status] || "secondary"}>
                                    {order.status}
                                </Badge>
                            </td>
                            <td>{order.total_price} บาท</td>
                            <td className="text-center">
                                <Button variant="primary" onClick={() => handleShowDetail(order)}>ดู</Button>
                            </td>
                            <td className="text-center">
                                {order.status === "pending" && (
                                    <Button variant="danger" size="sm" onClick={() => handleCancelOrder(order.id)}>ยกเลิก</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedOrder && (
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>รายละเอียดคำสั่งซื้อ #{selectedOrder.order_number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>วันที่สั่งซื้อ:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                        <p><strong>ชื่อผู้รับ:</strong> {selectedOrder.contact_name}</p>
                        <p><strong>เบอร์โทรผู้รับ:</strong> {selectedOrder.phone}</p>
                        <p><strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.address}</p>
                        <p><strong>วิธีชำระเงิน:</strong> {selectedOrder.payment_method === "qr" ? "QR Code" : "ปลายทาง/ออนไลน์"}</p>

                        {selectedOrder.status === "cancelled" && selectedOrder.cancelled_at && (
                            <p>
                                <strong>ยกเลิกเมื่อ:</strong>{" "}
                                <span style={{ color: 'red' }}>{new Date(selectedOrder.cancelled_at).toLocaleString()}</span>
                            </p>
                        )}

                        <p><strong>รายการสินค้า:</strong></p>
                        <Table bordered size="sm" className="align-middle text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>สินค้า</th>
                                    <th>จำนวน</th>
                                    <th>ราคา/หน่วย</th>
                                    <th>ส่วนลด</th>
                                    <th>รวมสุทธิ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price} บาท</td>
                                        <td>{item.discount || 0} บาท</td>
                                        <td>{item.price * item.quantity - (item.discount || 0)} บาท</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <p><strong>รวมทั้งหมด:</strong> {selectedOrder.total_price} บาท</p>
                        <p><strong>สถานะ:</strong>{" "}
                            <Badge bg={statusColor[selectedOrder.status] || "secondary"}>
                                {selectedOrder.status}
                            </Badge>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>ปิด</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default OrderStatus;
