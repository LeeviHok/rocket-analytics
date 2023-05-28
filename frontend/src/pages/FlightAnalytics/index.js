import { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import AlertDanger from '../../components/AlertDanger';
import FlightChart from '../../components/FlightChart';
import FlightCreationModal from '../../components/FlightCreationModal';
import FlightSelectionModal from '../../components/FlightSelectionModal';
import useIsVisible from '../../hooks/useIsVisible';
import useFlightRecords from './useFlightRecords';

function FlightAnalytics() {
  const [
    flightData,
    flightRecords,
    createFlightRecord,
    refreshFlightRecords,
    selectFlightData,
  ] = useFlightRecords();

  const [
    isSelectionModalVisible,
    showSelectionModal,
    hideSelectionModal,
  ] = useIsVisible(false);

  const [
    isCreationModalVisible,
    showCreationModal,
    hideCreationModal,
  ] = useIsVisible(false);

  // Fetch flight records on first component render
  useEffect(() => {
    refreshFlightRecords();
    // eslint-disable-next-line
  }, []);

  const flightDataLoadingErrorAlert = (
    <AlertDanger>
      Something went wrong while loading flight data. Try again later.
    </AlertDanger>
  );

  return (
    <>
      {flightData.error && flightDataLoadingErrorAlert}
      <FlightChart flightData={flightData.data} />
      <FlightSelectionModal
        isVisible={isSelectionModalVisible}
        flightData={flightData}
        flightRecords={flightRecords}
        selectFlightData={selectFlightData}
        handleModalClose={hideSelectionModal}
      />
      <FlightCreationModal
        isVisible={isCreationModalVisible}
        handleFlightCreation={createFlightRecord}
        handleModalClose={hideCreationModal}
      />
      <Button className="me-3" onClick={showSelectionModal}>Select flight</Button>
      <Button onClick={showCreationModal}>Create flight</Button>
    </>
  );
}

export default FlightAnalytics;
