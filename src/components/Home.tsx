import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONCERTS } from '../types';

export function Home() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative px-8 lg:px-16 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-container/5 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="text-primary tracking-[0.2em] font-label text-xs font-bold mb-4 block uppercase">Featured Artist</span>
            <h1 className="font-headline text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] text-on-surface mb-6">
              Luna <span className="text-primary-dim italic">Blue</span>
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-lg mb-10 mx-auto lg:mx-0">
              Experience an intimate evening of ethereal indie-folk under the stars. Live at the Crystal Atrium this December.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/event/2" 
                className="cta-gradient text-on-primary font-bold px-10 py-4 rounded-full text-lg shadow-2xl transition-transform hover:scale-105 active:scale-95 text-center"
              >
                Book Tickets
              </Link>
              <button className="bg-surface-container-high text-primary font-bold px-10 py-4 rounded-full text-lg transition-transform hover:scale-105 active:scale-95">
                Watch Trailer
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1000" 
                alt="Luna Blue performing"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-container/20 blur-[100px] rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-8 lg:px-16 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto bg-surface-container-high/80 backdrop-blur-2xl p-4 rounded-full flex flex-col lg:flex-row items-center gap-2 shadow-2xl border border-white/5">
          <div className="w-full flex-1 flex items-center gap-3 px-6 py-3">
            <Search className="text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Search artist or event..." 
              className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder:text-on-surface-variant/50 font-body"
            />
          </div>
          <div className="h-8 w-px bg-outline-variant/20 hidden lg:block" />
          <button className="w-full lg:w-auto flex items-center gap-2 px-6 py-3 hover:bg-white/5 rounded-full transition-colors">
            <MapPin size={18} className="text-primary" />
            <span className="font-label text-sm text-on-surface">Everywhere</span>
          </button>
          <div className="h-8 w-px bg-outline-variant/20 hidden lg:block" />
          <button className="w-full lg:w-auto flex items-center gap-2 px-6 py-3 hover:bg-white/5 rounded-full transition-colors">
            <Calendar size={18} className="text-primary" />
            <span className="font-label text-sm text-on-surface">All Dates</span>
          </button>
          <button className="w-full lg:w-auto cta-gradient p-4 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <ArrowRight className="text-on-primary" size={20} />
          </button>
        </div>
      </section>

      {/* Upcoming Concerts */}
      <section className="px-8 lg:px-16 py-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tight mb-2">Upcoming Concerts</h2>
            <p className="text-on-surface-variant font-body">Handpicked experiences in your area</p>
          </div>
          <button className="text-primary font-label text-sm flex items-center gap-2 hover:gap-3 transition-all group">
            View all events <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONCERTS.map((concert) => (
            <motion.div 
              key={concert.id}
              whileHover={{ y: -8 }}
              className="group bg-surface-container rounded-[2rem] overflow-hidden transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={concert.image} 
                  alt={concert.artist}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-2xl">
                  <span className="text-primary font-bold text-sm">{concert.date.split(',')[0]}</span>
                </div>
              </div>
              <div className="p-8">
                <span className="text-[10px] tracking-[0.2em] text-primary uppercase font-bold mb-2 block">{concert.genre}</span>
                <h3 className="font-headline text-2xl font-bold text-on-surface leading-tight mb-4">{concert.artist}</h3>
                <div className="flex items-center gap-2 text-on-surface-variant mb-8">
                  <MapPin size={14} />
                  <span className="text-sm font-label">{concert.venue}, {concert.location}</span>
                </div>
                <Link 
                  to={`/event/${concert.id}`}
                  className="w-full bg-surface-highest group-hover:bg-primary group-hover:text-on-primary text-primary font-bold py-4 rounded-full transition-all duration-300 block text-center"
                >
                  View Tickets
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-8 lg:px-16 py-24">
        <div className="max-w-5xl mx-auto p-12 lg:p-24 rounded-[3rem] relative overflow-hidden text-center bg-surface-container/40 border-y border-white/5 backdrop-blur-xl">
          <div className="relative z-10">
            <h2 className="font-headline text-4xl lg:text-5xl font-bold mb-6 text-on-surface">Never miss a <span className="text-primary italic">beat</span>.</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto mb-10 font-body">Join the inner circle and get first access to tickets, exclusive merch, and secret venue announcements.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 bg-surface-container px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40"
              />
              <button className="cta-gradient text-on-primary font-bold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container/30 blur-[120px] rounded-full -z-10" />
        </div>
      </section>
    </div>
  );
}
