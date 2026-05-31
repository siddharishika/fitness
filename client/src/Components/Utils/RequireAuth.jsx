import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useLoginPrompt } from "./useLoginPrompt";
import { LOGIN_REQUIRED_MSG } from "./routeToastMessages";

export default function RequireAuth({ children, redirectToLogin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { promptLogin, loginModal } = useLoginPrompt();

  useEffect(() => {
    if (!loading && !user && !redirectToLogin) {
      promptLogin();
    }
  }, [user, loading, promptLogin, redirectToLogin]);

  if (loading) {
    return null;
  }

  if (!user) {
    if (redirectToLogin) {
      return (
        <Navigate
          to="/login"
          replace
          state={{ authError: LOGIN_REQUIRED_MSG, from: location }}
        />
      );
    }
    return loginModal;
  }

  return (
    <>
      {children}
      {loginModal}
    </>
  );
}
