// src/components/Checkout.tsx (แก้ไขฟังก์ชันตอนกดปุ่ม)
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  // รับข้อมูลที่นั่งมาจากหน้า EventDetails
  const selectedSeats = location.state?.selectedSeats || [];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. เช็คว่า Login หรือยัง
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนซื้อตั๋ว');
      navigate('/login');
      return;
    }

    // 2. ดึงเฉพาะ ID ของที่นั่งที่เลือก
    const seatIds = selectedSeats.map((seat: any) => seat.id);

    // 3. ยิง API ซื้อตั๋ว
    try {
      const response = await fetch('http://localhost:5000/api/tickets/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ส่ง Token ไปยืนยันตัวตน
        },
        body: JSON.stringify({ seatIds })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('ซื้อตั๋วสำเร็จ! ตั๋วถูกเก็บไว้ในคลังของคุณแล้ว');
        navigate('/'); // ซื้อเสร็จกลับหน้าแรก
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('ระบบขัดข้อง');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-10 text-white">
      <h2 className="text-3xl font-bold mb-8">สรุปการสั่งซื้อ</h2>
      
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <h3 className="text-xl mb-4">ที่นั่งที่คุณเลือก:</h3>
        <ul className="list-disc list-inside mb-4">
          {selectedSeats.map((seat: any) => (
            <li key={seat.id}>โซน {seat.tier} - แถว {seat.row} ที่นั่ง {seat.number}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleCheckout}>
        {/* ซ่อนฟอร์มกรอกบัตรเครดิตไว้ก่อน เพราะเราจำลองระบบซื้อเข้าคลังเลย */}
        <button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg"
        >
          ยืนยันการรับตั๋วเข้าคลัง
        </button>
      </form>
    </div>
  );
}