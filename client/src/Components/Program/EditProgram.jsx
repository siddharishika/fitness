import React, { useEffect, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import TagAdderEdit from "../Utils/TagAdderEdit";
import { useLoginPrompt } from "../Utils/useLoginPrompt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

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

function getDayVideoIds(day) {
  if (!Array.isArray(day)) return new Set();
  return new Set(
    day.map((entry) => {
      if (entry && typeof entry === "object" && entry._id)
        return String(entry._id);
      return String(entry);
    }),
  );
}

function buildScheduleChecked(fitnessVideos, programSchedule, numDays) {
  const schedule = programSchedule || [];
  const arr = [];
  for (let i = 0; i < numDays; i++) {
    const dayIds = getDayVideoIds(schedule[i]);
    const row = fitnessVideos.map((video) => dayIds.has(String(video._id)));
    arr.push(row);
  }
  return arr;
}

function EditProgram(props) {
  const location = useLocation();
  const data = location.state || {};
  const navigate = useNavigate();
  const { loginModal, handleAuthResponse } = useLoginPrompt();

  const nameRef = useRef(data.name || "");
  const noOfDaysRef = useRef(data.numberOfDays || 1);
  const timeRef = useRef(data.timePerDay || 0);
  const descriptionRef = useRef(data.description || "");
  const equipmentRef = useRef();

  const [selectedValue, setSelect] = useState(1);
  const [checked, setChecked] = useState([]);
  const [videos, setVideos] = useState([]);
  const [equipArr, setEquipArr] = useState(data.equipment || []);
  const [selectedTags, setSelectedTags] = useState(() =>
    normalizeTags(data.tags),
  );
  const [loading, setLoading] = useState(true);
  const tags = props.tags || [];

  useEffect(() => {
    async function loadVideos() {
      if (!data._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/getall`, {
          withCredentials: true,
        });
        if (handleAuthResponse(res, { redirect: true })) {
          return;
        }
        const fitnessVideos = res.data.data || [];
        setVideos(fitnessVideos);
        const numDays = Number(data.numberOfDays) || 1;
        setChecked(buildScheduleChecked(fitnessVideos, data.schedule, numDays));
        setSelect(1);
      } catch (e) {
        handleAuthResponse(e, { redirect: true });
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [data._id]);

  const handlePlus2 = (e) => {
    e.preventDefault();
    const value = equipmentRef.current?.value?.trim();
    if (value) {
      setEquipArr((prev) => [...prev, value]);
      equipmentRef.current.value = "";
    }
  };

  const handleMinus2 = (idx) => {
    setEquipArr((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDays = (e) => {
    const days = Number(e.target.value);
    if (days < 1) return;

    setChecked((prev) => {
      if (days > prev.length) {
        const emptyRow = videos.map(() => false);
        return [
          ...prev,
          ...Array(days - prev.length)
            .fill(null)
            .map(() => [...emptyRow]),
        ];
      }
      if (days < prev.length) {
        return prev.slice(0, days);
      }
      return prev;
    });
    setSelect(1);
  };

  const handleSelect = (e) => {
    setSelect(Number(e.target.value));
  };

  const handleChange = (videoIdx) => {
    const dayIdx = selectedValue - 1;
    setChecked((prev) =>
      prev.map((day, i) =>
        i === dayIdx ? day.map((val, j) => (j === videoIdx ? !val : val)) : day,
      ),
    );
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: data._id,
      name: nameRef.current.value,
      numberOfDays: noOfDaysRef.current.value,
      schedule: checked,
      equipment: equipArr,
      typeOfProgram: data.typeOfProgram || [],
      description: descriptionRef.current.value,
      timePerDay: timeRef.current.value,
      tags: selectedTags,
    };
    try {
      const res = await axios.patch(`${API_BASE_URL}/editprogram`, payload, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      navigate("/showprogram", {
        state: { ...data, ...payload, tags: selectedTags },
      });
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
    }
  };

  if (!data._id) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>
          No program selected. Open a program and choose Edit.
        </p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>Loading program…</p>
      </Container>
    );
  }

  const dayIndex = selectedValue - 1;

  return (
    <>
      <div className="mx-auto">
        <Container className="p-4 border rounded">
          <Form onSubmit={handleSubmit} method="POST">
            <div className="text-center mb-4">
              <h2 style={{ color: "#A7C7E7" }}>Edit your program here!</h2>
            </div>

            <Form.Group className="mb-3" controlId="programName">
              <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                defaultValue={data.name}
                placeholder="Enter program name"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="timePerDay">
                  <Form.Label>Time Per Day (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    ref={timeRef}
                    min={0}
                    defaultValue={data.timePerDay}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                ref={descriptionRef}
                defaultValue={data.description}
                placeholder="Describe your program"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <TagAdderEdit
                tags={tags}
                initialSelectedTags={normalizeTags(data.tags)}
                onTagsChange={handleTagsChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Equipment</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  ref={equipmentRef}
                  placeholder="Add equipment"
                />
                <Button
                  variant="light"
                  style={submitBtnStyle}
                  onClick={handlePlus2}
                  type="button"
                >
                  <IoAddOutline />
                </Button>
              </div>
              <ul className="list-unstyled mb-0">
                {equipArr.map((item, idx) => (
                  <li
                    key={idx}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <span>{item}</span>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      type="button"
                      onClick={() => handleMinus2(idx)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Days</Form.Label>
              <Form.Control
                type="number"
                ref={noOfDaysRef}
                name="numberOfDays"
                min={1}
                defaultValue={data.numberOfDays}
                onChange={handleDays}
                className="mb-3"
                required
              />
              <Form.Label>Workout Schedule</Form.Label>
              <Form.Select
                id="dropdownButton"
                value={selectedValue}
                onChange={handleSelect}
                className="mb-3"
              >
                {checked.map((_, idx) => (
                  <option key={idx} value={idx + 1}>
                    Day {idx + 1}
                  </option>
                ))}
              </Form.Select>

              {videos.length > 0 && checked.length > 0 && (
                <Row className="g-3">
                  {videos.map((video, idx) => (
                    <Col key={video._id || idx} xs={12} md={6} lg={4}>
                      <Card
                        style={{
                          border: "2px solid #A7C7E7",
                          borderRadius: "10px",
                          backgroundColor: "#161823",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={video.imgFileUrl}
                          alt={video.name}
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <Card.Body>
                          <Card.Title
                            style={{ color: "#A7C7E7", fontSize: "1rem" }}
                          >
                            {video.name}
                          </Card.Title>
                          <Form.Check
                            type="checkbox"
                            style={{ color: "#A7C7E7" }}
                            id={`video-day-${dayIndex}-${idx}`}
                            label="Include on this day"
                            checked={!!checked[dayIndex]?.[idx]}
                            onChange={() => handleChange(idx)}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Form.Group>

            <Button
              variant="light"
              style={submitBtnStyle}
              type="submit"
              className="w-100"
            >
              Submit
            </Button>
          </Form>
        </Container>
      </div>
      {loginModal}
    </>
  );
}

export default EditProgram;
