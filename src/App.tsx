import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import './index.css';
import EditInvoice from './pages/EditInvoice';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        <Route path="/invoices/:id" element={<ViewInvoice />} />
        <Route path="/invoices/:id/edit" element={<EditInvoice />} />
      </Routes>
    </Router>
  );
};

export default App;