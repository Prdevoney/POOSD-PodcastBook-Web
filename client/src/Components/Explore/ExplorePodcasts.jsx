import './ExplorePageStyle.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// import { useLocation } from 'react-router-dom';
 
// import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

// import { NavLink } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

//write handle search api call


const ExplorePodcasts =() =>{
  const location = useLocation();
  const encodedSearchTerm = location.state ? location.state.searchTerm : '';
  const searchTerm = decodeURIComponent(encodedSearchTerm);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      const fetchData = async () => {
        const response = await fetch(`https://api.example.com/search?term=${searchTerm}`);
        const data = await response.json();
        setData(data);
      };

      fetchData();
    }
  }, [searchTerm]);

  return (
    <div>
    <Button as={Link} to="/review-podcast" variant="primary"> Review the podcast button </Button>
    {data && <div>{JSON.stringify(data)}</div>}
    </div>

/* <Navbar expand="sm" className="navbar-container" bg="primary" data-bs-theme="dark"  >
      <Container fluid >
        <Navbar.Brand href="#">Podcast Book</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" style={{ height: '50px' }}/>
        <Navbar.Collapse id="navbarScroll" >
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="#action1">Explore</Nav.Link>
            <Nav.Link as={NavLink} to ="/account"activeStyle={{textDecoration: 'underline'}}>Account</Nav.Link>
          </Nav>
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
            />
            <Button variant="outline-light">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar> */
    
  );
}

export default ExplorePodcasts;

