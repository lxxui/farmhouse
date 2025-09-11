import React, { useState, useEffect, useRef } from "react";
import provinces from '../data/provinces.json';
import districts from '../data/districts.json';
import subdistricts from '../data/subdistricts.json';
// import OrderStatus from '../components/checkStatus';
import AddProduct from "./addProduct";
import ProductManagement from "./productManagement";

import Swal from "sweetalert2";
import AdminOrders from "./adminOrders";
import { MapContainer, TileLayer, Marker, useMapEvents , Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function ProfilePage({ user, setUser }) {
    const [activeMenu, setActiveMenu] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        contact_name: "",
        house_number: "",
        village: "",
        lane: "",         // ✅ เพิ่มตรงนี้
        street: "",
        sub_district: "",
        district: "",
        province: "",
        postal_code: "",
    });


    const mapRef = useRef(null);
    // custom icon แบบ divIcon ใช้ Font Awesome
    const customIcon = L.divIcon({
        html: `<i class="fas fa-map-marker-alt" style="color: red; font-size: 30px;"></i>`,
        iconSize: [30, 30],        // ขนาดกล่อง icon
        iconAnchor: [15, 30],      // จุดยึดกับพิกัด (ตรงปลายหมุด)
        className: "my-custom-icon" // ป้องกัน default leaflet styles
    });

    const [markerPosition, setMarkerPosition] = useState({
        latitude: formData.latitude || 13.7563,
        longitude: formData.longitude || 100.5018
    });
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setAddress({ latitude: lat, longitude: lng });
            },
        });
        return null;
    }


    /* dc */
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/branches") // endpoint ของคุณ
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // ✅ ถ้า data เป็น array
                    setBranches(
                        data.map(dc => ({
                            ...dc,
                            latitude_address: parseFloat(dc.latitude_address),
                            longitude_address: parseFloat(dc.longitude_address)
                        }))
                    );
                } else {
                    console.error("API error:", data);
                    setBranches([]);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setBranches([]);
            });
    }, []);

    // บ้าน user
    const [address, setAddress] = useState({ latitude: 13.7563, longitude: 100.5018 });
    // สาขา DC
    const [nearestBranch, setNearestBranch] = useState(null);

    // custom icon บ้าน
    const homeIcon = L.divIcon({
        html: `<i class="fas fa-map-marker-alt" style="color: red; font-size: 30px;"></i>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        className: "home-icon"
    });

    const dcIcon = L.icon({
        iconUrl: '/image/logo_top.png', // ✅ ต้องมีไฟล์นี้อยู่ใน public/image/
        iconSize: [40, 15],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });



    // ฟังก์ชันคำนวณระยะทาง
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const toRad = deg => deg * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }



    useEffect(() => {
        if (branches.length === 0) return;

        const candidates = branches
            .filter(dc => dc.latitude_address && dc.longitude_address)
            .map(dc => {
                const lat = parseFloat(dc.latitude_address);
                const lon = parseFloat(dc.longitude_address);
                if (isNaN(lat) || isNaN(lon)) return null;

                return {
                    ...dc,
                    distance: getDistanceFromLatLonInKm(address.latitude, address.longitude, lat, lon),
                    latitude_address: lat, // ✅ update ให้เป็น number
                    longitude_address: lon // ✅ update ให้เป็น number
                };
            })
            .filter(Boolean);

        const nearest = candidates.sort((a, b) => a.distance - b.distance)[0];
        console.log("Nearest branch:", nearest); // 🔍 ต้องเห็น object พร้อม distance

        setNearestBranch(nearest);
    }, [address.latitude, address.longitude, branches.length]);




    // อัปเดต formData เมื่อ user ถูกโหลด
    useEffect(() => {
        if (!user) {
            setFormData({
                username: "",
                email: "",
                phone: "",
                contact_name: "",
                house_number: "",
                village: "",
                street: "",
                province: "",
                district: "",
                sub_district: "",
                postal_code: "",
            });
            return;
        }

        setFormData({
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            contact_name: user.username || "",
            house_number: "",
            village: "",
            street: "",
            province: "",
            district: "",
            sub_district: "",
            postal_code: "",
        });

        const fetchAddress = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://localhost:3001/user/${user.id}/address`);
                const data = await res.json();
                if (data.success && data.address) {
                    setFormData(prev => ({
                        ...prev,
                        contact_name: data.address.contact_name || "",
                        house_number: data.address.house_number || "",
                        village: data.address.village || "",
                        lane: data.address.lane || "",
                        street: data.address.street || "",
                        province: data.address.province || "",
                        district: data.address.district || "",
                        sub_district: data.address.sub_district || "",

                        postal_code: data.address.postal_code || "",
                        phone: data.address.phone || "",
                    }));

                    // ✅ อัปเดตตำแหน่งแผนที่ด้วย latitude/longitude จาก DB
                    if (data.address.latitude && data.address.longitude) {
                        setAddress({
                            latitude: data.address.latitude,
                            longitude: data.address.longitude
                        });
                    }

                    const province = provinces.find(p => p.provinceNameTh === data.address.province);
                    setSelectedProvinceCode(province?.provinceCode || "");

                    const district = districts.find(
                        d => d.districtNameTh === data.address.district && d.provinceCode === province?.provinceCode
                    );
                    setSelectedDistrictCode(district?.districtCode || "");
                }
            } catch (err) {
                console.error("Fetch address error:", err);
            }
        };

        fetchAddress();

    }, [user]);


    const menuItems = [
        { key: "profile", label: "ข้อมูลส่วนตัว", icon: "fas fa-user" },
        { key: "address", label: "ข้อมูลที่อยู่", icon: "fas fa-map-marker-alt" },
        ...(user?.role === "admin"
            ? [{ key: "addProduct", label: "เพิ่มข้อมูลผลิตภัณฑ์", icon: "fas fa-plus" },
            { key: "productMangement", label: "จัดการสินค้า", icon: "fas fa-plus" }
            ]
            : []),
    ];



    const handleMenuClick = (key) => {
        setActiveMenu(key);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "province") {
            const province = provinces.find(p => p.provinceNameTh === value);
            setSelectedProvinceCode(province ? province.provinceCode : "");
            setFormData(prev => ({ ...prev, district: "", sub_district: "", postal_code: "" }));
        }

        if (name === "district") { // เดิมคือ amphoe
            const district = districts.find(d => d.districtNameTh === value && d.provinceCode === selectedProvinceCode);
            setSelectedDistrictCode(district ? district.districtCode : "");
            setFormData(prev => ({ ...prev, sub_district: "", postal_code: district ? district.postalCode : "" }));
        }

        if (name === "sub_district") { // เดิมคือ subdistrict
            const subdistrict = subdistricts.find(s => s.subdistrictNameTh === value && s.districtCode === selectedDistrictCode);
            if (subdistrict) {
                setFormData(prev => ({ ...prev, postal_code: subdistrict.postalCode }));
            }
        }

    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/user/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // อัปเดต state user และ formData ให้ตรงกัน
                setUser(prev => ({ ...prev, username: formData.username, email: formData.email, phone: formData.phone }));
                Swal.fire({
                    icon: "success",
                    title: "บันทึกข้อมูลเรียบร้อย",
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsEditing(false);
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.error || "บันทึกข้อมูลไม่สำเร็จ",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Update user error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleAddressSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/user/${user.id}/address`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contact_name: formData.contact_name,
                    house_number: formData.house_number,
                    village: formData.village,
                    lane: formData.lane,
                    street: formData.street,
                    district: formData.district,
                    sub_district: formData.sub_district,
                    province: formData.province,
                    postal_code: formData.postal_code,
                    phone: formData.phone,
                    latitude: address.latitude,    // ✅ เพิ่ม latitude
                    longitude: address.longitude   // ✅ เพิ่ม longitude
                }),

            });

            const data = await response.json();
            console.log("Address update response:", data);

            if (response.ok && data.success) {
                // สร้าง object user ใหม่รวม address
                const updatedUser = {
                    ...user,
                    address: {
                        contact_name: formData.contact_name,
                        house_number: formData.house_number,
                        village: formData.village,
                        lane: formData.lane,
                        street: formData.street,
                        district: formData.district,
                        sub_district: formData.sub_district,
                        province: formData.province,
                        postal_code: formData.postal_code,
                        phone: formData.phone,
                        latitude: address.latitude,    // ✅
                        longitude: address.longitude   // ✅
                    }
                };
                // อัปเดต state
                setUser(updatedUser);

                // อัปเดต localStorage
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // ปิดโหมดแก้ไข
                setIsEditingAddress(false);

                Swal.fire({
                    icon: "success",
                    title: "บันทึกข้อมูลเรียบร้อย",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.error || "บันทึกข้อมูลไม่สำเร็จ",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            console.error("Update address error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
                timer: 2000,
                showConfirmButton: false
            });
        }
    };


    useEffect(() => {
        if (!user?.id) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3001/user/${user.id}`);
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(prev => ({ ...prev, ...data.user }));
                    setFormData(prev => ({
                        ...prev,
                        username: data.user.username || "",
                        email: data.user.email || "",
                        phone: data.user.phone || "",
                        role: data.user.role || "",
                        latitude: data.user.latitude || "",
                        longitude: data.user.longitude

                    }));
                }
            } catch (err) {
                console.error("Fetch user error:", err);
            }
        };

        fetchUser();
    }, [user?.id, setUser, setFormData]);





    const renderContent = () => {
        if (!user) return (
            <div>
                <h4>กรุณาเข้าสู่ระบบ</h4>
                <p>คุณต้องเข้าสู่ระบบก่อนจึงจะดูข้อมูลได้</p>
            </div>
        );

        switch (activeMenu) {
            case "profile":
                return (
                    <div>
                        <h4>ข้อมูลส่วนตัว</h4>
                        <p>
                            ชื่อ: {isEditing ? <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" /> : formData.username}
                        </p>
                        <p>
                            อีเมล: {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" /> : formData.email}
                        </p>
                        <p>
                            เบอร์โทรศัพท์: {isEditing ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" /> : formData.phone}
                        </p>
                        {isEditing ? (
                            <button className="btn btn-success mt-2" onClick={handleSave}>บันทึก</button>
                        ) : (
                            <button className="btn btn-primary mt-2" onClick={handleEdit}>แก้ไขข้อมูล</button>
                        )}
                    </div>
                );

            case "address":
                return (
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label>ชื่อผู้ติดต่อ</label>
                            <input
                                type="text"
                                name="contact_name"
                                value={formData.contact_name || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>บ้านเลขที่</label>
                            <input
                                type="text"
                                name="house_number"
                                value={formData.house_number || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>ซอย</label>
                            <input
                                type="text"
                                name="lane"
                                value={formData.lane || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>หมู่บ้าน/คอนโด</label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>ถนน</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street || ""}
                                onChange={handleChange}
                                className="form-control"
                                readOnly={!isEditingAddress}
                            />
                        </div>
                        <div className="col-md-6">
                            <label>จังหวัด</label>
                            <select
                                name="province"
                                value={formData.province || ""}
                                onChange={handleChange}
                                className="form-control"
                                disabled={!isEditingAddress}
                            >
                                <option value="">-- เลือกจังหวัด --</option>
                                {provinces.map(p => (
                                    <option key={p.provinceCode} value={p.provinceNameTh}>{p.provinceNameTh}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>เขต/อำเภอ</label>
                            <select
                                name="district"
                                value={formData.district || ""}
                                onChange={handleChange}
                                className="form-control"
                                disabled={!isEditingAddress}
                            >
                                <option value="">-- เลือกอำเภอ --</option>
                                {districts
                                    .filter(d => d.provinceCode === selectedProvinceCode)
                                    .map(d => (
                                        <option key={d.districtCode} value={d.districtNameTh}>{d.districtNameTh}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>แขวง/ตำบล</label>
                            <select
                                name="sub_district"
                                value={formData.sub_district || ""}
                                onChange={handleChange}
                                className="form-control"
                                disabled={!isEditingAddress}
                            >
                                <option value="">-- เลือกตำบล --</option>
                                {subdistricts
                                    .filter(s => s.districtCode === selectedDistrictCode)
                                    .map(s => (
                                        <option key={s.subdistrictCode} value={s.subdistrictNameTh}>{s.subdistrictNameTh}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code || ""}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {/* Map + Marker */}
                        <div className="col-12 mt-3">
                            <label>ปักหมุดพิกัดที่อยู่</label>
                            <MapContainer
                                center={[address.latitude, address.longitude]}
                                zoom={13}
                                style={{ height: "300px", width: "100%" }}
                            >
                                <TileLayer url={`https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}`} />

                                {/* Marker บ้าน */}
                                <Marker
                                    position={[address.latitude, address.longitude]}
                                    draggable={isEditingAddress}
                                    icon={homeIcon}
                                    eventHandlers={{
                                        dragend: (e) => {
                                            const { lat, lng } = e.target.getLatLng();
                                            setAddress({ latitude: lat, longitude: lng });
                                        },
                                    }}
                                />

                                {/* Marker DC */}
                                {branches.map(dc => (
                                    dc.latitude_address && dc.longitude_address && (
                                        <Marker
                                            key={dc.DC}
                                            position={[parseFloat(dc.latitude_address), parseFloat(dc.longitude_address)]}
                                            icon={dcIcon}
                                        >
                                            {/* Popup เมื่อคลิก Marker */}
                                            <Popup>
                                                <strong>สาขา:</strong> {dc.DC_TH} <br />
                                                {dc.DC}
                                            </Popup>
                                        </Marker>
                                    )
                                ))}



                                {isEditingAddress && <MapClickHandler />}
                            </MapContainer>

                            {/* พิกัดบ้าน */}
                            <input
                                type="text"
                                className="form-control mt-2"
                                value={`${address.latitude}, ${address.longitude}`}
                                readOnly
                            />

                            {/* ระยะทาง */}
                            <div className="mt-3">
                                <h2>ระยะทางจากบ้านไปแต่ละสาขา</h2>
                                {nearestBranch ? (
                                    <p>
                                        สาขาที่ใกล้ที่สุด: {nearestBranch.DC_TH} ({nearestBranch.distance.toFixed(2)} กม.)
                                    </p>
                                ) : (
                                    <p>กำลังโหลดข้อมูลสาขา...</p>
                                )}
                            </div>
                        </div>

                        <div className="col-12 mt-2">
                            {isEditingAddress ? (
                                <button className="btn btn-success" onClick={handleAddressSave}>บันทึก</button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => setIsEditingAddress(true)}>แก้ไขข้อมูล</button>
                            )}
                        </div>

                    </div>
                );


            // case "orders":
            //     return (
            //         <div>
            //             {/* หน้าเช็คสถานะ*/}
            //             <OrderStatus userId={user.id} />
            //         </div>
            //     );

            case "addProduct":
                return (
                    <div>
                        {/* หน้าเช็คสถานะ*/}
                        <AddProduct userId={user.id} />
                    </div>
                );

            case "adminOrders":
                return (
                    <div>
                        {/* หน้าเช็คสถานะ*/}
                        <AdminOrders userId={user.id} />
                    </div>
                );

            case "productMangement":
                return (
                    <div>
                        {/* หน้าเช็คสถานะ*/}
                        <ProductManagement userId={user.id} />
                    </div>
                );


            default:
                return null;
        }
    };

    return (
        <div style={{ paddingTop: '80px', paddingBottom: '20px' }}> {/*className="container" */}
            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-2 col-sm-12 mb-3">
                        <div className="list-group">
                            {menuItems.map(item => {
                                // ถ้าเป็นเมนู addProduct แต่ user ไม่ใช่ admin ให้ข้าม
                                if (item.key === "addProduct" && user?.role !== "admin") return null;

                                return (
                                    <button
                                        key={item.key}
                                        className={`list-group-item list-group-item-action ${activeMenu === item.key ? "active" : ""}`}
                                        onClick={() => handleMenuClick(item.key)}
                                    >
                                        <i className={`${item.icon} me-2`}></i> {item.label}
                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-10 col-sm-12">
                        <div className="card p-3 shadow-sm">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
