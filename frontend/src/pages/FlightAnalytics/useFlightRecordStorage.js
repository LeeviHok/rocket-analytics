import { useRef, useState } from 'react';

function useFlightRecordStorage() {
  // Initially selected flight data before any actual data is selected
  const initialFlightData = {
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
  const [flightData, setFlightData] = useState({
    isLoading: false,
    data: initialFlightData,
  });
  const [flightRecords, setFlightRecords] = useState({
    isLoading: true,
    records: {},
  });
  const flightDataStore = useRef({});

  // Fetches and updates flight records
  async function refreshFlightRecords() {
    setFlightRecords({
      isLoading: true,
      records: flightRecords.records,
    });

    const records = await fetchData('/api/records');
    const recordDict = records.reduce((prev, record) => ({
      ...prev,
      [record.id]: {
        id: record.id,
        rocketName: record.rocket_name,
        flightDatetime: new Date(record.flight_datetime),
      }
    }), {});

    setFlightRecords({
      isLoading: false,
      records: recordDict,
    });
  }

  // Fetch requested data, update the state, and store the data locally. If
  // local data exists, it is not fetched again.
  async function selectFlightData(flightRecordId) {
    setFlightData({
      isLoading: true,
      data: flightData.data,
    });

    if (!flightDataExists(flightRecordId)) {
      const data = await fetchData(`/api/records/${flightRecordId}/data`);
      flightDataStore.current[flightRecordId] = data;
    }

    setFlightData({
      isLoading: false,
      data: flightDataStore.current[flightRecordId],
    });
  }

  async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Check if flight data is already fetched and stored locally
  function flightDataExists(flightRecordId) {
    return Boolean(flightDataStore.current[flightRecordId]);
  }

  return [
    flightData,
    flightRecords,
    refreshFlightRecords,
    selectFlightData,
  ];
}

export default useFlightRecordStorage;
