import React, { useState } from 'react';
import './App.css';

function App() {

  const [result, setResult] = useState('');

  const factorial = async () => {
    let reply = await window.send('make-factorial', { num: 5 })
    setResult(reply)
  };

  const phoneCall = async () => {
    let reply = await window.send('ring-ring', { message: 'this is james' })
    setResult(reply)
  };

  return (
    <div className="App">
      <h2>Hello</h2>

      <button id="factorial" onClick={factorial}>Compute factorial</button>
      <button id="call" onClick={phoneCall}>Make phone call</button>

      <div id="output">{result}</div>
    </div>
  );
}

export default App;
