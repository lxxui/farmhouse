import React, { useState } from "react";
import { Tab, Tabs, Table, Badge, Button, Modal } from "react-bootstrap";

const orders = [
    {
        id: "ORD123456",
        date: "25/07/2025",
        products: [
            {
                name: "ขนมปังสังขยา x2",
                weight: "120 กรัม",
                unitPrice: 100,
                discount: 10,
                priceBeforeVAT: 90,
                VAT: 6.3,
                netPrice: 96.3,
            },
            {
                name: "เบอร์เกอร์หมู x1",
                weight: "150 กรัม",
                unitPrice: 50,
                discount: 0,
                priceBeforeVAT: 50,
                VAT: 3.5,
                netPrice: 53.5,
            },
        ],
        totalPrice: 150,
        status: "กำลังจัดส่ง",
        statusBadge: "warning",
        receiverName: "บ้านฟาร์ม ฟาร์มสุข",
        receiverPhone: "08x-xxx-xxxx",
        address: "123 หมู่บ้านสุขใจ, กรุงเทพฯ 10200",
        eTaxLink: "/etax/invoice_ORD123456.pdf",
        eTaxStatus: "ขอรับ",
        deliveryCompany: "Farmhouse Delivery",
        vehicleReg: "กข 1234 กรุงเทพฯ",
        deliveryPerson: {
            name: "สมชาย ใจดี",
            phone: "08x-xxx-xxxx",
        },
        parcelNumber: "KEX123456789",
    },
];

function OrderStatus() {
    const [key, setKey] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleShowDetail = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // กรองออเดอร์ตาม tab ถ้าจำเป็นก็เพิ่ม logic ตาม status
    // ตอนนี้มีแค่ order เดียวเลยแสดงทั้งหมด
    const filteredOrders = orders.filter(() => true);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">ตรวจสอบสถานะคำสั่งซื้อ</h4>

            <Tabs
                id="statusTab"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab
                    eventKey="all"
                    title={
                        <>
                            <i className="fas fa-tasks me-1"></i> ทั้งหมด
                        </>
                    }
                />
                <Tab
                    eventKey="pending"
                    title={
                        <>
                            <i className="fas fa-credit-card me-1 text-warning"></i> รอชำระเงิน
                        </>
                    }
                />
                <Tab
                    eventKey="checking"
                    title={
                        <>
                            <i className="fas fa-search me-1 text-primary"></i> รอตรวจสอบ
                        </>
                    }
                />
                <Tab
                    eventKey="shipping"
                    title={
                        <>
                            <i className="fas fa-truck me-1 text-info"></i> รอจัดส่ง
                        </>
                    }
                />
                <Tab
                    eventKey="delivered"
                    title={
                        <>
                            <i className="fas fa-box-open me-1 text-success"></i> จัดส่งเสร็จสิ้น
                        </>
                    }
                />
                <Tab
                    eventKey="cancelled"
                    title={
                        <>
                            <i className="fas fa-times-circle me-1 text-danger"></i> ยกเลิกแล้ว
                        </>
                    }
                />
            </Tabs>

            <div>
                <h5>รายการทั้งหมด</h5>
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
                                <td>#{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.products.map((p) => p.name).join(", ")}</td>
                                <td>
                                    <Badge bg={order.statusBadge}>{order.status}</Badge>
                                </td>
                                <td>{order.totalPrice} บาท</td>
                                <td className="text-center">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleShowDetail(order)}
                                    >
                                        ดู
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal รายละเอียดคำสั่งซื้อ */}
            {selectedOrder && (
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            รายละเอียดคำสั่งซื้อ #{selectedOrder.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <strong>วันที่สั่งซื้อ:</strong> {selectedOrder.date}
                        </p>
                        <p>
                            <strong>ชื่อผู้รับ:</strong> {selectedOrder.receiverName}
                        </p>
                        <p>
                            <strong>เบอร์โทรผู้รับ:</strong> {selectedOrder.receiverPhone}
                        </p>
                        <p>
                            <strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.address}
                        </p>

                        <p>
                            <strong>ใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax):</strong>{" "}
                            <Badge bg="success">{selectedOrder.eTaxStatus}</Badge>
                        </p>
                        <p>
                            <a
                                href={selectedOrder.eTaxLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-success"
                            >
                                ดาวน์โหลดใบกำกับภาษี
                            </a>
                        </p>

                        <p>
                            <strong>รายการสินค้า:</strong>
                        </p>
                        <Table
                            bordered
                            size="sm"
                            className="align-middle text-center"
                        >
                            <thead className="table-light">
                                <tr>
                                    <th>สินค้า</th>
                                    <th>น้ำหนัก</th>
                                    <th>ราคาต่อหน่วย</th>
                                    <th>ส่วนลด</th>
                                    <th>ราคาก่อน VAT</th>
                                    <th>VAT (7%)</th>
                                    <th>รวมสุทธิ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.products.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.name}</td>
                                        <td>{p.weight}</td>
                                        <td>{p.unitPrice} บาท</td>
                                        <td>{p.discount} บาท</td>
                                        <td>{p.priceBeforeVAT} บาท</td>
                                        <td>{p.VAT} บาท</td>
                                        <td>{p.netPrice} บาท</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="table-warning fw-bold">
                                    <td colSpan="4" className="text-end">
                                        รวมทั้งหมด
                                    </td>
                                    <td>
                                        {selectedOrder.products.reduce(
                                            (sum, p) => sum + p.priceBeforeVAT,
                                            0
                                        )}{" "}
                                        บาท
                                    </td>
                                    <td>
                                        {selectedOrder.products.reduce((sum, p) => sum + p.VAT, 0)}{" "}
                                        บาท
                                    </td>
                                    <td>
                                        {selectedOrder.products.reduce(
                                            (sum, p) => sum + p.netPrice,
                                            0
                                        )}{" "}
                                        บาท
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>

                        <p>
                            <strong>รวมทั้งสิ้น:</strong> {selectedOrder.totalPrice} บาท
                        </p>

                        <p>
                            <strong>สถานะ:</strong>{" "}
                            <Badge bg={selectedOrder.statusBadge}>{selectedOrder.status}</Badge>
                        </p>

                        <p>
                            <strong>ขนส่ง:</strong> {selectedOrder.deliveryCompany}
                        </p>
                        <p>
                            <strong>เลขทะเบียนรถ:</strong> {selectedOrder.vehicleReg}
                        </p>
                        <p>
                            <strong>พนักงานส่งของ:</strong>{" "}
                            {selectedOrder.deliveryPerson.name} (
                            <a href={`tel:${selectedOrder.deliveryPerson.phone}`}>
                                {selectedOrder.deliveryPerson.phone}
                            </a>
                            )
                        </p>

                        <p>
                            <strong>เลขพัสดุ:</strong> {selectedOrder.parcelNumber}
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
