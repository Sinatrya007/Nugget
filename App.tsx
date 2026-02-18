
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateSession } from './pages/CreateSession';
import { ShareLink } from './pages/ShareLink';
import { ReceiveLocation } from './pages/ReceiveLocation';
import { Dashboard } from './pages/Dashboard';
import { SessionDetail } from './pages/SessionDetail';
import { ShareSession } from './types';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/l/:id" element={<ReceiveLocation />} />
          <Route path="/share/:id" element={<ShareLink />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
