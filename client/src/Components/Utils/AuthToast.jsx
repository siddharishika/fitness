import { Toast, ToastContainer } from "react-bootstrap";

const toastStyle = {
  backgroundColor: "#161823",
  color: "#f4f4f8",
  border: "2px solid #A7C7E7",
};

export default function AuthToast({ show, message, title = "Login", onClose }) {
  return (
    <ToastContainer
      position="top-center"
      className="p-3"
      style={{ zIndex: 3000 }}
    >
      <Toast show={show} onClose={onClose} delay={4000} autohide bg="dark">
        <Toast.Header closeButton style={toastStyle}>
          <strong className="me-auto" style={{ color: "#A7C7E7" }}>
            {title}
          </strong>
        </Toast.Header>
        <Toast.Body style={toastStyle}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
