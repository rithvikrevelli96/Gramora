import React, { useRef, useState } from 'react';

function Register() {
  const ref = useRef(null);
  const [email, setEmail] = useState('');

  return (
    <div ref={ref}>
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
    </div>
  );
}

export default Register;
