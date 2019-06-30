import React from 'react';
import logo from './logo.svg';
import './app.scss'
import SetTime from './components/SetTime'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className='test'>
            scss测试啊
        </div>
      </header>
      <section>
        <SetTime />
      </section>
    </div>
  );
}

export default App;
