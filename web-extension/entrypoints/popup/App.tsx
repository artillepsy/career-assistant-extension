import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Hi folks! I am extension</h1>
      </div>
      <div>
        <p>Bye folks!!!</p>
      </div>
    </>
  );
}

export default App;
