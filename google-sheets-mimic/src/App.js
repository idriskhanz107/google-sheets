import React, { useEffect } from 'react';
import { testBackendConnection } from './api';

function App() {
  useEffect(() => {
    // Test the connection to the backend
    testBackendConnection();
  }, []);

  return (
    <div className="App">
      <h1>React App Connected to Backend</h1>
    </div>
  );
}

export default App;
