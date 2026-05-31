import { IoCheckmarkSharp } from "react-icons/io5";
import React, { useState, useEffect, useRef } from "react";
import { Container, ToggleButton } from "react-bootstrap";

function normalizeTags(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function tagsKey(tags) {
  return [...tags].sort().join("\0");
}

function buildCheckedState(allTags, selectedTags) {
  const selectedSet = new Set(normalizeTags(selectedTags));
  const checkedObj = {};
  allTags.forEach((tag) => {
    checkedObj[tag] = selectedSet.has(tag);
  });
  selectedSet.forEach((tag) => {
    if (!(tag in checkedObj)) {
      checkedObj[tag] = true;
    }
  });
  return checkedObj;
}

function mergeTagList(initialTags, initialSelectedTags, prevTags = []) {
  const merged = [...initialTags];
  normalizeTags(initialSelectedTags).forEach((tag) => {
    if (!merged.includes(tag)) merged.push(tag);
  });
  prevTags.forEach((tag) => {
    if (!merged.includes(tag)) merged.push(tag);
  });
  return merged;
}

function TagAdderEdit({
  tags: initialTags = [],
  initialSelectedTags = [],
  onTagsChange,
}) {
  const onTagsChangeRef = useRef(onTagsChange);
  onTagsChangeRef.current = onTagsChange;

  const initialTagsKey = tagsKey(initialTags);
  const selectedKey = tagsKey(normalizeTags(initialSelectedTags));

  const [tags, setTags] = useState(() =>
    mergeTagList(initialTags, initialSelectedTags),
  );

  const [checked, setChecked] = useState(() =>
    buildCheckedState(
      mergeTagList(initialTags, initialSelectedTags),
      initialSelectedTags,
    ),
  );

  useEffect(() => {
    setTags((prev) => mergeTagList(initialTags, initialSelectedTags, prev));
    setChecked((prev) => {
      const merged = mergeTagList(
        initialTags,
        initialSelectedTags,
        Object.keys(prev),
      );
      return buildCheckedState(merged, initialSelectedTags);
    });
  }, [initialTagsKey, selectedKey]);

  const notifyTagsChange = (nextChecked, tagList) => {
    const checkedTags = tagList.filter((tag) => nextChecked[tag]);
    onTagsChangeRef.current?.(checkedTags);
  };

  return (
    <div>
      <Container fluid className="px-0">
        <div className="tag-picker-grid">
          {tags.map((tag, idx) => (
            <div key={tag} className="tag-picker-cell">
              <ToggleButton
                className={`tag-picker-btn ${checked[tag] ? "tag-picker-btn--checked" : "tag-picker-btn--unchecked"}`}
                id={`edit-toggle-${idx}`}
                type="checkbox"
                checked={!!checked[tag]}
                value={tag}
                onChange={(e) => {
                  const next = {
                    ...checked,
                    [tag]: e.target.checked,
                  };
                  setChecked(next);
                  notifyTagsChange(next, tags);
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

export default TagAdderEdit;
