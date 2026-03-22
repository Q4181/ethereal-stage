import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

export default function Login() {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password123');
  const [modal, setModal] = useState({ open: false, type: 'info' as 'success' | 'error', title: '', msg: '' });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setModal({ open: true, type: 'success', title: 'สำเร็จ!', msg: 'เข้าสู่ระบบเรียบร้อยแล้ว' });
      } else {
        setModal({ open: true, type: 'error', title: 'ล้มเหลว', msg: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }
    } catch (err) {
      setModal({ open: true, type: 'error', title: 'ผิดพลาด', msg: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-6">
      <Modal 
        isOpen={modal.open} 
        type={modal.type} 
        title={modal.title} 
        message={modal.msg} 
        onClose={() => {
          setModal({ ...modal, open: false });
          if (modal.type === 'success') window.location.href = '/';
        }} 
      />
      <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-white">เข้าสู่ระบบ</h2>
        <p className="text-gray-500 text-center mb-8">เพื่อดำเนินการจองตั๋วคอนเสิร์ต</p>
        <div className="mb-5">
          <label className="block text-gray-400 text-sm font-bold mb-2">อีเมล</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div className="mb-8">
          <label className="block text-gray-400 text-sm font-bold mb-2">รหัสผ่าน</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-bold text-lg transition shadow-lg">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}