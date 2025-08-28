import React, { useState, useEffect } from "react";
import { Tab, Tabs, Table, Badge, Button, Modal } from "react-bootstrap";

function OrderStatus({ user }) {
    const [key, setKey] = useState("all");
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch orders ของ user
    useEffect(() => {
        if (!user?.id) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:3001/orders/user/${user.id}`);
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, [user]);

    const handleShowDetail = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const statusColor = {
        pending: "warning",
        checking: "primary",
        shipping: "info",
        delivered: "success",
        cancelled: "danger",
    };

    // Filter orders ตาม tab
    const filteredOrders = orders.filter((order) => (key === "all" ? true : order.status === key));

    return (
        <div className="container" ห>
            <h4 className="mb-3">ตรวจสอบสถานะคำสั่งซื้อ</h4>

            <Tabs id="statusTab" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                <Tab eventKey="all" title="ทั้งหมด" />
                <Tab eventKey="pending" title="รอชำระเงิน" />
                <Tab eventKey="checking" title="รอตรวจสอบ" />
                <Tab eventKey="shipping" title="กำลังจัดส่ง" />
                <Tab eventKey="delivered" title="จัดส่งเสร็จสิ้น" />
                <Tab eventKey="cancelled" title="ยกเลิกแล้ว" />
            </Tabs>

            <Table bordered>
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>หมายเลขคำสั่งซื้อ</th>
                        <th>วันที่</th>
                        <th>รายการสินค้า</th>
                        <th>สถานะ</th>
                        <th>จำนวนเงิน</th>
                        <th>ดูรายละเอียด</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>#{order.order_number}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>{order.items.map((p) => p.product_name).join(", ")}</td>
                            <td>
                                <Badge bg={statusColor[order.status] || "secondary"}>{order.status}</Badge>
                            </td>
                            <td>{order.total_price} บาท</td>
                            <td className="text-center">
                                <Button variant="primary" onClick={() => handleShowDetail(order)}>
                                    ดู
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal รายละเอียดคำสั่งซื้อ */}
            {selectedOrder && (
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>รายละเอียดคำสั่งซื้อ #{selectedOrder.order_number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <strong>วันที่สั่งซื้อ:</strong>{" "}
                            {new Date(selectedOrder.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>ชื่อผู้รับ:</strong> {selectedOrder.contact_name}
                        </p>
                        <p>
                            <strong>เบอร์โทรผู้รับ:</strong> {selectedOrder.phone}
                        </p>
                        <p>
                            <strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.address}
                        </p>

                        <p>
                            <strong>รายการสินค้า:</strong>
                        </p>
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
                                {selectedOrder.items.map((item, i) => (
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

                        <p>
                            <strong>รวมทั้งหมด:</strong> {selectedOrder.total_price} บาท
                        </p>
                        <p>
                            <strong>สถานะ:</strong>{" "}
                            <Badge bg={statusColor[selectedOrder.status] || "secondary"}>
                                {selectedOrder.status}
                            </Badge>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            ปิด
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default OrderStatus;
