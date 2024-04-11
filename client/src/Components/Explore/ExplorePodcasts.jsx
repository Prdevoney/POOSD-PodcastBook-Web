import './ExplorePageStyle.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';

//write handle search api call

const { Client } = require('podcast-api');


const PodcastBox = ({ title, language, image, description }) => {
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <Link
      to={{
        pathname: '/review-podcast',
        state: {
          podcastData: {
            title,
            language,
            image,
            description,
          },
        },
      }}
      className="podcast-box"
      style={linkStyle}
    >
      <div className="review-box bg-light p-3 mb-3">
        <img src={image} width={250} height={250} alt="Podcast Cover" className="img-thumbnail mb-3" />
        <h5 className="card-title">Podcast: {title}</h5>
        <p className="card-text">Language: {language}</p>
        <p className="card-text">{description.length > 100 ? description.substring(0, 100) + '...' : description}</p>
      </div>
    </Link>
  );
};


const ExplorePodcasts =() =>{
  const location = useLocation();
  const encodedSearchTerm = location.state ? location.state.searchTerm : '';
  const searchTerm = decodeURIComponent(encodedSearchTerm);
  const [data, setData] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchReviews = async () => {
        try {

            const client = Client({ apiKey: '' });
              client.fetchBestPodcasts({
              region: 'us',
              sort: 'listen_score',
              safe_mode: 0,
            
            }).then((response) => {

              setPodcasts(response.data.podcasts);
              console.log(podcasts);
              
            }).catch((error) => {

              console.log(error)

            });

        } catch (error) { //Probably redundant, but didn't want to mess anything up
            console.error('Error fetching reviews:', error);
            setError('Error fetching reviews');
        }
    };

    fetchReviews();
  }, []);

  return (
    <div>
  
    {data && <div>{JSON.stringify(data)}</div>}
    
    <div className="review-container">
      {error ? (
        <div>Error: {error}</div>
      ) : podcasts.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {podcasts.map((podcast, index) => (
            <div className="col mb-4" key={index}>
              <div className="podcast-box">
                <PodcastBox
                  title={podcast.title}
                  language={podcast.language}
                  image={podcast.image}
                  description={podcast.description}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No podcasts found</div>
      )}
    </div>

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