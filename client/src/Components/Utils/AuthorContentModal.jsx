import { Modal, Button } from "react-bootstrap";
import { AUTHOR_CONTENT_MESSAGE } from "./authorContent";

export default function AuthorContentModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#161823",
          borderBottom: "2px solid #A7C7E7",
        }}
      >
        <Modal.Title style={{ color: "#A7C7E7" }}>Not allowed</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#0e0f14", color: "#f4f4f8" }}>
        {AUTHOR_CONTENT_MESSAGE}
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: "#161823", borderTop: "2px solid #A7C7E7" }}
      >
        <Button
          variant="light"
          onClick={onHide}
          style={{
            border: "2px solid #A7C7E7",
            backgroundColor: "#161823",
            color: "#A7C7E7",
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
