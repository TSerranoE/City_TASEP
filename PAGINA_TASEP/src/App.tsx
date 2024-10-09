import { useState } from "react";
import negro from "./assets/auto_negro.svg";
import azul from "/auto_azul.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <img src={azul} className="logo" alt="Vite logo" />
        <img src={negro} className="logo react" alt="React logo" />
      </div>
      <h1>City Tasep</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Me falta importar todo jaja</p>
        <p>
          Importante, los archivos importantes estan todos en src excepto el del
          backend que es app.py por ahora
        </p>
        <p>
          En assets van las imagenes, en components van los componentes de
          react, en el siguiente formato comoponente.tsx componente.css
        </p>
        <p>El otro importante es App.tsx</p>
        <p>
          Si quieren cachar algo basta con conocimientos de HTML, Javascript,
          CSS y React
        </p>
      </div>
    </>
  );
}

export default App;
