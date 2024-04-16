import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ExplorePodcasts from './Components/Explore/ExplorePodcasts';
import Account from './Components/UserAccount/Account';
import PodcastReview from './Components/Podcast/PodcastReview';
// new added ->
// import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
// end of new added ->

//added now: 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
// end


function Main() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  // const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    // Work on the search API call here
    event.preventDefault();
    const searchTerm = event.target.elements[0].value;
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    if (location.pathname === '/explore-podcasts') {
      
      navigate('/explore-podcasts', { state: { searchTerm: encodedSearchTerm } });
    } else if (location.pathname === '/account') {
      navigate('/explore-podcasts', { state: { searchTerm: encodedSearchTerm } });
    }
    
  }

  return (
    <>
      {showNavbar && (
        <Navbar expand="sm" className="navbar-container" sticky="top" /*bg="primary" data-bs-theme="dark"*/  >
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
            </Nav>
              
{/*     Just commented out the search bar for now. my-2 my-lg-0

            {location.pathname !== '/review-podcast' && (
              <>
             <Form.Select className = "me-3" style={{width: '110px'}} aria-label="Default select example">
              <option value="1">Podcast</option>
              <option value="2">Episode</option>
              </Form.Select>
             
             <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onSubmit={handleSearch}
                />
                <Button variant="outline-light">Search</Button>
              </Form>
              </>
              )} */}

            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  )

}
function App() {



  return (
    <Router>
      <Main />
      <Routes>
        <Route exat path="/" element={<LoginSignup />} />
        <Route path="/explore-podcasts" element={<ExplorePodcasts />} />
        <Route path="/account" element={<Account/>}/>
        <Route path="/review-podcast" element={<PodcastReview/>}/>
      </Routes>
    </Router>
  );
}

export default App;
