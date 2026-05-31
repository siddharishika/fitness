import { Modal, Button } from 'react-bootstrap';

const MESSAGES = {
  video: 'You have already rated this video.',
  program: 'You have already rated this program.',
  recipe: 'You have already rated this recipe.',
};

export default function AlreadyRatedModal({ show, onHide, contentType = 'video' }) {
  const message = MESSAGES[contentType] || MESSAGES.video;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#161823', borderBottom: '2px solid #A7C7E7' }}>
        <Modal.Title style={{ color: '#A7C7E7' }}>Already rated</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#0e0f14', color: '#f4f4f8' }}>
        {message}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#161823', borderTop: '2px solid #A7C7E7' }}>
        <Button
          variant="light"
          onClick={onHide}
          style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823', color: '#A7C7E7' }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function isAlreadyRatedError(error) {
  const data = error?.response?.data;
  const msg = data?.msg || data?.message || "";
  return (
    error?.response?.status === 400 &&
    typeof msg === "string" &&
    msg.toLowerCase().includes("already rated")
  );
}
