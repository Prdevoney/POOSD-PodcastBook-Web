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
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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

  // const navigate = useNavigate();

  // const handleSearch = (event) => {
  //   event.preventDefault();
  //   const searchTerm = event.target.elements[0].value;

  //   if (location.pathname === '/explore-podcasts') {
  //     navigate('/explore-podcasts', { state: { searchTerm } });
  //   } else if (location.pathname === '/account') {
  //     navigate('/account', { state: { searchTerm } });
  //   }
  // };

  return (
    <>
      {showNavbar && (
        <Navbar expand="sm" className="navbar-container" /*bg="primary" data-bs-theme="dark"*/  >
          <Container fluid >
            <Navbar.Brand href='/explore-podcasts'>Podcast Book</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" style={{ height: '50px' }}/>
            <Navbar.Collapse id="navbarScroll" >
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link as={NavLink} to="/explore-podcasts" style={{ textDecoration: location.pathname === '/explore-podcasts' ? 'underline' : 'none', color: location.pathname === '/explore-podcasts' ? 'white' : 'inherit' }}>Explore Podcasts</Nav.Link>
                <Nav.Link as={NavLink} to="/account" style={{ textDecoration: location.pathname === '/account' ? 'underline' : 'none', color: location.pathname === '/account' ? 'white' : 'inherit' }}>Account</Nav.Link>
              </Nav>
              

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
              )}

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
