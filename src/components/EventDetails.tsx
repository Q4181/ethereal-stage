import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Plus, Minus, Ticket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CONCERTS, cn } from '../types';

export function EventDetails() {
  const { id } = useParams();
  const concert = CONCERTS.find(c => c.id === id) || CONCERTS[1];
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['A12', 'A13']);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

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
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">{concert.artist} {concert.tour}</h1>
          <div className="flex gap-6 text-on-surface-variant text-sm">
            <span className="flex items-center gap-2"><Calendar size={16} /> {concert.date}</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> {concert.venue}</span>
          </div>
        </motion.div>

        {/* Stage Visualization */}
        <div className="relative w-full aspect-[16/6] bg-surface-low rounded-xl overflow-hidden flex items-end justify-center pb-4 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          <div className="w-3/4 h-2 bg-primary/40 blur-md absolute bottom-0" />
          <div className="relative z-10 px-12 py-3 bg-surface-high rounded-t-3xl border-t border-white/5 text-center w-2/3">
            <span className="font-headline font-bold text-on-surface-variant tracking-[0.4em] uppercase text-[10px]">Stage Center</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="bg-surface-container rounded-xl p-8 relative shadow-2xl border border-white/5 overflow-hidden">
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center hover:bg-primary/20 transition-colors border border-white/5">
              <Plus size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center hover:bg-primary/20 transition-colors border border-white/5">
              <Minus size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-12 py-8">
            {/* VIP Section */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-label text-tertiary-dim tracking-widest uppercase font-bold">VIP Orchestra</span>
              <div className="grid grid-cols-12 gap-3">
                {Array.from({ length: 12 }).map((_, i) => {
                  const seatId = `A${i + 7}`;
                  const isSelected = selectedSeats.includes(seatId);
                  return (
                    <button 
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      className={cn(
                        "w-6 h-6 rounded-sm transition-all duration-300",
                        isSelected ? "cta-gradient shadow-lg shadow-primary/20" : "bg-tertiary/20 hover:bg-tertiary/40 border border-tertiary/10"
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Regular Section */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-label text-on-surface-variant tracking-widest uppercase font-bold">Regular Seating</span>
              <div className="grid grid-cols-12 gap-3">
                {Array.from({ length: 36 }).map((_, i) => {
                  const seatId = `R${i}`;
                  const isReserved = i === 2 || i === 15 || i === 28;
                  return (
                    <button 
                      key={seatId}
                      disabled={isReserved}
                      className={cn(
                        "w-6 h-6 rounded-sm transition-all duration-300",
                        isReserved ? "bg-surface-highest opacity-30 cursor-not-allowed" : "bg-surface-highest hover:bg-primary/40"
                      )}
                    />
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
              <div className="w-3 h-3 rounded-full cta-gradient" />
              <span className="text-[10px] text-on-surface-variant font-label uppercase font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-highest opacity-30" />
              <span className="text-[10px] text-on-surface-variant font-label uppercase font-bold">Reserved</span>
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
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-label text-on-surface font-bold">Seat {selectedSeats.join(', ')}</p>
                  <p className="text-xs text-on-surface-variant">VIP Orchestra Section</p>
                </div>
                <span className="text-primary font-bold">$498.00</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-label text-on-surface font-bold">Service Fee</p>
                  <p className="text-xs text-on-surface-variant">Booking & Processing</p>
                </div>
                <span className="text-on-surface-variant">$24.50</span>
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
                <span key={seat} className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-bold">ROW {seat}</span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-headline text-on-surface-variant">Total Price</span>
              <span className="text-4xl font-headline font-extrabold text-on-surface">$522.50</span>
            </div>
            <Link 
              to="/checkout"
              className="w-full py-5 rounded-full cta-gradient text-on-primary font-bold shadow-lg transition-transform active:scale-95 hover:opacity-90 block text-center text-lg"
            >
              Proceed to Checkout
            </Link>
            <p className="text-[10px] text-center text-on-surface-variant px-4 uppercase tracking-wider leading-relaxed">
              By clicking you agree to our Terms of Sale and Event Attendance Policy.
            </p>
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
