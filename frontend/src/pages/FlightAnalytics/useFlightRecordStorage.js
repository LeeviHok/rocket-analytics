import { useEffect, useRef } from 'react';

function useFlightRecordStorage() {
  const flightRecords = useRef({});
  const flightData = useRef({});

  // Fetch flight records on first component render
  useEffect(() => {
    (async () => {
      const records = await fetchData('/api/records');
      flightRecords.current = records.reduce((prev, record) => {
        prev[record.id] = {
          id: record.id,
          rocketName: record.rocket_name,
          flightDatetime: new Date(record.flight_datetime),
        };
        return prev;
      }, {});
    })();
  }, []);

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

  return [flightRecords.current, getFlightData];
}

export default useFlightRecordStorage;
