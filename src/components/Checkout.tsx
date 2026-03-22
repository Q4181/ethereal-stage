import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Lock, Wallet, Calendar, MapPin } from 'lucide-react';
import { CONCERTS } from '../types';

export function Checkout() {
  const concert = CONCERTS[1];

  return (
    <div className="min-h-screen pt-24 pb-32 px-8 max-w-7xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-16 space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-primary font-bold font-headline">Details</span>
        </div>
        <div className="w-12 h-[1px] bg-outline-variant/20" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-on-surface font-bold font-headline">Payment</span>
        </div>
        <div className="w-12 h-[1px] bg-outline-variant/20" />
        <div className="flex items-center space-x-3 opacity-40">
          <div className="w-8 h-8 rounded-full bg-surface-high text-on-surface-variant flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-on-surface-variant font-bold font-headline">Confirm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 space-y-12">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-8">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Julian Casablancas"
                  className="w-full bg-surface-low border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface transition-colors duration-300 py-4 px-4 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="julian@thestrokes.com"
                  className="w-full bg-surface-low border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface transition-colors duration-300 py-4 px-4 rounded-xl"
                />
              </div>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-headline text-on-surface">Payment Method</h2>
              <div className="flex space-x-3 text-on-surface-variant">
                <CreditCard size={20} />
                <Wallet size={20} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-surface-high rounded-2xl border border-primary/20 flex items-start justify-between cursor-pointer">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-10 bg-surface-low rounded-lg flex items-center justify-center border border-white/5">
                    <CreditCard className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-lg">Credit / Debit Card</p>
                    <p className="text-sm text-on-surface-variant">All major providers accepted</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 p-8 bg-surface-container rounded-3xl border border-white/5">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-surface-low border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface transition-colors duration-300 py-4 px-4 rounded-xl"
                    />
                    <Lock className="absolute right-4 top-4 text-on-surface-variant" size={18} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full bg-surface-low border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface transition-colors duration-300 py-4 px-4 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full bg-surface-low border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface transition-colors duration-300 py-4 px-4 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Right Side: Order Summary */}
        <aside className="lg:col-span-5 sticky top-28">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-highest/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold font-headline text-primary mb-8">Order Summary</h3>
            
            <div className="flex gap-6 mb-10">
              <div className="w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                <img 
                  src={concert.image} 
                  alt={concert.artist}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-bold font-headline leading-tight">{concert.artist} {concert.tour}</h4>
                <p className="text-secondary font-medium text-sm">The Midnight Symphony</p>
                <div className="flex items-center text-xs text-on-surface-variant gap-2">
                  <Calendar size={12} /> {concert.date} • {concert.time}
                </div>
                <div className="flex items-center text-xs text-on-surface-variant gap-2">
                  <MapPin size={12} /> {concert.venue}
                </div>
              </div>
            </div>

            <div className="space-y-5 py-8 border-y border-outline-variant/10">
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Tickets (2x VIP Floor)</span>
                <span className="text-on-surface font-bold">$450.00</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Service Fee</span>
                <span className="text-on-surface font-bold">$32.50</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Facility Charge</span>
                <span className="text-on-surface font-bold">$12.00</span>
              </div>
            </div>

            <div className="pt-8 mb-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-on-surface-variant mb-2 uppercase tracking-widest font-bold">Total Amount</p>
                  <p className="text-5xl font-bold font-headline text-primary tracking-tighter">$494.50</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest font-bold">Seat Numbers</p>
                  <p className="text-sm font-bold">SEC A, Row 4, Seat 12-13</p>
                </div>
              </div>
            </div>

            <button className="w-full py-6 rounded-full cta-gradient text-on-primary font-bold text-xl hover:opacity-90 transition-all duration-300 transform active:scale-[0.98] shadow-2xl shadow-primary/20 uppercase tracking-widest">
              Complete Purchase
            </button>
            <p className="text-center text-[10px] text-on-surface-variant mt-8 px-6 uppercase tracking-wider leading-relaxed">
              By clicking "Complete Purchase", you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Refund Policy</a>.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
