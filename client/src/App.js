import logo from './logo.svg';
import './App.css';

function App() {

const fetchData = () => {
    fetch('/api/test')
      .then(response => response.json())
      .then(data => console.log(data));
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code>. How's it going world? hello out there!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={fetchData}>Get Data</button>
      </header>
    </div>
  );
}

export default App;
