import React, { useState } from 'react';
import App from './App';
import './mainLayout.css';

export default function MainLayout() {
  const [activeBottomTab, setActiveBottomTab] = useState('Capacity');

  return (
    <div className="main-layout">
      <div className="content-area">
        {activeBottomTab === 'Capacity' && <App />}
        {activeBottomTab !== 'Capacity' && (
          <div className="placeholder">This module is not implemented yet.</div>
        )}
      </div>

      <div className="bottom-nav">
        {['Capacity', 'Projects', 'Admin'].map(name => (
          <div
            key={name}
            className={`bottom-item ${activeBottomTab === name ? 'active' : ''}`}
            onClick={() => setActiveBottomTab(name)}
          >
            {name === 'Capacity' && '📈 '}
            {name === 'Projects' && '≡ '}
            {name === 'Admin' && '👤 '}
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
