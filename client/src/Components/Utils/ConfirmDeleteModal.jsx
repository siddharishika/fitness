import { Modal, Button } from 'react-bootstrap';

const btnStyle = {
  border: '2px solid #A7C7E7',
  backgroundColor: '#161823',
  color: '#A7C7E7',
};

export default function ConfirmDeleteModal({
  show,
  onHide,
  onConfirm,
  itemLabel = 'item',
  itemName,
  loading = false,
}) {
  const label = itemLabel.toLowerCase();
  const message = itemName
    ? `Are you sure you want to delete the ${label} "${itemName}"? This action cannot be undone.`
    : `Are you sure you want to delete this ${label}? This action cannot be undone.`;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#161823', borderBottom: '2px solid #A7C7E7' }}>
        <Modal.Title style={{ color: '#A7C7E7' }}>Confirm deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#0e0f14', color: '#f4f4f8' }}>
        {message}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#161823', borderTop: '2px solid #A7C7E7' }}>
        <Button variant="light" onClick={onHide} disabled={loading} style={btnStyle}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
          style={{ border: '2px solid #A7C7E7' }}
        >
          {loading ? 'Deleting…' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
