import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div>
      {isLoginView ? <Login /> : <Signup />}
      
      {/* Small toggle button at the bottom */}
      <div style={{ textAlign: 'center', position: 'absolute', bottom: '20px', width: '100%' }}>
        <button 
          onClick={() => setIsLoginView(!isLoginView)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLoginView ? "New Staff? Create Account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default App;