import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';

export default function Inventory() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/users/me/tickets', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setTickets(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center pt-32 text-gray-400">กำลังโหลดคลังตั๋ว...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-white mb-2">คลังตั๋วของฉัน</h1>
      <p className="text-gray-400 mb-8">คุณมีตั๋วทั้งหมด {tickets.length} ใบ</p>

      {tickets.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-500">
          <Ticket size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl">คุณยังไม่มีตั๋วคอนเสิร์ตเลย</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket: any) => {
            const concert = ticket.seat.concert;
            const seat = ticket.seat;
            return (
              <div key={ticket.id} className="bg-gradient-to-br from-blue-900/40 to-gray-900 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                {/* ลายน้ำตั๋ว */}
                <Ticket className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 -rotate-12 pointer-events-none" />
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{concert.name}</h3>
                <div className="text-sm text-gray-400 mb-6 space-y-1">
                  <p className="flex items-center gap-2"><Calendar size={14} /> {concert.date} | {concert.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} /> {concert.venue}</p>
                </div>
                
                <div className="bg-black/40 rounded-xl p-4 flex justify-between items-center border border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">โซน {seat.tier}</p>
                    <p className="text-2xl font-extrabold text-blue-400">{seat.row}{seat.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ticket ID</p>
                    <p className="text-sm font-mono text-gray-300">#{ticket.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}