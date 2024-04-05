import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import './ExplorePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Client } = require('podcast-api');


// const ReviewBox = ({ podcast, reviewText, rating }) => {
//     return (
//       <div className="review-box bg-light p-3 mb-3">
//         <h5 className="card-title">Podcast: {podcast}</h5>
//         <p className="card-text">{reviewText.length > 100 ? reviewText.substring(0, 100) + '...' : reviewText}</p>
//         <p className="card-text">Rating: {rating}</p>
//       </div>
//     );
//   };

const PodcastBox = ({ title, language, image, description }) => {
    return (
      <div className="review-box bg-light p-3 mb-3">
        <img src={image} alt="Podcast Cover" className="img-thumbnail mb-3" />
        <h5 className="card-title">Podcast: {title}</h5>
        <p className="card-text">Language: {language}</p>
        <p className="card-text">{description.length > 100 ? description.substring(0,100) + '...' : description} </p>
      </div>
    );
  };



const ExplorePodcasts =() =>{

  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  // const [reviews, setReviews] = useState([]);
  // const [searchType, setSearchType] = useState('Podcast');
  // const [searchInput, setSearchInput] = useState('');


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchPodcasts = async () => {
    setIsLoading(true);
    setHasSearched(true);
    const client = Client({ apiKey: '' });
    try {
      // Use the search method from the client
      const response = await client.search({
        q: searchQuery,
        type: 'podcast', 
        language: 'English',
        region: 'us'
      });

      console.log('Podcasts:', response.data.results);
      // Set the search results. Adjust according to the actual response structure.
      setPodcasts(response.data.results);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
 const fetchInitialPodcasts = async () => {
        const client = Client({ apiKey: '' });
        try {
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

    fetchInitialPodcasts();
  },[]);


  return (
    <div> {/* Wrap the elements inside a parent div */}
      <Navbar expand="sm" className="navbar-container" /*bg="primary" data-bs-theme="dark"*/  >
        <Container fluid >
          <Navbar.Brand href="#">Podcast Book</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" style={{ height: '50px' }}/>
          <Navbar.Collapse id="navbarScroll" >
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link href="#action1">Explore</Nav.Link>
              <Nav.Link href="#action2">Account</Nav.Link>
            </Nav>
           
            
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <p>Explore Podcasts</p>

        {/* Search Form */}
      

        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>

        <Form.Select className = "me-3" style={{width: '110px'}} aria-label="Default select example">
          <option value="1">Podcast</option>
          <option value="2">Episode</option>
        </Form.Select>

        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Button variant="outline-light" onClick={fetchPodcasts}>Search</Button>
        </Form>

      {/* Display area for podcasts */}
    <div>
      {!hasSearched ? (

        <div className="review-container">
          {error ? (
            <div>Error: {error}</div>
          ) : podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <PodcastBox
                key={podcast.id} // Assuming each podcast has a unique 'id'
                title={podcast.title}
                language={podcast.language}
                image={podcast.image}
                description={podcast.description}
              />
            ))
          ) : (
            <div>No reviews found</div>
          )}
        </div>
      ) : (
          <Container className="mt-3"> 
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              podcasts.map((podcast, index) => (
                <div key={index} className="podcast-item">
                  <Image src={podcast.image} alt="podcast thumbnail" />
                  <h5>{podcast.title_original}</h5>
                  <p>{podcast.description_highlighted}</p>
                  {/* Render more podcast details as needed */}
                </div>
              ))
            )}
        </Container>
      )}
    </div>
      </Container>
    </div>
  );
}

export default ExplorePodcasts;

