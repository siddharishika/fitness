import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import DeleteAccountModal from "../Utils/DeleteAccountModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/120x120?text=User";

const cardStyle = {
  width: "100%",
  border: "2px solid #A7C7E7",
  borderRadius: "10px",
  backgroundColor: "#161823",
};

const labelStyle = {
  color: "#A7C7E7",
  fontSize: "0.85rem",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const valueStyle = {
  color: "#f4f4f8",
  fontSize: "1.05rem",
  margin: 0,
};

const btnStyle = {
  flex: "1 1 200px",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid #A7C7E7",
  backgroundColor: "transparent",
  color: "#A7C7E7",
  cursor: "pointer",
};

function DetailField({ label, value }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function StatBlock({ label, count }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #A7C7E7",
        textAlign: "center",
        backgroundColor: "#0e0f14",
      }}
    >
      <div style={{ ...valueStyle, fontSize: "1.5rem", fontWeight: 600 }}>
        {count}
      </div>
      <div style={{ ...labelStyle, marginTop: "6px", marginBottom: 0 }}>
        {label}
      </div>
    </div>
  );
}

function MyAccount() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { handleAuthResponse } = useLoginPrompt();

  useEffect(() => {
    async function loadAccount() {
      try {
        const res = await axios.get(`${API_BASE_URL}/getuser`, {
          withCredentials: true,
        });
        if (handleAuthResponse(res, { redirect: true })) {
          return;
        }
        setAccount(res.data.data);
      } catch (err) {
        if (handleAuthResponse(err, { redirect: true })) {
          return;
        }
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {}
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await axios.delete(`${API_BASE_URL}/deleteaccount`, {
        withCredentials: true,
      });
      setUser(null);
      setShowDeleteModal(false);
      navigate("/login");
    } catch (err) {
      if (handleAuthResponse(err, { redirect: true })) {
        return;
      }
      setDeleteError(
        err.response?.data?.msg ||
          "Could not delete your account. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#A7C7E7" }}>Loading account…</p>;
  }

  if (!account) {
    return <p style={{ color: "#A7C7E7" }}>Could not load account details.</p>;
  }

  const roleLabel = account.role === "coach" ? "Coach" : "User";

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ color: "#A7C7E7", marginBottom: "20px" }}>My Account</h1>

      <Card style={cardStyle}>
        <Card.Body style={{ padding: "clamp(16px, 3vw, 32px)" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(20px, 4vw, 40px)",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "160px",
                padding: "8px 16px",
              }}
            >
              <img
                src={account.fileUrl || DEFAULT_PROFILE_IMAGE}
                alt={
                  account.username ? `${account.username} profile` : "Profile"
                }
                width={140}
                height={140}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #A7C7E7",
                  marginBottom: "16px",
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <h2
                style={{
                  color: "#f4f4f8",
                  fontSize: "1.35rem",
                  marginBottom: "6px",
                  textAlign: "center",
                }}
              >
                {account.username}
              </h2>
              <span
                style={{
                  color: "#A7C7E7",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  border: "1px solid #A7C7E7",
                  fontSize: "0.875rem",
                }}
              >
                {roleLabel}
              </span>
            </div>

            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px 32px",
                  marginBottom: "28px",
                }}
              >
                <DetailField label="Email" value={account.email} />
                <DetailField label="Gender" value={account.gender} />
                <DetailField label="Account type" value={roleLabel} />
              </div>

              <div style={labelStyle}>Liked content</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <StatBlock
                  label="Videos"
                  count={account.likedVideos?.length ?? 0}
                />
                <StatBlock
                  label="Programs"
                  count={account.likedPrograms?.length ?? 0}
                />
                <StatBlock
                  label="Recipes"
                  count={account.likedRecipes?.length ?? 0}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "28px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(167, 199, 231, 0.35)",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/edituser")}
              style={{ ...btnStyle, backgroundColor: "#161823" }}
            >
              Edit Account
            </button>
            <button type="button" onClick={handleLogout} style={btnStyle}>
              Log out
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteError("");
                setShowDeleteModal(true);
              }}
              style={{
                ...btnStyle,
                borderColor: "#d9534f",
                color: "#d9534f",
              }}
            >
              Delete Account
            </button>
          </div>
          {deleteError && (
            <p style={{ color: "#d9534f", marginTop: "16px", marginBottom: 0 }}>
              {deleteError}
            </p>
          )}
        </Card.Body>
      </Card>
      <DeleteAccountModal
        show={showDeleteModal}
        onHide={() => !deleting && setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deleting}
      />
    </div>
  );
}

export default MyAccount;
