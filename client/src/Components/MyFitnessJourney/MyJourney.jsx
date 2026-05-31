import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LikedVideos from "./LikedVideos";
import LikedPrograms from "./LikedPrograms";
import LikedRecipes from "./LikedRecipes";
import MyVideos from "./MyVideos";
import MyPrograms from "./MyPrograms";
import MyRecipes from "./MyRecipes";
import MyAccount from "./MyAccount";
import { useLoginPrompt } from "../Utils/useLoginPrompt";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider";
import isCoach from "../Utils/isCoach";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function MyJourney() {
  let location = useLocation();
  let [user, SetUser] = useState({});
  let navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { handleAuthResponse } = useLoginPrompt();
  const userIsCoach = isCoach(authUser);
  useEffect(function () {
    async function getUser() {
      let res = await axios.get(`${API_BASE_URL}/getuser`, {
        withCredentials: true,
      });
      if (handleAuthResponse(res, { redirect: true })) {
        return;
      }
      SetUser(res.data.data);
    }
    getUser();
  }, []);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "videos",
  );

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state?.activeTab]);

  useEffect(() => {
    if (
      !userIsCoach &&
      ["myVideos", "myPrograms", "myRecipes"].includes(activeTab)
    ) {
      setActiveTab("videos");
    }
  }, [userIsCoach, activeTab]);

  const handleUserLikedVideos = (e) => {
    setActiveTab("videos");
  };
  const handleUserLikedPrograms = (e) => {
    setActiveTab("programs");
  };
  const handleLikedRecipes = (e) => {
    setActiveTab("recipes");
  };
  const handleMyVideos = () => {
    setActiveTab("myVideos");
  };
  const handleMyPrograms = () => {
    setActiveTab("myPrograms");
  };
  const handleMyRecipes = () => {
    setActiveTab("myRecipes");
  };
  const handleMyAccount = () => {
    setActiveTab("myAccount");
  };

  const tabButtonStyle = (isActive) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: isActive ? "2px solid #A7C7E7" : "1px solid #444",
    backgroundColor: isActive ? "#161823" : "transparent",
    color: "#A7C7E7",
    cursor: "pointer",
  });

  return (
    <>
      <div>
        <h1>My Journey</h1>

        {!userIsCoach && authUser && (
          <div
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "16px 20px",
              borderRadius: "10px",
              border: "2px solid #A7C7E7",
              backgroundColor: "#161823",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <p style={{ color: "#f4f4f8", margin: 0 }}>
              Register as coach by editing account to post your own content.
            </p>
            <button
              type="button"
              onClick={() => navigate("/edituser")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "2px solid #A7C7E7",
                backgroundColor: "transparent",
                color: "#A7C7E7",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Edit Account
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={handleUserLikedVideos}
            style={tabButtonStyle(activeTab === "videos")}
          >
            Liked Videos
          </button>
          <button
            onClick={handleUserLikedPrograms}
            style={tabButtonStyle(activeTab === "programs")}
          >
            Liked Programs
          </button>
          <button
            onClick={handleLikedRecipes}
            style={tabButtonStyle(activeTab === "recipes")}
          >
            Liked Recipes
          </button>
          {userIsCoach && (
            <>
              <button
                onClick={handleMyVideos}
                style={tabButtonStyle(activeTab === "myVideos")}
              >
                My Videos
              </button>
              <button
                onClick={handleMyPrograms}
                style={tabButtonStyle(activeTab === "myPrograms")}
              >
                My Programs
              </button>
              <button
                onClick={handleMyRecipes}
                style={tabButtonStyle(activeTab === "myRecipes")}
              >
                My Recipes
              </button>
            </>
          )}
          <button
            onClick={handleMyAccount}
            style={tabButtonStyle(activeTab === "myAccount")}
          >
            My Account
          </button>
        </div>

        <div>
          {activeTab === "videos" && <LikedVideos />}
          {activeTab === "programs" && <LikedPrograms />}
          {activeTab === "recipes" && <LikedRecipes />}
          {userIsCoach && activeTab === "myVideos" && <MyVideos />}
          {userIsCoach && activeTab === "myPrograms" && <MyPrograms />}
          {userIsCoach && activeTab === "myRecipes" && <MyRecipes />}
          {activeTab === "myAccount" && <MyAccount />}
        </div>
      </div>
    </>
  );
}

export default MyJourney;
