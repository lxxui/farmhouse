import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Modal, Form, Row, Col } from "react-bootstrap";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [counts, setCounts] = useState({});

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    const statusColor = {
        pending: "warning",
        confirmed: "primary",
        paid: "success",
        shipped: "info",
        completed: "success",
        cancelled: "danger",
    };

    // โหลด orders + count status
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/admin/orders`);
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                    const newCounts = {};
                    data.orders.forEach(o => {
                        newCounts[o.status] = (newCounts[o.status] || 0) + 1;
                    });
                    setCounts(newCounts);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // อัปเดตสถานะ
    const updateStatus = async (id, status) => {
        const res = await fetch(`http://localhost:3001/admin/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (data.success) {
            setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
            setCounts(prev => {
                const newCounts = { ...prev };
                const oldStatus = orders.find(o => o.id === id)?.status;
                if (oldStatus) newCounts[oldStatus] -= 1;
                newCounts[status] = (newCounts[status] || 0) + 1;
                return newCounts;
            });
        } else {
            alert("เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถอัปเดตสถานะได้"));
        }
    };

    // Modal
    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    // Filter + Search + Pagination
    const filteredOrders = orders
        .filter(o =>
            (!statusFilter || o.status === statusFilter) &&
            (search === "" ||
                o.order_number.includes(search) ||
                o.contact_name.toLowerCase().includes(search.toLowerCase()))
        );

    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" /> กำลังโหลดคำสั่งซื้อ...
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">📦 จัดการคำสั่งซื้อ</h2>

            {/* Count Status */}
            <div className="d-flex flex-wrap gap-2 mb-3">
                {Object.entries(statusColor).map(([status, color]) => (
                    <Badge key={status} bg={color} className="p-2">
                        {status.charAt(0).toUpperCase() + status.slice(1)}: {counts[status] || 0} ใบ
                    </Badge>
                ))}
            </div>

            {/* Filter + Search */}
            <Row className="mb-3 align-items-center">
                <Col md={4} className="mb-2 mb-md-0">
                    <Form.Control
                        placeholder="ค้นหา Order หรือ ชื่อลูกค้า"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col md={3} className="mb-2 mb-md-0">
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">สถานะทั้งหมด</option>
                        {Object.keys(statusColor).map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={5} className="text-md-end">
                    <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}>
                        รีเซ็ต Filter
                    </Button>
                </Col>
            </Row>

            {/* Table */}
            <Table striped bordered hover responsive className="align-middle">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>ลูกค้า</th>
                        <th>ยอดรวม</th>
                        <th>ชำระเงิน</th>
                        <th>สถานะ</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOrders.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">ไม่มีคำสั่งซื้อ</td>
                        </tr>
                    )}
                    {paginatedOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.order_number}</td>
                            <td>{order.contact_name} ({order.phone})</td>
                            <td>{order.total_price} บาท</td>
                            <td>{order.payment_method}</td>
                            <td>
                                <Badge bg={statusColor[order.status] || "secondary"} className="d-inline-block mb-2">
                                    {order.status}
                                </Badge>
                            </td>
                            <td>
                                <div className="d-flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline-primary"
                                        onClick={() => updateStatus(order.id, "confirmed")}
                                        disabled={order.status !== "pending"}>ยืนยัน</Button>

                                    <Button size="sm" variant="outline-info"
                                        onClick={() => updateStatus(order.id, "shipped")}
                                        disabled={order.status !== "confirmed" && order.status !== "paid"}>จัดส่งแล้ว</Button>

                                    <Button size="sm" variant="success"
                                        onClick={() => updateStatus(order.id, "completed")}
                                        disabled={(order.payment_method === "COD" && order.status !== "paid") || order.status === "pending" || order.status === "cancelled"}
                                        title={order.payment_method === "COD" && order.status !== "paid" ? "รอยืนยันชำระเงิน COD" : ""}>
                                        สำเร็จ
                                    </Button>

                                    <Button size="sm" variant="danger"
                                        onClick={() => updateStatus(order.id, "cancelled")}
                                        disabled={order.status === "completed" || order.status === "shipped"}>ยกเลิก</Button>

                                    <Button size="sm" variant="secondary"
                                        onClick={() => handleShowModal(order)}>ดูรายละเอียด</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} / {totalPages}</span>
                <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>รายละเอียดคำสั่งซื้อ #{selectedOrder.order_number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>ลูกค้า:</strong> {selectedOrder.contact_name} ({selectedOrder.phone})</p>
                        <p><strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.address}</p>
                        <p><strong>รายการสินค้า:</strong></p>
                        <Table bordered size="sm">
                            <thead>
                                <tr>
                                    <th>สินค้า</th>
                                    <th>จำนวน</th>
                                    <th>ราคา/หน่วย</th>
                                    <th>ส่วนลด</th>
                                    <th>รวม</th>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>ปิด</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
