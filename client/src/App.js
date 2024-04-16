import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup.jsx';
import ExplorePodcasts from './Components/Explore/ExplorePodcasts.jsx';
import Form from './Components/PasswordForm/Forms';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route exat path="/" element={<LoginSignup />} />
        <Route path="/explore-podcasts" element={<ExplorePodcasts />} />
        <Route path="/resetPassword" element = {<Form/>} />
      </Routes>
    </Router>

  );
}

export default App;
