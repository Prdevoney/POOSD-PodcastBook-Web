import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ExplorePodcasts from './Components/Explore/ExplorePodcasts';
import Account from './Components/UserAccount/Account';
import PodcastReview from './Components/Podcast/PodcastReview';
import Forms from './Components/PasswordForm/Form';
import MyFriends from './Components/Friends/MyFriends';
// new added ->
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
// end of new added ->

//added now: 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// end

import { UserContext } from './Components/UserContext';



function Main() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  // const [searchResults, setSearchResults] = useState([]);


  return (
    <>
      {showNavbar && (
        <Navbar expand="sm" className="navbar-container" sticky="top">
          <Container fluid >
          <img
                src="/penguin.png" 
                width="40"
                height="50"
                className="d-inline-block align-top"
                alt="Podcast Book logo"
                style={{marginRight: '15px', marginLeft: '10px'}}
              />
            <Navbar.Brand href='/explore-podcasts' style={{fontSize: '30px', fontWeight: 'bold'}}> Podcast Book </Navbar.Brand>
            {/* <Navbar.Text className ="d-none d-sm-inline" style={{ color: 'inherit', fontSize: '20px', fontWeight: 'bold', paddingLeft: '20px', paddingRight: '20px'}}> | </Navbar.Text> */}
            <Navbar.Toggle aria-controls="navbarScroll" style={{ height: '50px' }}/>
            <Navbar.Collapse id="navbarScroll" className="justify-content-end" >
              <Nav className=" my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link as={NavLink} to="/explore-podcasts" style={{ textDecoration: location.pathname === '/explore-podcasts' ? 'underline' : 'none', color: location.pathname === '/explore-podcasts' ? 'white' : 'inherit', fontSize: '20px', paddingRight: '30px' }}>Explore Podcasts</Nav.Link>
              <Navbar.Text className ="d-none d-sm-inline" style={{ color: 'inherit', fontSize: '20px', fontWeight: 'bold' , paddingRight: '30px'}}> | </Navbar.Text>
              <Nav.Link as={NavLink} to="/account" style={{ textDecoration: location.pathname === '/account' ? 'underline' : 'none', color: location.pathname === '/account' ? 'white' : 'inherit', fontSize: '20px' ,paddingRight: '30px' }}>Account</Nav.Link>
              <Navbar.Text className ="d-none d-sm-inline" style={{ color: 'inherit', fontSize: '20px', fontWeight: 'bold' , paddingRight: '30px'}}> | </Navbar.Text>
              <Nav.Link as={NavLink} to="/my-podcast-friends" style={{ textDecoration: location.pathname === '/my-podcast-friends' ? 'underline' : 'none', color: location.pathname === '/my-podcast-friends' ? 'white' : 'inherit', fontSize: '20px' ,paddingRight: '30px' }}>Friends</Nav.Link>
            </Nav>
          
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  )

}
function App() {
  const [UserID, setUserID] = useState(null);



  return (
    <Router>
      <Main />
      <UserContext.Provider value={{ UserID, setUserID }}>
    
      <Routes>
        <Route exat path="/" element={<LoginSignup />} />
        <Route path="/explore-podcasts" element={<ExplorePodcasts />} />
        <Route path="/account" element={<Account/>}/>
        <Route path="/review-podcast" element={<PodcastReview/>}/>
        <Route path="/resetPassword" element = {<Forms/>} />
        <Route path="/my-podcast-friends" element={<MyFriends/>}/>
      </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
