import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Ticket, ArrowLeft, Archive } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('ออกจากระบบแล้ว');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* ปุ่ม Back จะโชว์เมื่อไม่ได้อยู่หน้าแรก */}
            {location.pathname !== '/' && (
              <button onClick={() => navigate(-1)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                <ArrowLeft size={20} />
              </button>
            )}
            <Link to="/" className="text-2xl font-extrabold text-blue-500 tracking-tighter flex items-center gap-2 hover:scale-105 transition-transform">
              <Ticket className="w-8 h-8" /> ETHEREAL STAGE
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {token ? (
              <>
                <Link to="/inventory" className="flex items-center gap-2 text-gray-400 hover:text-white transition font-bold">
                  <Archive size={20} /> คลังตั๋วของฉัน
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition font-bold">
                  <LogOut size={20} /> ออกจากระบบ
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition font-bold">
                <User size={20} /> เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="py-8 text-center text-gray-600 border-t border-gray-900 bg-gray-950 mt-12 text-sm">
        © 2024 Ethereal Stage. All rights reserved.
      </footer>
    </div>
  );
}