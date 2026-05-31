import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import isCoach from "./isCoach";
import { BECOME_COACH_MSG } from "./routeToastMessages";

export default function RequireCoach({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isCoach(user)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          routeToast: {
            title: "Coach access required",
            message: BECOME_COACH_MSG,
          },
          from: location,
        }}
      />
    );
  }

  return children;
}
