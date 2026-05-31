import React, { useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import TagAdder from "../Utils/TagAdder";
import { useLoginPrompt } from "../Utils/useLoginPrompt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function AddRecipe(props) {
  const navigate = useNavigate();
  const { loginModal, handleAuthResponse } = useLoginPrompt();

  const [ingredients, setIngredients] = useState([]);
  const [process, setProcess] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const nameRef = useRef();
  const descriptionRef = useRef();
  const photoRef = useRef();
  const timeRequiredRef = useRef();
  const ingredientRef = useRef();
  const amountRef = useRef();
  const processRef = useRef();

  const tags = props.tags || [];

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const ingredient = ingredientRef.current?.value?.trim();
    const amount = amountRef.current?.value?.trim() || "0";
    if (!ingredient) return;
    setIngredients((prev) => [...prev, { ingredient, amount }]);
    ingredientRef.current.value = "";
    amountRef.current.value = "";
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddProcess = (e) => {
    e.preventDefault();
    const step = processRef.current?.value?.trim();
    if (!step) return;
    setProcess((prev) => [...prev, step]);
    processRef.current.value = "";
  };

  const handleRemoveProcess = (idx) => {
    setProcess((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTagsChange = (tagList) => {
    setSelectedTags(tagList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      photo: photoRef.current.value,
      timeRequired: timeRequiredRef.current.value,
      ingredients,
      process,
      tags: selectedTags.join(","),
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/addrecipe`, data, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      navigate("/allrecipes");
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
      console.log(err, "Nahi ho payega");
    }
  };

  return (
    <>
      <div className="mx-auto">
        <Container className="p-4 border rounded">
          <Form onSubmit={handleSubmit} method="POST">
            <div className="text-center mb-4">
              <h2 style={{ color: "#A7C7E7" }}>Add your recipe here!</h2>
            </div>

            <Form.Group className="mb-3" controlId="recipeName">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                placeholder="Enter recipe name"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="timeRequired">
                  <Form.Label>Time Required (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    ref={timeRequiredRef}
                    min={0}
                    placeholder="0"
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
                placeholder="Describe your recipe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <TagAdder tags={tags} onTagsChange={handleTagsChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Row className="g-2 mb-2">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    ref={ingredientRef}
                    placeholder="Ingredient name"
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    ref={amountRef}
                    placeholder="Amount (grams)"
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="light"
                    style={submitBtnStyle}
                    onClick={handleAddIngredient}
                    type="button"
                    className="w-100"
                  >
                    Add Ingredient
                  </Button>
                </Col>
              </Row>
              <ul className="list-unstyled mb-0">
                {ingredients.map((item, idx) => (
                  <li key={idx} className="d-flex align-items-center gap-2 mb-1">
                    <span>{item.ingredient} — {item.amount}grams</span>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cooking Steps</Form.Label>
              <Row className="g-2 mb-3">
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    ref={processRef}
                    placeholder="Add a cooking step"
                  />
                </Col>
                <Col xs="auto" className="d-flex align-items-start">
                  <Button
                    variant="light"
                    style={submitBtnStyle}
                    onClick={handleAddProcess}
                    type="button"
                  >
                    <IoAddOutline />
                  </Button>
                </Col>
              </Row>
              <ol className="mb-0 ps-3">
                {process.map((step, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="d-flex align-items-start justify-content-between gap-3">
                      <span style={{ flex: 1 }}>{step}</span>
                      <Button
                        variant="link"
                        className="text-danger p-0 flex-shrink-0"
                        type="button"
                        onClick={() => handleRemoveProcess(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            </Form.Group>

            <Form.Group className="mb-3" controlId="photo">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                ref={photoRef}
                placeholder="Paste recipe image URL"
              />
            </Form.Group>

            <Button variant="light" style={submitBtnStyle} type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Container>
      </div>
      {loginModal}
    </>
  );
}

export default AddRecipe;
