import { useEffect, useState } from 'react';

function ConnectionTest() {
  const [status, setStatus] = useState('Testing connection...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus(`✅ Backend connected: ${data.message || 'OK'}`);
        setIsConnected(true);
        console.log('Backend response:', data);
      })
      .catch(err => {
        setStatus(`❌ Backend connection failed: ${err.message}`);
        setIsConnected(false);
        console.error('Connection error:', err);
      });
  }, []);

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: `2px solid ${isConnected ? 'green' : 'red'}`,
      borderRadius: '8px',
      backgroundColor: isConnected ? '#d4edda' : '#f8d7da'
    }}>
      <h3>Backend Connection Status</h3>
      <p>{status}</p>
    </div>
  );
}

export default ConnectionTest;