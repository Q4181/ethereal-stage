import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSeats = location.state?.selectedSeats || [];
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: 'success' as 'success' | 'error', title: '', msg: '' });

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModal({ open: true, type: 'error', title: 'แจ้งเตือน', msg: 'กรุณาเข้าสู่ระบบก่อนซื้อตั๋ว' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tickets/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ seatIds: selectedSeats.map((s: any) => s.id) })
      });
      const data = await response.json();
      if (data.success) {
        setModal({ open: true, type: 'success', title: 'ชำระเงินเสร็จสิ้น!', msg: 'ตั๋วของคุณถูกบันทึกเข้าคลังเรียบร้อยแล้ว' });
      } else {
        setModal({ open: true, type: 'error', title: 'เกิดข้อผิดพลาด', msg: data.error });
      }
    } catch (err) {
      setModal({ open: true, type: 'error', title: 'ผิดพลาด', msg: 'ระบบขัดข้อง' });
    }
    setLoading(false);
  };

  const total = selectedSeats.reduce((sum: number, seat: any) => sum + seat.price, 0);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Modal 
        isOpen={modal.open} 
        type={modal.type} 
        title={modal.title} 
        message={modal.msg} 
        onClose={() => {
          setModal({ ...modal, open: false });
          if (modal.type === 'success') navigate('/inventory');
          else if (modal.msg.includes('เข้าสู่ระบบ')) navigate('/login');
        }} 
      />
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center">สรุปการสั่งซื้อ</h2>
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-xl mb-8">
        <h3 className="text-gray-400 mb-4 font-bold">ที่นั่งที่คุณเลือก</h3>
        <div className="space-y-3 mb-8">
          {selectedSeats.map((seat: any) => (
            <div key={seat.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
              <div>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mr-3">{seat.tier}</span>
                <span className="text-white font-bold">แถว {seat.row} ที่นั่ง {seat.number}</span>
              </div>
              <span className="text-gray-300 font-bold">${seat.price}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
          <span className="text-xl text-gray-400 font-bold">ยอดรวมทั้งหมด</span>
          <span className="text-4xl text-blue-400 font-extrabold">${total}</span>
        </div>
      </div>
      <button onClick={handleCheckout} disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-5 rounded-2xl text-xl transition shadow-lg">
        {loading ? 'กำลังดำเนินการ...' : 'ยืนยันและรับตั๋วทันที'}
      </button>
    </div>
  );
}