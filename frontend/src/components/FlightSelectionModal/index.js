import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import FlightSelectionTable from '../FlightSelectionTable';
import LoadingButton from '../LoadingButton';

function FlightSelectionModal({
  isLoading, isVisible, flightRecords, selectFlightData, handleModalClose
}) {
  const [selectedFlightRecordId, setSelectedFlightRecordId] = useState(null);
  const [openedFlightRecordId, setOpenedFlightRecordId] = useState(null);

  // Show currently open flight record as selected when modal is opened
  useEffect(() => {
    if (isVisible) {
      setSelectedFlightRecordId(openedFlightRecordId);
    }
  }, [isVisible, openedFlightRecordId]);

  // Open new flight record and close modal once data is ready
  function handleFlightRecordOpening() {
    setOpenedFlightRecordId(selectedFlightRecordId);
    selectFlightData(selectedFlightRecordId).then(() => {
      handleModalClose();
    });
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
