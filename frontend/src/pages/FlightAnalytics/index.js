import { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import FlightChart from '../../components/FlightChart';
import FlightSelectionModal from '../../components/FlightSelectionModal';
import useIsVisible from '../../hooks/useIsVisible';
import useFlightRecordStorage from './useFlightRecordStorage';

function FlightAnalytics() {
  const [
    flightData,
    flightRecords,
    isLoading,
    refreshFlightRecords,
    selectFlightData,
  ] = useFlightRecordStorage();

  const [
    isModalVisible,
    showModal,
    hideModal,
  ] = useIsVisible(false);

  // Fetch flight records on first component render
  useEffect(() => {
    refreshFlightRecords();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <FlightChart flightData={flightData} />
      <FlightSelectionModal
        isLoading={isLoading}
        isVisible={isModalVisible}
        flightRecords={flightRecords}
        handleRecordOpening={selectFlightData}
        handleModalClose={hideModal}
      />
      <Button onClick={showModal}>Select flight</Button>
    </>
  );
}

export default FlightAnalytics;
