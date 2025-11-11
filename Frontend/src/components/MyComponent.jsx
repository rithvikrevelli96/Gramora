import React, { useState, useRef } from 'react';

function MyComponent() {
  const ref = useRef(null);
  const [state, setState] = useState('');
  // your logic here
  return <div ref={ref}>Hello</div>;
}

export default MyComponent;