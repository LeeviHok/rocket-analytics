import Button from 'react-bootstrap/Button';

import FlightChart from '../../components/FlightChart';
import FlightSelectionModal from '../../components/FlightSelectionModal';
import useIsVisible from '../../hooks/useIsVisible';
import useFlightDataSelector from './useFlightDataSelector';
import useFlightRecordStorage from './useFlightRecordStorage';

function FlightAnalytics() {
  const [
    flightRecords,
    getFlightData,
  ] = useFlightRecordStorage();

  const [
    flightData,
    isLoading,
    selectFlightData,
  ] = useFlightDataSelector(getFlightData);

  const [
    isModalVisible,
    showModal,
    hideModal,
  ] = useIsVisible(false);

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
