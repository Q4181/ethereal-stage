// src/App.tsx (แก้ไขบางส่วน)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import EventDetails from './components/EventDetails';
import Checkout from './components/Checkout';
import Login from './components/Login'; // 1. Import Login เข้ามา

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} /> {/* 2. เพิ่ม Route นี้ */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;