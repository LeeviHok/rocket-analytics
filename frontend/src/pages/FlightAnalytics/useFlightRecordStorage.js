import { useRef, useState } from 'react';

function useFlightRecordStorage() {
  const [flightRecords, setFlightRecords] = useState({});
  const flightData = useRef({});

  // Fetches and updates flight records
  async function refreshFlightRecords() {
    const records = await fetchData('/api/records');
    const recordDict = records.reduce((prev, record) => ({
      ...prev,
      [record.id]: {
        id: record.id,
        rocketName: record.rocket_name,
        flightDatetime: new Date(record.flight_datetime),
      }
    }), {});
    setFlightRecords(recordDict);
  }

  // Fetches flight data and stores it locally. Local copy is returned if
  // flight data is fetched already.
  async function getFlightData(flightRecordId) {
    if (!flightDataExists(flightRecordId)) {
      const data = await fetchData(`/api/records/${flightRecordId}/data`);
      flightData.current[flightRecordId] = data;
    }

    return flightData.current[flightRecordId];
  }

  async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Check if flight data is already fetched and stored locally
  function flightDataExists(flightRecordId) {
    return Boolean(flightData.current[flightRecordId]);
  }

  return [flightRecords, getFlightData, refreshFlightRecords];
}

export default useFlightRecordStorage;
