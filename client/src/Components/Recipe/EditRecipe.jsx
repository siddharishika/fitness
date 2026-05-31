import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import TagAdderEdit from "../Utils/TagAdderEdit";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import { normalizeTags, mergeRecipeTagOptions } from "../Utils/recipeTags";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function EditRecipe(props) {
  const location = useLocation();
  const initialData = location.state || {};
  const navigate = useNavigate();
  const { loginModal, handleAuthResponse } = useLoginPrompt();

  const [recipe, setRecipe] = useState(initialData);
  const [ingredients, setIngredients] = useState(initialData.ingredients || []);
  const [process, setProcess] = useState(initialData.process || []);
  const [selectedTags, setSelectedTags] = useState(() =>
    normalizeTags(initialData.tags),
  );
  const [loading, setLoading] = useState(!!initialData._id);

  const nameRef = useRef(initialData.name || "");
  const descriptionRef = useRef(initialData.description || "");
  const photoRef = useRef(initialData.photo || "");
  const timeRequiredRef = useRef(initialData.timeRequired || "");
  const ingredientRef = useRef();
  const amountRef = useRef();
  const processRef = useRef();

  useEffect(() => {
    async function loadRecipe() {
      if (!initialData._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE_URL}/showrecipe/${initialData._id}`,
          {
            withCredentials: true,
          },
        );
        const data = res.data.data;
        setRecipe(data);
        setIngredients(data.ingredients || []);
        setProcess(data.process || []);
        setSelectedTags(normalizeTags(data.tags));
      } catch (e) {
        handleAuthResponse(e, { redirect: true });
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [initialData._id]);

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

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const recipeTagOptions = useMemo(
    () => mergeRecipeTagOptions(props.tags || [], recipe.tags),
    [props.tags, recipe.tags],
  );

  const initialRecipeTags = useMemo(
    () => normalizeTags(recipe.tags),
    [recipe.tags],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      _id: recipe._id,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      photo: photoRef.current.value,
      timeRequired: timeRequiredRef.current.value,
      ingredients,
      process,
      tags: selectedTags,
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/edit`, payload, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      navigate("/showrecipe", {
        state: res.data.data || { ...recipe, ...payload, tags: selectedTags },
      });
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
    }
  };

  if (!initialData._id && !recipe._id) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>
          No recipe selected. Open a recipe and choose Edit.
        </p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="p-4 border rounded text-center">
        <p style={{ color: "#A7C7E7" }}>Loading recipe…</p>
      </Container>
    );
  }

  return (
    <>
      <div className="mx-auto">
        <Container className="p-4 border rounded">
          <Form onSubmit={handleSubmit} method="POST">
            <div className="text-center mb-4">
              <h2 style={{ color: "#A7C7E7" }}>Edit your recipe here!</h2>
            </div>

            <Form.Group className="mb-3" controlId="recipeName">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                defaultValue={recipe.name}
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
                    defaultValue={recipe.timeRequired}
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
                defaultValue={recipe.description}
                placeholder="Describe your recipe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <TagAdderEdit
                tags={recipeTagOptions}
                initialSelectedTags={initialRecipeTags}
                onTagsChange={handleTagsChange}
              />
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
                  <li
                    key={idx}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <span>
                      {item.ingredient} — {item.amount}grams
                    </span>
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
                defaultValue={recipe.photo}
                placeholder="Paste recipe image URL"
              />
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

export default EditRecipe;
