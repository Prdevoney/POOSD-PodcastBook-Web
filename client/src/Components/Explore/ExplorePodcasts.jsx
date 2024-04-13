import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import './ExplorePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Client } = require('podcast-api');

/* use for actuall data*/
// const API_KEY = 'fbc6a6fd278f4f91a42b56cbd0f911f0';

/* use for testing */
const API_KEY = '';

const ExplorePodcasts =() =>{

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('podcast');
  const [lastSearchType, setLastSearchType] = useState('podcast');
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const [audioSrc, setAudioSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
  };


  const handlePlayAudio = (audioUrl) => {
    setAudioSrc(audioUrl);
    setShowModal(true);
  };

  const getEpisode = async (podcastId) => {

    const client = Client({ apiKey: API_KEY });
    try{
      const response = await client.fetchPodcastById({
        id: podcastId,
        sort: 'recent_first',
      });

      console.log('Episodes:', response.data.episodes);
      handlePlayAudio(response.data.episodes[0].audio);

    } catch(error){
      console.error('Error fetching podcasts:', error);
    }
  };

  const fetchPodcasts = async () => {
    setIsLoading(true);
    setHasSearched(true);
    const client = Client({ apiKey: API_KEY });
    try {
      // Use the search method from the client
      const response = await client.search({
        q: searchQuery,
        type: searchType, 
        language: 'English',
        region: 'us'
      });

      console.log('Podcasts:', response.data.results);
      setPodcasts(response.data.results);
      setLastSearchType(searchType);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
 const fetchInitialPodcasts = async () => {
        const client = Client({ apiKey: API_KEY });
        try {
              client.fetchBestPodcasts({
              region: 'us',
              sort: 'listen_score',
              safe_mode: 0,
            
            }).then((response) => {

              setPodcasts(response.data.podcasts);

              // DO NOT UN-COMMENT THE LINE BELOW
              // console.log('podcast:' + podcasts);

              console.log('hello');
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Audio Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <audio controls autoPlay>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Modal.Body>
      </Modal>


      <Container>
        <p>Explore Podcasts</p>

        {/* Search Form */}
      

        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>

        <Form.Select className = "me-3" style={{width: '110px'}} aria-label="Default select example" value={searchType} onChange={handleTypeChange}>
          <option value="podcast">Podcast</option>
          <option value="episode">Episode</option>
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
        <div>
          {hasSearched ? (
            lastSearchType === 'podcast' ? (
              <Container className="mt-3">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  podcasts.map((podcast, index) => (
                    <div key={index} className="podcast-item">
                      <h1>This is for Podcasts</h1>
                      <Image src={podcast.image} alt="podcast thumbnail" />
                      <Button variant="primary" onClick={() => getEpisode(podcast.id)}>Listen to an Episode</Button>
                      <h5>{podcast.title_original}</h5>
                      <p>{podcast.description_highlighted}</p>
                    </div>
                  ))
                )}
              </Container>
            ) : lastSearchType === 'episode' ? (
              <Container className="mt-3">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  podcasts.map((episode, index) => (
                    <div key={index} className="episode-item">
                      <h1>This is for Episodes</h1>
                      <Image src={episode.image} alt="episode thumbnail" />
                      <Button variant="primary" onClick={() => handlePlayAudio(episode.audio)}>Play Episode</Button>
                      <h5>{episode.title_original}</h5>
                      <p>{episode.description_highlighted}</p>
                    </div>
                  ))
                )}
              </Container>
            ) : null
          ) : (
            <div className="review-container">
              {error ? (
                <div>Error: {error}</div>
              ) : podcasts.length > 0 ? (
                podcasts.map((podcast, index) => (
                  <div key={index} className="review-box bg-light p-3 mb-3">
                    <img src={podcast.image} alt="Podcast Cover" className="img-thumbnail mb-3" />
                    <h5 className="card-title">Podcast: {podcast.title}</h5>
                    <p className="card-text">Language: {podcast.language}</p>
                    <p className="card-text">{podcast.description.length > 100 ? podcast.description.substring(0,100) + '...' : podcast.description} </p>
                    <Button variant="primary" onClick={() => getEpisode(podcast.id)}>Listen to an Episode</Button>
                  </div>
                  
                ))
              ) : (
                <div>No reviews found</div>
              )}
            </div>
          )}
        </div>

      </Container>
    </div>
  );
}

export default ExplorePodcasts;

