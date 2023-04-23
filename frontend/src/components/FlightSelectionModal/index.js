import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import AlertDanger from '../AlertDanger';
import FlightSelectionTable from '../FlightSelectionTable';
import LoadingButton from '../LoadingButton';

function FlightSelectionModal({
  isVisible, flightData, flightRecords, selectFlightData, handleModalClose
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
    selectFlightData(selectedFlightRecordId).finally(() => {
      handleModalClose();
    });
  }

  function renderModalBody() {
    if (flightRecords.error) {
      return loadingErrorAlert;
    }
    return flightSelectionTable;
  }

  const loadingErrorAlert = (
    <AlertDanger>
      Something went wrong while loading flight records. Try again later.
    </AlertDanger>
  );

  const flightSelectionTable = (
    <FlightSelectionTable
      flightRecords={flightRecords.records}
      selectedFlightRecordId={selectedFlightRecordId}
      handleSelect={setSelectedFlightRecordId}
    />
  );

  return (
    <Modal size="lg" show={isVisible} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select flight record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {renderModalBody()}
      </Modal.Body>

      <Modal.Footer>
        <LoadingButton
          isLoading={flightData.isLoading}
          disabled={!selectedFlightRecordId || flightData.isLoading}
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
