import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import TrackDetails from '../pages/TrackDetails';
import Inquiry from '../pages/Inquiry';
import InquiryStatus from '../pages/InquiryStatus';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracks/:slug" element={<TrackDetails />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/inquiry-status" element={<InquiryStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
