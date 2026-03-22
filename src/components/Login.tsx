// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('user@test.com'); // ใส่ค่าเริ่มต้นให้เทสง่ายๆ
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token); // เก็บ Token ไว้ใช้ตอนซื้อตั๋ว
      alert('เข้าสู่ระบบสำเร็จ!');
      navigate('/'); // กลับไปหน้าแรก
    } else {
      alert('เข้าสู่ระบบล้มเหลว: ' + data.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-lg backdrop-blur-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-black/50 border border-white/20 text-white"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-black/50 border border-white/20 text-white"
          placeholder="Password"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition">
          Login
        </button>
      </form>
    </div>
  );
}