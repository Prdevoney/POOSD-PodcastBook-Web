import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './ExplorePageStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Client } = require('podcast-api');

/* use for actuall data*/
const API_KEY = 'e03f9deeb7fb4d8ea230d865bef7a67d';

/* use for testing */
// const API_KEY = '';


const userId = localStorage.getItem('UserID');
console.log('UserID: ', userId);
const ExplorePodcasts =() =>{
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('podcast');
  const [lastSearchType, setLastSearchType] = useState('podcast');
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleCurrentEpisode = (currEpisode) => {
     console.log("Episode data received:", currEpisode);

      setCurrentEpisode(currEpisode);
      setShowModal(true);
  };

  const handleReview = (data) => {
    const dataForReview = normalizeData(data);
    navigate('/review-podcast', {state: {reviewData: dataForReview}});
  };

  const normalizeData = (data) => {
    const normalizedData = {
      title: data.title_original || data.title,
      image: data.image,
      description: data.description || data.description_highlighted,
      id: data.id,
      type: data.audio ? 'episode' : 'podcast',
    }

    if (data.audio) {
      normalizedData.audio = data.audio;
    } else {
      normalizedData.episodeCount = data.total_episodes;
    }
    return normalizedData;
  };

  const getEpisode = async (podcastId) => {

    const client = Client({ apiKey: API_KEY });
    try{
      const response = await client.fetchPodcastById({
        id: podcastId,
        sort: 'recent_first',
      });

      console.log('Episodes:', response.data.episodes);
      handleCurrentEpisode(response.data.episodes[0]);

    } catch(error){
      console.error('Error fetching podcasts:', error);
    }
  };

  const fetchPodcasts = async () => {
    setIsLoading(true);
    setHasSearched(true);

    if (!searchQuery.trim() && hasSearched === true){
      console.error('Error: Search query cannot be empty');
      setIsLoading(false);
      return;
    }
    if (!searchQuery.trim()){
      console.error('Error: Search query cannot be empty');
      setIsLoading(false); 
      setHasSearched(false);
      return; 
    }

    const client = Client({ apiKey: API_KEY });
    try {
      // Use the search method from the client
      const response = await client.search({
        q: searchQuery,
        type: searchType, 
        language: 'English',
        region: 'us'
      });

      console.log('Podcasts/Episodes:', response.data.results);
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

                console.log('Best Podcasts:', response.data.podcasts);
              }).catch((error) => {

                console.log(error)

              });
          } catch (error) { 
              console.error('Error fetching reviews:', error);
              setError('Error fetching reviews');
          }
      };

      fetchInitialPodcasts();
  },[]);

  return (
    <div> 
      
      <Modal show={showModal} onHide={() => {setShowModal(false); setCurrentEpisode(null);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEpisode ? currentEpisode.title || currentEpisode.title_original: 'Loading...'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEpisode ? (
          <div>
            <h5>Audio Player:</h5>
            <audio controls autoPlay>
              <source src={currentEpisode.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <h5><br></br>Description:</h5>
            <p dangerouslySetInnerHTML={{ __html: currentEpisode.description || currentEpisode.description_highlighted }}></p>
            <Modal.Footer>
              <Button className="mt-2" variant="primary" onClick={() => handleReview(currentEpisode)}>Review this Episode</Button>
            </Modal.Footer>

          </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>

      <Container fluid style={{ padding: 0 }}>
        <Row>
          <Col>
            <div style={{
              backgroundImage: 'url(/HeroSectionExtension.webp)', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '75vh', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="text-center mt-5 mb-3">
          <h1 className="bebas-neue-regular" style={{ fontSize: '4rem' }}>Discover, listen to, & review new podcasts and episodes</h1>
        </Row>

        <Form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()} >
          
          <Form.Select className = "me-3" variant="primary" style={{width: '110px'}} aria-label="Default select example" value={searchType} onChange={handleTypeChange}>
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
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                fetchPodcasts();
              }
            }}
          />
          <Button variant="outline-light" onClick={fetchPodcasts}>Search</Button>
        </Form>
        <hr className="custom-hr" />
        <div>
          {hasSearched ? (
            lastSearchType === 'podcast' ? (
              <Container className="mt-3">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Container>
                    <Row> 
                      <Col className="text-center my-4">
                        <h1 className="bebas-neue-regular" style={{ fontSize: '3rem' }}>Explore Podcasts</h1>
                      </Col>
                    </Row>
                    <Row>
                      {podcasts.map((podcast, index) => (
                        <Col xs={12} md={6} lg={4} xxl={3} key={index} className="mb-3 d-flex justify-content-center">
                          <Card key={index} style={{ width: '18rem' }} className="p-3 mb-3 d-flex flex-column">
                            <Image src={podcast.image} alt="podcast thumbnail" className="img-thumbnail mb-3"/>
                            <h5>Podcast: {podcast.title_original}</h5>
                            <p dangerouslySetInnerHTML={{ __html: podcast.description_highlighted.length > 150 ? podcast.description_highlighted.substring(0, 150) + '...' : podcast.description_highlighted }}></p>
                            <Button variant="outline-primary" className="mt-auto" onClick={() => getEpisode(podcast.id)}>Listen to an Episode</Button>
                            <Button className="mt-2" variant="primary" onClick={() => handleReview(podcast)}>Review Podcast</Button>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Container>
                )}
              </Container>
            ) : lastSearchType === 'episode' ? (
              <Container className="mt-3">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Container>
                    <Row>
                      <Col className="text-center my-4">
                        <h1 className="bebas-neue-regular" style={{ fontSize: '3rem' }}>Explore Episodes</h1>
                      </Col>
                    </Row>
                    <Row>
                      {podcasts.map((episode, index) => (
                          <Col xs={12} md={6} lg={4} xxl={3} key={index} className="mb-3 d-flex justify-content-center">
                            <Card key={index} style={{ width: '18rem' }} className="p-3 mb-3 d-flex flex-column">
                              <Image src={episode.image} alt="episode thumbnail" className="img-thumbnail mb-3"/>
                              <h5>Episode: {episode.title_original}</h5>
                              <p dangerouslySetInnerHTML={{ __html: episode.description_highlighted.length > 150 ? episode.description_highlighted.substring(0, 150) + '...': episode.description_highlighted }}></p>
                              <Button variant="outline-primary" className="mt-auto" onClick={() => handleCurrentEpisode(episode)}>Play Episode</Button>
                              <Button className="mt-2" variant="primary" onClick={() => handleReview(episode)}>Review Episode</Button>

                            </Card>
                          </Col>
                        ))}
                      </Row>
                  </Container>
                )}
              </Container>
            ) : null
          ) : (
            <div className="review-container">
              {error ? (
                <div>Error: {error}</div>
              ) : podcasts.length > 0 ? (
                <Container>
                  <Row> 
                    <Col className="text-center my-4">
                      <h1 className="bebas-neue-regular" style={{ fontSize: '3rem' }}>Explore the Best Podcasts of the Week</h1>
                    </Col>
                  </Row>
                  <Row>
                    {podcasts.map((podcast, index) => (
                        <Col xs={12} md={6} lg={4} xxl={3} key={index} className="mb-3 d-flex justify-content-center">
                          <Card key={index} style={{ width: '18rem' }} className="p-3 mb-3 d-flex flex-column">
                            <img src={podcast.image} alt="Podcast Cover" className="img-thumbnail mb-3" />
                            <h5>Podcast: {podcast.title}</h5>
                            <p>Language: {podcast.language}</p>
                            <p dangerouslySetInnerHTML={{ __html: podcast.description.length > 150 ? podcast.description.substring(0, 150) + '...' : podcast.description }}></p>
                            <Button variant="outline-primary" className="mt-auto" onClick={() => getEpisode(podcast.id)}>Listen to an Episode</Button>
                            <Button className="mt-2" variant="primary" onClick={() => handleReview(podcast)}>Review this Podcast</Button>
                          </Card>
                        </Col>
                    ))}
                  </Row>
                </Container>
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

