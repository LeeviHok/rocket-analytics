import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import FlightSelectionTable from '../FlightSelectionTable';
import LoadingButton from '../LoadingButton';

function FlightSelectionModal({
  isLoading, isVisible, flightRecords, handleRecordOpening, handleModalClose
}) {
  const [selectedFlightRecordId, setSelectedFlightRecordId] = useState(null);
  const [openedFlightRecordId, setOpenedFlightRecordId] = useState(null);

  // Show currently open flight record as selected when modal is opened
  useEffect(() => {
    if (isVisible) {
      setSelectedFlightRecordId(openedFlightRecordId);
    }
  }, [isVisible, openedFlightRecordId]);

  function handleFlightRecordOpening() {
    setOpenedFlightRecordId(selectedFlightRecordId);
    handleRecordOpening(selectedFlightRecordId, handleModalClose);
  }

  return (
    <Modal size="lg" show={isVisible} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select flight record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FlightSelectionTable
          flightRecords={flightRecords}
          selectedFlightRecordId={selectedFlightRecordId}
          handleSelect={setSelectedFlightRecordId}
        />
      </Modal.Body>

      <Modal.Footer>
        <LoadingButton
          isLoading={isLoading}
          disabled={!selectedFlightRecordId || isLoading}
          onClick={handleFlightRecordOpening}
        >
          Open
        </LoadingButton>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FlightSelectionModal;
