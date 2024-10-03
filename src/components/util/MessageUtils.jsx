import { Alert, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

export function ConfirmationModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      style={{ textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {props.decision === "success" && (
        <Modal.Body>
          <span>Woohoo! That worked!</span>
          <div style={{ fontSize: 100 }}>🎉</div>
          <Button variant="outline-primary" onClick={props.onClose}>
            Sounds good 👍
          </Button>
        </Modal.Body>
      )}
      {props.decision === "error" && (
        <Modal.Body>
          <span>Something went wrong. Please try again later.</span>
          <div style={{ fontSize: 100 }}>💔</div>
          <Button variant="outline-primary" onClick={props.onClose}>
            Ok
          </Button>
        </Modal.Body>
      )}
    </Modal>
  );
}
ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  decision: PropTypes.string,
  onClose: PropTypes.func
};

export function FatalError() {
  return (
    <Alert variant="danger" dismissible>
      <Alert.Heading>Something went wrong</Alert.Heading>
      <p>We're not sure what happened, try again in a little bit</p>
    </Alert>
  );
}
