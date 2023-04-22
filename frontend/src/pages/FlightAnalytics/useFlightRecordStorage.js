import { useRef, useState } from 'react';

function useFlightRecordStorage() {
  // Initially selected flight data before any actual data is selected
  const initialData = {
    time: (Array.from(Array(300).keys()).map(n => n/10)),
    accel_axial: [],
    accel_lateral: [],
    pressure: [],
    current: [],
    temperature: [],
    velocity: [],
    voltage_battery: [],
    voltage_pyro_apogee: [],
    voltage_pyro_main: [],
    voltage_pyro_3: [],
    voltage_pyro_4: [],
    altitude_asl: [],
    altitude_agl: [],
  }
  const [flightRecords, setFlightRecords] = useState({});
  const [selectedFlightData, setSelectedFlightData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const callbackRef = useRef(null);
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

  /**
   * Selects flight data which will be displayed in flight chart.
   * @param {Number} flightRecordId - Flight record ID which data to select
   * @param {Function} [callback] - Callback to run after data is retrieved
   */
  function selectFlightData(flightRecordId, callback) {
    getFlightData(flightRecordId).then(flightData => {
      setSelectedFlightData(flightData);
      setIsLoading(false);
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = null;
      }
    });
    callbackRef.current = callback;
    setIsLoading(true);
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

  return [
    selectedFlightData,
    flightRecords,
    isLoading,
    refreshFlightRecords,
    selectFlightData,
  ];
}

export default useFlightRecordStorage;
