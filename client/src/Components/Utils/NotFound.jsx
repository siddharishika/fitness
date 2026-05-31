import { Navigate } from "react-router-dom";
import { PAGE_NOT_FOUND_MSG } from "./routeToastMessages";

export default function NotFound() {
  return (
    <Navigate
      to="/"
      replace
      state={{
        routeToast: {
          title: "Page not found",
          message: PAGE_NOT_FOUND_MSG,
        },
      }}
    />
  );
}
