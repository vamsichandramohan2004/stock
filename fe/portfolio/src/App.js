import React from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <div className="app-container">
      
      <header className="header">
        <h1>Portfolio Tracker</h1>
      </header>
      <main>
        <div className='app-title'>
          <image className='bgi'/>
        </div>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;