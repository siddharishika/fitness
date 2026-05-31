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

function ProgramsByTag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/allprograms/${encodeURIComponent(tag)}`,
          { withCredentials: true }
        );
        setPrograms(res.data.data || []);
      } catch (e) {
        console.error(e);
        setError('Could not load programs. Please try again.');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      fetchPrograms();
    }
  }, [tag]);

  const showProgram = (program) => {
    navigate('/showprogram', { state: program });
  };

  if (loading) {
    return <p style={{ color: '#A7C7E7' }}>Loading programs…</p>;
  }

  if (error) {
    return <p style={{ color: '#f4f4f8' }}>{error}</p>;
  }

  return (
    <div>
      <button
        type="button"
        style={backLinkStyle}
        onClick={() => navigate('/allprograms/tags')}
      >
        ← Back to all tags
      </button>

      <div style={sectionBoxStyle}>
        <h2 style={sectionHeadingStyle}>{tag}</h2>
        {programs.length > 0 ? (
          <CardGroup>
            <div className="cards-container">
              {programs.map((program, idx) => (
                <Card
                  key={program._id || idx}
                  style={itemCardStyle}
                  onClick={() => showProgram(program)}
                >
                  <Card.Img
                    variant="top"
                    src={program.file}
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
              ))}
            </div>
          </CardGroup>
        ) : (
          <Card style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823' }}>
            <Card.Body>
              <Card.Title style={{ color: '#A7C7E7' }}>No programs found</Card.Title>
              <Card.Text style={{ color: '#f4f4f8' }}>
                No workout programs are tagged with &ldquo;{tag}&rdquo; yet.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgramsByTag;
