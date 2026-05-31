import axios from 'axios';
import React, { useEffect, useState } from "react";
import StarRatingDisplay from '../Utils/StarRatingDisplay';
import { getProgramImage } from '../Utils/getProgramImage';
import { Card, CardGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../../App.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const itemCardStyle = {
  padding: '10px',
  border: '2px solid #A7C7E7',
  borderRadius: '10px',
  cursor: 'pointer',
  backgroundColor: '#000000',
};

const sectionBoxStyle = {
  padding: '16px',
  border: '2px solid #A7C7E7',
  borderRadius: '10px',
  backgroundColor: '#161823',
  marginBottom: '28px',
};

const sectionHeadingStyle = {
  color: '#A7C7E7',
  marginBottom: '12px',
  fontWeight: 600,
};

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const HORIZONTAL_INSET = 112;

function getCardLimitForWidth(width) {
  const available = width - HORIZONTAL_INSET;
  return Math.max(1, Math.floor((available + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
}

const tagsLinkStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid #A7C7E7',
  backgroundColor: 'transparent',
  color: '#A7C7E7',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const DEFAULT_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

function Home() {
  let navigate = useNavigate();

  let [fitnessVideo, setVideo] = useState([]);
  let [programs, setPrograms] = useState([]);
  let [recipes, setRecipes] = useState([]);
  let [cardLimit, setCardLimit] = useState(() => getCardLimitForWidth(window.innerWidth));

  useEffect(function () {
    function updateCardLimit() {
      setCardLimit(getCardLimitForWidth(window.innerWidth));
    }

    updateCardLimit();
    window.addEventListener('resize', updateCardLimit);
    return () => window.removeEventListener('resize', updateCardLimit);
  }, []);

  useEffect(function () {
    async function getVideo() {
      let res = await axios.get(`${API_BASE_URL}/allvideos`, {
        withCredentials: true,
      });
      setVideo(res.data.data);
    }
    getVideo();
  }, []);

  useEffect(function () {
    async function getProgram() {
      let res = await axios.get(`${API_BASE_URL}/allprograms`, {
        withCredentials: true,
      });
      setPrograms(res.data.data);
    }
    getProgram();
  }, []);

  useEffect(function () {
    async function getRecipes() {
      let res = await axios.get(`${API_BASE_URL}/allrecipes`, {
        withCredentials: true,
      });
      setRecipes(res.data.data);
    }
    getRecipes();
  }, []);

  const showVideo = (ele) => {
    navigate(`/show`, { state: ele });
  };

  const showProgram = (program) => {
    navigate(`/showprogram`, { state: program });
  };

  const showRecipe = (recipe) => {
    navigate('/showrecipe', { state: recipe });
  };

  const visibleVideos = fitnessVideo.slice(0, cardLimit);
  const hasMoreVideos = fitnessVideo.length > cardLimit;
  const visiblePrograms = programs.slice(0, cardLimit);
  const hasMorePrograms = programs.length > cardLimit;
  const visibleRecipes = recipes.slice(0, cardLimit);
  const hasMoreRecipes = recipes.length > cardLimit;

  return (
    <div>
      <section>
        <div style={sectionBoxStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ ...sectionHeadingStyle, marginBottom: 0 }}>Workout Videos</h3>
            <button
              type="button"
              style={tagsLinkStyle}
              onClick={() => navigate('/workoutvideos/tags')}
            >
              See videos by tags
            </button>
          </div>
          {fitnessVideo && fitnessVideo.length > 0 ? (
            <>
            <CardGroup>
              <div className="cards-container">
                {visibleVideos.map(function (vid, idx) {
                  return (
                    <Card
                      key={vid._id || idx}
                      style={itemCardStyle}
                      onClick={() => showVideo(vid)}
                    >
                      <Card.Img
                        variant="top"
                        src={vid.imgFileUrl}
                        alt={vid.name || 'Video image'}
                        height="300"
                        width="400"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <Card.Body>
                        <Card.Title style={{ color: '#A7C7E7' }}>
                          {vid.name} by <i>{vid.coach && vid.coach.username}</i>
                        </Card.Title>
                        <Card.Text>
                          {vid.currentRating > 0 ? (
                            <StarRatingDisplay rating={vid.currentRating} />
                          ) : (
                            <span style={{ color: '#A7C7E7' }}>No ratings yet</span>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </CardGroup>
            {hasMoreVideos && (
              <p style={{ color: '#A7C7E7', marginTop: '12px', marginBottom: 0 }}>
                Showing {cardLimit} of {fitnessVideo.length} videos.{' '}
                <button
                  type="button"
                  style={{ ...tagsLinkStyle, marginTop: '8px' }}
                  onClick={() => navigate('/workoutvideos/tags')}
                >
                  Browse all by tag
                </button>
              </p>
            )}
            </>
          ) : (
            <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
              <Card.Body>
                <Card.Title style={{ color: '#A7C7E7' }}>No videos yet</Card.Title>
                <Card.Text style={{ color: '#f4f4f8' }}>
                  Workout videos will appear here once they are added.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div style={sectionBoxStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ ...sectionHeadingStyle, marginBottom: 0 }}>Workout Programs</h3>
            <button
              type="button"
              style={tagsLinkStyle}
              onClick={() => navigate('/allprograms/tags')}
            >
              See programs by tags
            </button>
          </div>
          {programs && programs.length > 0 ? (
            <>
            <CardGroup>
              <div className="cards-container">
                {visiblePrograms.map(function (program, idx) {
                  return (
                    <Card
                      key={program._id || idx}
                      style={itemCardStyle}
                      onClick={() => showProgram(program)}
                    >
                      <Card.Img
                        variant="top"
                        src={getProgramImage(program)}
                        alt={program.name || 'Program image'}
                        height="300"
                        width="400"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <Card.Body>
                        <Card.Title style={{ color: '#A7C7E7' }}>
                          {program.name} by <i>{program.coach && program.coach.username}</i>
                        </Card.Title>
                        <Card.Text>
                          {program.currentRating > 0 ? (
                            <StarRatingDisplay rating={program.currentRating} />
                          ) : (
                            <span style={{ color: '#A7C7E7' }}>No ratings yet</span>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </CardGroup>
            {hasMorePrograms && (
              <p style={{ color: '#A7C7E7', marginTop: '12px', marginBottom: 0 }}>
                Showing {cardLimit} of {programs.length} programs.{' '}
                <button
                  type="button"
                  style={{ ...tagsLinkStyle, marginTop: '8px' }}
                  onClick={() => navigate('/allprograms/tags')}
                >
                  Browse all by tag
                </button>
              </p>
            )}
            </>
          ) : (
            <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
              <Card.Body>
                <Card.Title style={{ color: '#A7C7E7' }}>No programs yet</Card.Title>
                <Card.Text style={{ color: '#f4f4f8' }}>
                  Workout programs will appear here once they are added.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div style={sectionBoxStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ ...sectionHeadingStyle, marginBottom: 0 }}>Recipes</h3>
            <button
              type="button"
              style={tagsLinkStyle}
              onClick={() => navigate('/allrecipes/tags')}
            >
              See recipes by tags
            </button>
          </div>
          {recipes && recipes.length > 0 ? (
            <>
            <CardGroup>
              <div className="cards-container">
                {visibleRecipes.map(function (recipe, idx) {
                  return (
                    <Card
                      key={recipe._id || idx}
                      style={itemCardStyle}
                      onClick={() => showRecipe(recipe)}
                    >
                      <Card.Img
                        variant="top"
                        src={recipe.photo || DEFAULT_RECIPE_IMAGE}
                        alt={recipe.name || 'Recipe image'}
                        height="300"
                        width="400"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <Card.Body>
                        <Card.Title style={{ color: '#A7C7E7' }}>
                          {recipe.name}
                          {recipe.user?.username && (
                            <>
                              {' '}
                              by <i>{recipe.user.username}</i>
                            </>
                          )}
                        </Card.Title>
                        <Card.Text style={{ color: '#f4f4f8' }}>
                          <strong>Time Required:</strong> {recipe.timeRequired} minutes
                          <br />
                          {recipe.currentRating > 0 ? (
                            <StarRatingDisplay rating={recipe.currentRating} />
                          ) : (
                            <span style={{ color: '#A7C7E7' }}>No ratings yet</span>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </CardGroup>
            {hasMoreRecipes && (
              <p style={{ color: '#A7C7E7', marginTop: '12px', marginBottom: 0 }}>
                Showing {cardLimit} of {recipes.length} recipes.{' '}
                <button
                  type="button"
                  style={{ ...tagsLinkStyle, marginTop: '8px' }}
                  onClick={() => navigate('/allrecipes/tags')}
                >
                  Browse all by tag
                </button>
              </p>
            )}
            </>
          ) : (
            <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
              <Card.Body>
                <Card.Title style={{ color: '#A7C7E7' }}>No recipes yet</Card.Title>
                <Card.Text style={{ color: '#f4f4f8' }}>
                  Recipes will appear here once they are added.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
