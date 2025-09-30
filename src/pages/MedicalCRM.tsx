import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import Dashboard from './Dashboard';
import VoiceAgents from './VoiceAgents';
import CallLogs from './CallLogs';
import Doctors from './Doctors';
import Profile from './Profile';

const MedicalCRM = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      
      {/* Main Content - Fixed positioning to account for sidebar and header */}
      <main className="fixed top-16 left-64 right-0 bottom-0 overflow-auto bg-gray-50">
        <div className="p-6 h-full">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="voice-agents" element={<VoiceAgents />} />
            <Route path="call-logs" element={<CallLogs />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="profile" element={<Profile />} />
            <Route path="patients" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Patients Module</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            } />
            <Route path="appointments" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Appointments Module</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            } />
            <Route path="consultations" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Consultations Module</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default MedicalCRM;