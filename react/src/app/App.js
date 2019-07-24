import React, { useState, useEffect } from 'react';
import './App.css';

import ipcClient from './client-ipc';

function App() {

  const [result, setResult] = useState('');

  useEffect(() => {
    const connect = async () => {
      await ipcClient.init();
    };

    connect();
  }, []);

  let output = document.querySelector('#output')

  const factorial = async () => {
    let reply = await ipcClient.send('make-factorial', { num: 5 })
    setResult(reply)
    output.innerHTML = reply
  };

  const phoneCall = async () => {
    let reply = await ipcClient.send('ring-ring', { message: 'this is james' })
    setResult(reply)
    output.innerHTML = reply
  };

  return (
    <div className="App">
      <h2>Hello</h2>

      <button id="factorial" onClick={factorial}>Compute factorial</button>
      <button id="call" onClick={phoneCall}>Make phone call</button>

      <div id="output"></div>
    </div>
  );
}

export default App;
