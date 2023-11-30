import logo from './logo.svg';
import './App.css';
import Call from './call';
import Put from './put';
import { useState } from 'react';


function App() { 
  {
    const [state, setState] = useState(1);
    return (
      <div className="App">
        <header className='App-header'>
          <input className='input' type='number' value={state} onChange={e => { setState(Number(e.target.value)) }} />
          <Call />
          <Put />
        </header>
      </div>
    );
  }
}


export default App;
