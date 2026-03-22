import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import { Home } from './components/Home'; // ตรงนี้ต้องมีปีกกา
import EventDetails from './components/EventDetails';
import Checkout from './components/Checkout';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;