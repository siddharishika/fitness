import { Modal, Button } from "react-bootstrap";

const btnStyle = {
  border: "2px solid #A7C7E7",
  backgroundColor: "#161823",
  color: "#A7C7E7",
};

const listStyle = {
  margin: "16px 0 0",
  paddingLeft: "20px",
  color: "#f4f4f8",
};

export default function DeleteAccountModal({
  show,
  onHide,
  onConfirm,
  loading = false,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#161823", borderBottom: "2px solid #A7C7E7" }}
      >
        <Modal.Title style={{ color: "#A7C7E7" }}>Delete account</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#0e0f14", color: "#f4f4f8" }}>
        <p style={{ marginBottom: 0 }}>
          Deleting your account is permanent and cannot be undone. The following
          data will be removed:
        </p>
        <ul style={listStyle}>
          <li>Your profile and login credentials</li>
          <li>All workout videos, programs, and recipes you created</li>
          <li>All comments and reviews you posted</li>
          <li>Your ratings on other content</li>
          <li>Your liked content and workout history</li>
        </ul>
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: "#161823", borderTop: "2px solid #A7C7E7" }}
      >
        <Button variant="light" onClick={onHide} disabled={loading} style={btnStyle}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
          style={{ border: "2px solid #A7C7E7" }}
        >
          {loading ? "Deleting…" : "Delete account"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
