import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ExplorePodcasts from './Components/Explore/ExplorePodcasts';

function App() {

// const fetchData = () => {
//     fetch('/api/test')
//       .then(response => response.json())
//       .then(data => console.log(data));
//   };

  return (
    <div>
      <LoginSignup />
      <ExplorePodcasts />
    </div>
  );
}

export default App;
