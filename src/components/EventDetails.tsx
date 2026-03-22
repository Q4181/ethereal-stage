// src/components/EventDetails.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // แก้ไข Import ให้รองรับได้ครอบคลุมขึ้น
import { Calendar, MapPin, Plus, Minus, Ticket } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cn } from '../types';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // สร้าง State สำหรับเก็บข้อมูลจาก Backend
  const [concert, setConcert] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  // ดึงข้อมูลคอนเสิร์ตและที่นั่งจาก Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/concerts/1') // ดึง ID 1 ที่เรา seed ข้อมูลไว้
      .then(res => res.json())
      .then(data => setConcert(data))
      .catch(err => console.error(err));
  }, []);

  // ฟังก์ชันกดเลือกที่นั่ง
  const toggleSeat = (seat: any) => {
    if (seat.status !== 'AVAILABLE') return; // ถ้าขายแล้วกดไม่ได้
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // ฟังก์ชันกดปุ่มชำระเงิน
  const handleProceed = () => {
    if (selectedSeats.length === 0) return alert('กรุณาเลือกที่นั่งอย่างน้อย 1 ที่');
    // ส่งข้อมูลที่นั่งไปหน้า Checkout
    navigate('/checkout', { state: { selectedSeats } });
  };

  // ระหว่างรอข้อมูลจาก Backend
  if (!concert) return <div className="min-h-screen pt-24 text-white text-center">Loading...</div>;

  // จัดกลุ่มที่นั่งจากฐานข้อมูลแยกเป็น VIP และ Regular
  const vipSeats = concert.seats?.filter((s: any) => s.tier === 'VIP') || [];
  const regularSeats = concert.seats?.filter((s: any) => s.tier === 'Regular') || [];

  // คำนวณราคาสดๆ จากที่นั่งที่เลือก
  const getSeatPrice = (tier: string) => tier === 'VIP' ? 249 : 129;
  const seatsTotal = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat.tier), 0);
  const serviceFee = selectedSeats.length > 0 ? 24.50 : 0;
  const finalTotal = seatsTotal + serviceFee;

  return (
    <div className="min-h-screen pt-24 pb-32 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Map */}
      <section className="lg:col-span-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="text-primary font-label uppercase tracking-widest text-xs font-bold">Live Performance</span>
          {/* เปลี่ยนมาดึง concert.name และข้อมูลจริงจาก Database */}
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">{concert.name}</h1>
          <div className="flex gap-6 text-on-surface-variant text-sm">
            <span className="flex items-center gap-2"><Calendar size={16} /> {concert.date}</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> {concert.venue}</span>
          </div>
        </motion.div>

        {/* Stage Visualization (เหมือนเดิม) */}
        <div className="relative w-full aspect-[16/6] bg-surface-low rounded-xl overflow-hidden flex items-end justify-center pb-4 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          <div className="w-3/4 h-2 bg-primary/40 blur-md absolute bottom-0" />
          <div className="relative z-10 px-12 py-3 bg-surface-high rounded-t-3xl border-t border-white/5 text-center w-2/3">
            <span className="font-headline font-bold text-on-surface-variant tracking-[0.4em] uppercase text-[10px]">Stage Center</span>
          </div>
        </div>

        {/* Seat Grid (ดึงจากฐานข้อมูลจริง) */}
        <div className="bg-surface-container rounded-xl p-8 relative shadow-2xl border border-white/5 overflow-hidden">
          <div className="flex flex-col items-center gap-12 py-8">
            
            {/* VIP Section */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-label text-tertiary-dim tracking-widest uppercase font-bold">VIP Orchestra</span>
              <div className="flex flex-wrap justify-center gap-3">
                {vipSeats.map((seat: any) => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const isSold = seat.status !== 'AVAILABLE';
                  return (
                    <button 
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSold}
                      className={cn(
                        "w-10 h-10 rounded-sm transition-all duration-300 flex items-center justify-center text-xs font-bold",
                        isSold ? "bg-surface-highest opacity-30 cursor-not-allowed" : 
                        isSelected ? "cta-gradient shadow-lg shadow-primary/20 text-black" : 
                        "bg-tertiary/20 hover:bg-tertiary/40 border border-tertiary/10 text-white"
                      )}
                    >
                      {seat.row}{seat.number}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Regular Section */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-label text-on-surface-variant tracking-widest uppercase font-bold">Regular Seating</span>
              <div className="flex flex-wrap justify-center gap-3">
                {regularSeats.map((seat: any) => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const isSold = seat.status !== 'AVAILABLE';
                  return (
                    <button 
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSold}
                      className={cn(
                        "w-10 h-10 rounded-sm transition-all duration-300 flex items-center justify-center text-xs font-bold",
                        isSold ? "bg-surface-highest opacity-30 cursor-not-allowed" : 
                        isSelected ? "bg-surface-highest text-white hover:bg-primary/40 border-2 border-primary" : 
                        "bg-surface-highest hover:bg-primary/40 text-gray-400"
                      )}
                    >
                      {seat.row}{seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-[10px] text-on-surface-variant font-label uppercase font-bold">VIP ($249)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-highest" />
              <span className="text-[10px] text-on-surface-variant font-label uppercase font-bold">Regular ($129)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-highest opacity-30" />
              <span className="text-[10px] text-on-surface-variant font-label uppercase font-bold">Sold Out</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Summary */}
      <aside className="lg:col-span-4 h-fit sticky top-28">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-high rounded-3xl p-8 shadow-2xl border border-white/5 backdrop-blur-md space-y-8"
        >
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Booking Details</h3>
            <div className="space-y-4">
              
              {/* คำนวณรายการที่นั่งที่เลือกจริง */}
              {selectedSeats.length > 0 ? (
                selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-label text-on-surface font-bold">Seat {seat.row}{seat.number}</p>
                      <p className="text-xs text-on-surface-variant">{seat.tier} Section</p>
                    </div>
                    <span className="text-primary font-bold">${getSeatPrice(seat.tier)}.00</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">ยังไม่ได้เลือกที่นั่ง</p>
              )}

              <div className="flex justify-between items-start pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm font-label text-on-surface font-bold">Service Fee</p>
                  <p className="text-xs text-on-surface-variant">Booking & Processing</p>
                </div>
                <span className="text-on-surface-variant">${serviceFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-highest/40 rounded-2xl p-4 border-y border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <Ticket className="text-primary" size={18} />
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Selected Seats</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seat => (
                <span key={seat.id} className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-bold">
                  {seat.row}{seat.number}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-headline text-on-surface-variant">Total Price</span>
              <span className="text-4xl font-headline font-extrabold text-on-surface">${finalTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleProceed}
              className="w-full py-5 rounded-full cta-gradient text-on-primary font-bold shadow-lg transition-transform active:scale-95 hover:opacity-90 block text-center text-lg cursor-pointer"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-center text-on-surface-variant px-4 uppercase tracking-wider leading-relaxed">
              By clicking you agree to our Terms of Sale and Event Attendance Policy.
            </p>
          </div>
        </motion.div>
      </aside>
    </div>
  );
}