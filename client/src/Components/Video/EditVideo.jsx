import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import TagAdderEdit from '../Utils/TagAdderEdit';
import { useLoginPrompt } from '../Utils/useLoginPrompt';

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
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function tagsEqual(a, b) {
  const left = normalizeTags(a).slice().sort().join(",");
  const right = normalizeTags(b).slice().sort().join(",");
  return left === right;
}

function EditVideo(props) {
  const location = useLocation();
  const initialData = location.state || {};
  const fileRef = useRef();
  const imgFileRef = useRef();
  const navigate = useNavigate();
  const { loginModal, handleAuthResponse } = useLoginPrompt();

  const [video, setVideo] = useState(initialData);
  const [selectedTags, setSelectedTags] = useState(() => normalizeTags(initialData.tags));
  const [loading, setLoading] = useState(!!initialData._id);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef(initialData.name || "");
  const tags = props.tags || [];

  useEffect(() => {
    async function loadVideo() {
      if (!initialData._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/show/${initialData._id}`, {
          withCredentials: true,
        });
        const data = res.data.data;
        setVideo(data);
        setSelectedTags(normalizeTags(data.tags));
      } catch (e) {
        handleAuthResponse(e, { redirect: true });
        setError("Could not load video. Open it from your videos and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadVideo();
  }, [initialData._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const videoId = video._id;
    if (!videoId) {
      setError("No video selected.");
      return;
    }

    const f = fileRef.current?.value;
    const imgf = imgFileRef.current?.value;
    const tagsChanged = !tagsEqual(selectedTags, video.tags);
    const nameChanged = nameRef.current?.value !== video.name;

    if (!f && !imgf && !tagsChanged && !nameChanged) {
      setError("Change the title, tags, or files before submitting.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    formData.set("name", nameRef.current?.value ?? video.name);
    formData.set("tags", selectedTags.join(","));
    formData.set("id", videoId);

    setSubmitting(true);
    try {
      let res;
      if (f && imgf) {
        await axios.delete(`${API_BASE_URL}/delete/${videoId}`, { withCredentials: true });
        res = await axios.post(`${API_BASE_URL}/add`, formData, { withCredentials: true });
      } else if (f && !imgf) {
        res = await axios.patch(`${API_BASE_URL}/edit/f`, formData, { withCredentials: true });
      } else if (imgf && !f) {
        res = await axios.patch(`${API_BASE_URL}/edit/imgf/${videoId}`, formData, { withCredentials: true });
      } else {
        res = await axios.patch(`${API_BASE_URL}/edit/${videoId}`, formData, { withCredentials: true });
      }

      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }

      const authMsg = res?.data?.message;
      if (res?.data?.success === false) {
        setError(authMsg || "You are not allowed to edit this video.");
        return;
      }

      navigate("/show", {
        state: {
          ...video,
          name: nameRef.current?.value ?? video.name,
          tags: selectedTags,
        },
      });
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Could not save video changes. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTagsChange = (tagList) => {
    setSelectedTags(tagList);
  };

  if (!initialData._id && !video._id) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>No video selected. Open a video and choose Edit.</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>Loading video…</p>
      </Container>
    );
  }

  return (
    <>
      <div className="mx-auto">
        <Container className="p-4 border rounded">
          <Form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
            <div className="text-center mb-4">
              <h2 style={{ color: "#A7C7E7" }}>Edit your video here!</h2>
            </div>

            {error && (
              <p className="text-danger" role="alert">
                {error}
              </p>
            )}

            <Form.Group className="mb-3" controlId="formGridTitle">
              <Form.Label>Video Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video title"
                name="name"
                ref={nameRef}
                defaultValue={video.name}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <TagAdderEdit
                tags={tags}
                initialSelectedTags={normalizeTags(video.tags)}
                onTagsChange={handleTagsChange}
              />
            </Form.Group>

            <Form.Group controlId="formFileLg" className="mb-3">
              <Form.Label>If you want to change video, please select video</Form.Label>
              <Form.Control type="file" name="file" ref={fileRef} accept="video/*" size="lg" />
            </Form.Group>

            <Form.Group controlId="formFileImg" className="mb-3">
              <Form.Label>If you want to change image, please select image</Form.Label>
              <Form.Control type="file" name="imgFile" ref={imgFileRef} accept="image/*" size="lg" />
            </Form.Group>

            <Button
              variant="light"
              style={submitBtnStyle}
              type="submit"
              className="w-100"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Submit"}
            </Button>
          </Form>
        </Container>
      </div>
      {loginModal}
    </>
  );
}

export default EditVideo;
