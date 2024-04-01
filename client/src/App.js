import './App.css';
import LoginSignup from './components/LoginSignup/LoginSignup.jsx';
import ExplorePodcasts from './components/Explore/ExplorePodcasts.jsx';
// new added ->
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// end of new added ->

function App() {

// const fetchData = () => {
//     fetch('/api/test')
//       .then(response => response.json())
//       .then(data => console.log(data));
//   };

  return (
    <Router>
      <Routes>
        <Route exat path="/" element={<LoginSignup />} />
        <Route path="/explore-podcasts" element={<ExplorePodcasts />} />
      </Routes>
    </Router>

    // old code ->
    // <div>
    //   <LoginSignup />
    //   <ExplorePodcasts />
    // </div>
    // end of old code ->
  );
}

export default App;
