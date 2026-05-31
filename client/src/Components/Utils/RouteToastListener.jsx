import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthToast from "./AuthToast";

export default function RouteToastListener() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Notice");

  useEffect(() => {
    const routeToast = location.state?.routeToast;
    if (!routeToast?.message) return;

    setMessage(routeToast.message);
    setTitle(routeToast.title || "Notice");
    setShow(true);

    const { routeToast: _removed, ...restState } = location.state || {};
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: Object.keys(restState).length ? restState : null,
    });
  }, [location.key, location.pathname, location.search, location.state, navigate]);

  return (
    <AuthToast
      show={show}
      message={message}
      title={title}
      onClose={() => setShow(false)}
    />
  );
}
