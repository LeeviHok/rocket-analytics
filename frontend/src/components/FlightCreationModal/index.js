import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import AlertDanger from '../../components/AlertDanger';
import FlightCreationForm from '../FlightCreationForm';
import SubmitButton from '../FlightCreationForm/SubmitButton';

function FlightCreationModal({
  isVisible, handleFlightCreation, handleModalClose
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    setDisplayError(false);
  }, [isVisible]);

  function flightCreationHandler(...params) {
    setIsCreating(true);
    setDisplayError(false);
    handleFlightCreation(...params).then(() => {
      handleModalClose();
    }).catch(() => {
      setDisplayError(true);
    }).finally(() => {
      setIsCreating(false);
    });
  }

  const flightCreationErrorAlert = (
    <AlertDanger>
      Failed to create flight record.
    </AlertDanger>
  );

  return (
    <Modal size="lg" show={isVisible} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create flight record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {displayError && flightCreationErrorAlert}
        <FlightCreationForm handleFlightCreation={flightCreationHandler} />
      </Modal.Body>

      <Modal.Footer>
        <SubmitButton isSubmitting={isCreating} onClick={() => setDisplayError(false)}>
          Create
        </SubmitButton>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FlightCreationModal;
