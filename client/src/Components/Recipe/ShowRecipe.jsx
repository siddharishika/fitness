import axios from "axios";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Form, InputGroup } from "react-bootstrap";
import { useAuth } from '../Utils/AuthProvider';
import RatingRecipe from "./RatingRecipe";
import StarRatingDisplay from '../Utils/StarRatingDisplay';
import { useLoginPrompt } from '../Utils/useLoginPrompt';
import { isAuthorContentError } from '../Utils/authorContent';
import AuthorContentModal from '../Utils/AuthorContentModal';
import ConfirmDeleteModal from '../Utils/ConfirmDeleteModal';
import { useConfirmDelete } from '../Utils/useConfirmDelete';
import isCoach from '../Utils/isCoach';
import ReviewComment from '../Utils/ReviewComment';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function ShowRecipe() {
  let location = useLocation();
  let initialRecipe = location.state;
  let navigate = useNavigate();
  const [recipe, setRecipe] = useState(initialRecipe);
  const [liked, setLiked] = useState(false);
  let reviewRef = React.useRef(null);
  const { user } = useAuth();
  const { promptLogin, redirectToLogin, loginModal, handleAuthResponse } = useLoginPrompt();
  const { requestDelete, deleteModalProps } = useConfirmDelete();
  const [showAuthorContent, setShowAuthorContent] = useState(false);
  const ownerId = recipe?.user?._id ?? recipe?.user;
  const isOwner = user && ownerId && String(user._id) === String(ownerId);
  const canManage = isCoach(user) && isOwner;

  useEffect(() => {
    async function getRecipe() {
      if (!initialRecipe?._id) return;
      try {
        let res = await axios.get(`${API_BASE_URL}/showrecipe/${initialRecipe._id}`, {
          withCredentials: true,
        });
        setRecipe(res.data.data);
      } catch (e) {
        console.error(e);
      }
    }
    getRecipe();
  }, [initialRecipe]);

  const handleEditRecipe = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    navigate(`/recipe/edit`, { state: recipe });
  };

  const performDeleteRecipe = async () => {
    let res = await axios.post(`${API_BASE_URL}/deleterecipe/${recipe._id}`, {}, {
      withCredentials: true,
    });
    if (handleAuthResponse(res, { redirect: true })) {
      return;
    }
    navigate("/");
  };

  const handleDeleteRecipe = () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    requestDelete({
      itemLabel: "recipe",
      itemName: recipe.name,
      onConfirm: async () => {
        try {
          await performDeleteRecipe();
        } catch (e) {
          if (handleAuthResponse(e, { redirect: true })) {
            return;
          }
          console.log(e);
        }
      },
    });
  };

  const handleLikeRecipe = async () => {
    if (!user) {
      promptLogin();
      return;
    }
    try {
      let res = await axios.post(`${API_BASE_URL}/changerecipelike`, recipe, {
        withCredentials: true,
      });

      if (handleAuthResponse(res)) {
        return;
      }
      setLiked((prev) => !prev);
    } catch (e) {
      if (handleAuthResponse(e)) {
        return;
      }
      console.log(e, "Nahi ho payega");
    }
  };

  useEffect(() => {
    async function checkLiked() {
      try {
        let likedRes = await axios.get(`${API_BASE_URL}/getlikedrecipes`, { withCredentials: true });
        if (likedRes.data && likedRes.data.data && Array.isArray(likedRes.data.data.likedRecipes)) {
          const exists = likedRes.data.data.likedRecipes.some((r) => String(r._id) === String(recipe._id));
          setLiked(exists);
        }
      } catch (err) {
        // ignore if unauthenticated
      }
    }
    if (recipe && recipe._id) checkLiked();
  }, [recipe]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isOwner) {
      setShowAuthorContent(true);
      return;
    }
    if (!user) {
      promptLogin();
      return;
    }
    const reviewText = reviewRef.current ? reviewRef.current.value : "";
    try {
      let res = await axios.post(`${API_BASE_URL}/recipe/addreview/${recipe._id}`, { review: reviewText }, {
        withCredentials: true,
      });
      if (handleAuthResponse(res)) {
        return;
      }
      if (isAuthorContentError(res)) {
        setShowAuthorContent(true);
        return;
      }
      let updated = await axios.get(`${API_BASE_URL}/showrecipe/${recipe._id}`, {
        withCredentials: true,
      });
      setRecipe(updated.data.data);
      reviewRef.current.value = "";
    } catch (e) {
      if (isAuthorContentError(e)) {
        setShowAuthorContent(true);
        return;
      }
      if (handleAuthResponse(e)) {
        return;
      }
      console.log(e, "Nahi ho payega");
    }
  };

  if (!recipe) {
    return <div style={{ color: '#A7C7E7' }}>Loading recipe...</div>;
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#0e0f14",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />
      <div className="mx-auto p-4 rounded" style={{ position: "relative", zIndex: 1, backgroundColor: "#0e0f14", color: "#f4f4f8" }}>
        <h1 style={{ color: "#A7C7E7" }}>{recipe.name}</h1>

        <Card style={{ border: "5px solid #A7C7E7", borderRadius: "10px", backgroundColor: "#000000" }}>
          {recipe.photo && (
            <Card.Img
              variant="top"
              src={recipe.photo}
              style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
            />
          )}
          <Card.Body>
            <Card.Text style={{ color: "#f4f4f8" }}><strong>Time Required:</strong> {recipe.timeRequired} minutes</Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}><strong>Description:</strong> {recipe.description}</Card.Text>
            <Card.Text>
              {recipe.currentRating > 0 ? (
                <StarRatingDisplay
                  rating={recipe.currentRating}
                  fontSize="clamp(14px, 2.5vw, 28px)"
                />
              ) : (
                <span style={{ color: '#A7C7E7' }}>No ratings yet</span>
              )}
            </Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}><strong>Tags:</strong> {recipe.tags?.join(" • ")}</Card.Text>
            <Card.Text style={{ color: "#f4f4f8" }}><strong>Ingredients:</strong></Card.Text>
            <ul style={{ color: "#f4f4f8", paddingLeft: "1rem" }}>
              {recipe?.ingredients?.map((ingr, i) => (
                <li key={i}>{ingr.ingredient} — {ingr.amount}grams</li>
              ))}
            </ul>
            <Card.Text style={{ color: "#f4f4f8" }}><strong>How to cook?</strong></Card.Text>
            <ul style={{ color: "#f4f4f8", paddingLeft: "1rem" }}>
              {recipe?.process?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <div style={{ color: "#f4f4f8", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button variant="light" style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823", color: "#A7C7E7" }} onClick={handleLikeRecipe}>
            {liked ? 'Remove from Liked Recipes' : 'Add to Liked Recipes'}
          </Button>
                {canManage && (
                  <>
                    <Button variant="light" style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823", color: "#A7C7E7" }} onClick={handleEditRecipe}>
                      Edit Recipe
                    </Button>
                    <Button variant="light" style={{ border: "2px solid #A7C7E7", backgroundColor: "#161823", color: "#A7C7E7" }} onClick={handleDeleteRecipe}>
                      Delete Recipe
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        <br />

        
        {!isOwner && (
            <Container style={{ border: "2px solid #A7C7E7", padding: "20px", borderRadius: "10px", backgroundColor: "#A7C7E7" }}>
            <Row>
              <>
                <h3 style={{ color: "#1f2532" }}><i>Rate this recipe</i></h3>
                <RatingRecipe
                  recipeId={recipe._id}
                  currentRating={recipe.currentRating}
                  currentRatingCount={recipe.currentRatingCount}
                  contentRatings={recipe.rating}
                  isRecipe={true}
                  isAuthenticated={!!user}
                  isOwner={isOwner}
                  onRequireLogin={promptLogin}
                />
                <br />
                <br />
                <Form onSubmit={handleReviewSubmit} method="POST">
                  <Form.Label><h3 style={{ color: "#1f2532" }}><i>Leave a review</i></h3></Form.Label>
                  <InputGroup style={{ padding: "10px" }}>
                    <Form.Control as="textarea" aria-label="With textarea" placeholder="Enter your review here" name="review" ref={reviewRef} />
                  </InputGroup>
                  <Button type="submit" variant="light" style={{ border: "2px solid black", backgroundColor: "#161823", color: "#A7C7E7" }} className="w-100">
                    Submit
                  </Button>
                </Form>
              </>
              </Row>
            </Container>
        )}

          

        <br />

        <h2 style={{ color: "#A7C7E7" }}><i>Comments</i></h2>
        <div style={{ border: "2px solid #A7C7E7", padding: "10px", borderRadius: "10px", backgroundColor: "#000000" }}>
          {recipe?.reviews?.map((rev, i) => (
            <div key={i} style={{ padding: "10px", backgroundColor: "#000000", borderRadius: "10px", cursor: "pointer" }}>
              <ReviewComment review={rev} />
              {i < recipe.reviews.length - 1 && (
                <hr style={{ borderColor: "#A7C7E7", margin: "1% 0" }} />
              )}
            </div>
          ))}
        </div>

        
      </div>
      {loginModal}
      <ConfirmDeleteModal {...deleteModalProps} />
      <AuthorContentModal
        show={showAuthorContent}
        onHide={() => setShowAuthorContent(false)}
      />
    </>
  );
}

export default ShowRecipe;
