import { useEffect, useState } from 'react';
import '../assets/app.css';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.app.invoke('send-msg', 'test message').then(message => console.log('send-msg', message));
  }, []);

  useEffect(() => {
    const replyId = window.app.on('reply-msg', message => console.log('### reply-msg', message));
    return () => window.app.off(replyId);
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src="react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
