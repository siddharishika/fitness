import { IoCheckmarkSharp } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { Container, ToggleButton } from "react-bootstrap";

function TagAdder({ tags: initialTags = [], onTagsChange }) {
  const [tags, setTags] = useState(initialTags);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    setTags(initialTags);
    const checkedObj = {};
    initialTags.forEach((tag) => {
      checkedObj[tag] = false;
    });
    setChecked(checkedObj);
  }, [initialTags]);

  useEffect(() => {
    const checkedTags = tags.filter((tag) => checked[tag]);
    if (onTagsChange) {
      onTagsChange(checkedTags);
    }
  }, [checked, tags]);

  return (
    <div>
      <Container fluid className="px-0">
        <div className="tag-picker-grid">
          {tags.map((tag, idx) => (
            <div key={tag} className="tag-picker-cell">
              <ToggleButton
                className={`tag-picker-btn ${checked[tag] ? "tag-picker-btn--checked" : "tag-picker-btn--unchecked"}`}
                id={`toggle-${idx}`}
                type="checkbox"
                checked={!!checked[tag]}
                value={tag}
                onChange={(e) => {
                  setChecked((prev) => ({
                    ...prev,
                    [tag]: e.target.checked,
                  }));
                }}
              >
                {checked[tag] && (
                  <IoCheckmarkSharp className="tag-picker-check" />
                )}
                <span className="tag-picker-label">{tag}</span>
              </ToggleButton>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default TagAdder;
