import { useState } from 'react';

export default function MyApp() {

    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

  return (
    <div>
      <h1>Contatori indipendenti</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Cliccato {count} volte
    </button>
  );
}