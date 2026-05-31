import { Modal, Button } from 'react-bootstrap';

export default function LoginRequiredModal({ show, onHide, onLogin }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#161823', borderBottom: '2px solid #A7C7E7' }}>
        <Modal.Title style={{ color: '#A7C7E7' }}>Login required</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#0e0f14', color: '#f4f4f8' }}>
        You need to be logged in to do this. Please log in to continue.
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#161823', borderTop: '2px solid #A7C7E7' }}>
        <Button
          variant="light"
          onClick={onHide}
          style={{ border: '2px solid #A7C7E7', backgroundColor: 'transparent', color: '#A7C7E7' }}
        >
          Cancel
        </Button>
        <Button
          variant="light"
          onClick={onLogin}
          style={{ border: '2px solid #A7C7E7', backgroundColor: '#161823', color: '#A7C7E7' }}
        >
          Log in
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function isAuthRequiredError(errorOrResponse) {
  const data = errorOrResponse?.response?.data ?? errorOrResponse?.data ?? errorOrResponse;
  return (
    data?.success === false &&
    data?.message === 'You need to be authenticated to access this page!'
  );
}
