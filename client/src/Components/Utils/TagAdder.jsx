import { IoAddOutline, IoCheckmarkSharp } from "react-icons/io5";
 
import React, { useRef, useState, useEffect } from "react";
import {
  ButtonGroup,
  Container,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function TagAdder({ tags: initialTags = [], onTagsChange }) {
  const [tags, setTags] = useState(initialTags);
  const tagInputRef = useRef();
  const [checked, setChecked] = useState({});
  const [finalTags, setFinalTags] = useState([]);

  // Only initialize once on mount
  useEffect(() => {
    setTags(initialTags);
    const checkedObj = {};
    initialTags.forEach((tag) => {
      checkedObj[tag] = false;
    });
    setChecked(checkedObj);
  }, []); // <-- Only on mount

  // Update finalTags whenever checked or tags change
  useEffect(() => {
    const checkedTags = tags.filter((tag) => checked[tag]);
    setFinalTags(checkedTags);
    if (onTagsChange) {
      onTagsChange(checkedTags);
    }
  }, [checked, tags]); // <-- Remove onTagsChange from dependencies

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInputRef.current.value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setChecked((prev) => ({ ...prev, [newTag]: true }));
      tagInputRef.current.value = "";
    }
  };

  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  return (
    <div>
      <input type="text" ref={tagInputRef} placeholder="Enter tag" />
      <IoAddOutline onClick={handleAddTag} style={{ cursor: "pointer" }} />
      <Container>
        {chunkArray(tags, Math.ceil(tags.length / 5)).map((rowTags, rowIdx) => (
          <Row key={rowIdx} className="mb-2">
            {rowTags.map((tag, idx) => (
              <Col key={idx}>
                <ToggleButton
                  className="mb-2"
                  id={`toggle-${rowIdx}-${idx}`}
                  type="checkbox"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "8px",
                  }}
                  checked={checked[tag]}
                  value={tag}
                  onChange={(e) => {
                    setChecked((prev) => ({
                      ...prev,
                      [tag]: e.target.checked,
                    }));
                  }}
                >
                  {checked[tag] && (
                    <IoCheckmarkSharp style={{ color: "green" }} />
                  )}
                  <span>{tag}</span>
                </ToggleButton>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
      {/* Display finalTags for debugging */}
      <div>
        <strong>Checked tags:</strong> {finalTags.join(", ")}
      </div>
    </div>
  );
}

export default TagAdder;
