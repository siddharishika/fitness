import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider";
import { useLoginPrompt } from "../Utils/useLoginPrompt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/120x120?text=User";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submitBtnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerAsCoach = location.state?.registerAsCoach === true;
  const { setUser } = useAuth();
  const { handleAuthResponse } = useLoginPrompt();

  const passwordRef = useRef("");
  const passwordcRef = useRef("");
  const profilePictureRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("user");
  const [profileUrl, setProfileUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get(`${API_BASE_URL}/getuser`, {
          withCredentials: true,
        });
        if (handleAuthResponse(res, { redirect: true })) {
          return;
        }
        const account = res.data.data;
        setUsername(account.username || "");
        setEmail(account.email || "");
        setEmailConfirm(account.email || "");
        setGender(account.gender || "");
        setRole(registerAsCoach ? "coach" : account.role || "user");
        setProfileUrl(account.fileUrl || "");
      } catch (err) {
        if (handleAuthResponse(err, { redirect: true })) {
          return;
        }
        setError("Could not load your account details.");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleEmailChange = (nextEmail, nextConfirm) => {
    const trimmedEmail = nextEmail.trim();
    const trimmedConfirm = nextConfirm.trim();

    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setEmailFormatError("Please enter a valid email address.");
    } else {
      setEmailFormatError("");
    }

    if (trimmedConfirm && trimmedEmail !== trimmedConfirm) {
      setEmailError("Emails do not match.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = () => {
    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordcRef.current?.value ?? "";
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords do not match.");
    } else if (password && !passwordConfirm) {
      setPasswordError("Please confirm your new password.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordcRef.current?.value ?? "";
    const trimmedEmail = email.trim();
    const trimmedEmailConfirm = emailConfirm.trim();

    if (!isValidEmail(trimmedEmail)) {
      setEmailFormatError("Please enter a valid email address.");
      return;
    }
    setEmailFormatError("");

    if (trimmedEmail !== trimmedEmailConfirm) {
      setEmailError("Emails do not match. Please re-enter your confirm email.");
      return;
    }
    setEmailError("");

    if (password || passwordConfirm) {
      if (!password || !passwordConfirm) {
        setPasswordError("Please enter and confirm your new password.");
        return;
      }
      if (password !== passwordConfirm) {
        setPasswordError(
          "Passwords do not match. Please re-enter your confirm password.",
        );
        return;
      }
    }
    setPasswordError("");

    if (!gender) {
      setError("Please select a gender.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("email", trimmedEmail);
    formData.append("emailConfirm", trimmedEmailConfirm);
    formData.append("gender", gender);
    formData.append("role", role);
    if (password) {
      formData.append("password", password);
      formData.append("passwordc", passwordConfirm);
    }
    if (profilePictureRef.current?.files?.[0]) {
      formData.append("profilePicture", profilePictureRef.current.files[0]);
    }

    setSubmitting(true);
    try {
      const res = await axios.patch(`${API_BASE_URL}/edituser`, formData, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      if (res.data?.user) {
        setUser(res.data.user);
      }
      navigate("/myjourney", { state: { activeTab: "myAccount" } });
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          "Could not update account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="p-4">
        <p style={{ color: "#A7C7E7" }}>Loading account…</p>
      </Container>
    );
  }

  return (
    <div className="mx-auto">
      <Container className="p-4 border rounded">
        <Form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          method="POST"
        >
          <div className="text-center mb-4">
            <h2 style={{ color: "#A7C7E7" }}>Edit Account</h2>
            <p style={{ color: "#A7C7E7" }}>Update your profile details.</p>
            <img
              src={profileUrl || DEFAULT_PROFILE_IMAGE}
              alt="Current profile"
              width={100}
              height={100}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #A7C7E7",
                marginTop: "12px",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          </div>

          {error && (
            <p className="text-danger" role="alert">
              {error}
            </p>
          )}

          <Form.Group className="mb-3" controlId="editUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  handleEmailChange(value, emailConfirm);
                }}
                isInvalid={!!emailFormatError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {emailFormatError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="editEmailConfirm">
              <Form.Label>Confirm Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirm email"
                name="emailConfirm"
                value={emailConfirm}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmailConfirm(value);
                  handleEmailChange(email, value);
                }}
                isInvalid={!!emailError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Label>Gender</Form.Label>
          <div className="mb-3">
            <Form.Check
              type="radio"
              name="gender"
              id="edit-gender-male"
              label="Male"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
              required
            />
            <Form.Check
              type="radio"
              name="gender"
              id="edit-gender-female"
              label="Female"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
              required
            />
          </div>

          <Form.Label>Role</Form.Label>
          {registerAsCoach && (
            <p style={{ color: "#A7C7E7", fontSize: "0.9rem" }}>
              Coach is selected. Save your changes to register and start posting
              content.
            </p>
          )}
          <div className="mb-3">
            <Form.Check
              type="radio"
              name="role"
              id="edit-role-coach"
              label="Coach"
              value="coach"
              checked={role === "coach"}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            <Form.Check
              type="radio"
              name="role"
              id="edit-role-user"
              label="User"
              value="user"
              checked={role === "user"}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="editPassword">
              <Form.Label>New password (optional)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Leave blank to keep current password"
                name="password"
                ref={passwordRef}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="editPasswordConfirm">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                name="passwordc"
                ref={passwordcRef}
                onChange={handlePasswordChange}
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group controlId="editProfilePicture" className="mb-3">
            <Form.Label>Profile picture (optional)</Form.Label>
            <Form.Control
              type="file"
              name="profilePicture"
              ref={profilePictureRef}
              accept="image/*"
              size="lg"
            />
          </Form.Group>

          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant="light"
              type="button"
              style={submitBtnStyle}
              className="flex-grow-1"
              onClick={() =>
                navigate("/myjourney", { state: { activeTab: "myAccount" } })
              }
            >
              Cancel
            </Button>
            <Button
              variant="light"
              type="submit"
              style={submitBtnStyle}
              className="flex-grow-1"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default EditUser;
