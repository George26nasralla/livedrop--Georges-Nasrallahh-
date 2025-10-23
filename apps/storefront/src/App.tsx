import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { CatalogPage } from './pages/catalog';
import { ProductPage } from './pages/product';
import { CartPage } from './pages/cart';
import { CheckoutPage } from './pages/checkout';
import { OrderStatusPage } from './pages/order-status';
import { AssistantFAB } from './components/atoms/AssistantFab';
import { AssistantPanel } from './components/Organisms/AssistantPanel';
import AdminDashboard  from './pages/AdminDashboard';

function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderStatusPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
      
      {/* Assistant available on all routes */}
      <AssistantFAB onClick={() => setIsAssistantOpen(true)} />
      <AssistantPanel isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </BrowserRouter>
  );
}

export default App;