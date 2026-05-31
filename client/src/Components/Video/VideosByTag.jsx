import axios from 'axios';
import React, { useEffect, useState } from "react";
import StarRatingDisplay from '../Utils/StarRatingDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
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

const backLinkStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid #A7C7E7',
  backgroundColor: 'transparent',
  color: '#A7C7E7',
  cursor: 'pointer',
  fontSize: '0.9rem',
  marginBottom: '16px',
};

function VideosByTag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/allvideos/${encodeURIComponent(tag)}`,
          { withCredentials: true }
        );
        setVideos(res.data.data || []);
      } catch (e) {
        console.error(e);
        setError('Could not load videos. Please try again.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      fetchVideos();
    }
  }, [tag]);

  const showVideo = (video) => {
    navigate('/show', { state: video });
  };

  if (loading) {
    return <p style={{ color: '#A7C7E7' }}>Loading videos…</p>;
  }

  if (error) {
    return <p style={{ color: '#f4f4f8' }}>{error}</p>;
  }

  return (
    <div>
      <button
        type="button"
        style={backLinkStyle}
        onClick={() => navigate('/workoutvideos/tags')}
      >
        ← Back to all tags
      </button>

      <div style={sectionBoxStyle}>
        <h2 style={sectionHeadingStyle}>{tag}</h2>
        {videos.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {videos.map((video, idx) => (
                <Card
                  key={video._id || idx}
                  style={itemCardStyle}
                  onClick={() => showVideo(video)}
                >
                  <Card.Img
                    variant="top"
                    src={video.imgFileUrl}
                    alt={video.name || 'Video image'}
                    height="300"
                    width="400"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <Card.Body>
                    <Card.Title style={{ color: '#A7C7E7' }}>
                      {video.name} by <i>{video.coach && video.coach.username}</i>
                    </Card.Title>
                    <Card.Text>
                      {video.currentRating > 0 ? (
                        <StarRatingDisplay rating={video.currentRating} />
                      ) : (
                        <span style={{ color: '#A7C7E7' }}>No ratings yet</span>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </CardGroup>
        ) : (
          <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
            <Card.Body>
              <Card.Title style={{ color: '#A7C7E7' }}>No videos found</Card.Title>
              <Card.Text style={{ color: '#f4f4f8' }}>
                No workout videos are tagged with &ldquo;{tag}&rdquo; yet.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}

export default VideosByTag;
