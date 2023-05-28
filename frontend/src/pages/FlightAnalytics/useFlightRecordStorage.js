import { useRef, useState } from 'react';

import { 
  fetchData,
  isClientError,
  isNetworkError,
  isServerError,
 } from '../../helpers/fetchData';
 import flightDataParser from './flightDataParser';

function useFlightRecordStorage() {
  const [flightData, setFlightData] = useState({
    error: null,
    isLoading: false,
    data: null,
  });
  const [flightRecords, setFlightRecords] = useState({
    error: null,
    isLoading: true,
    records: {},
  });
  const flightDataStore = useRef({});

  async function createFlightRecord(metadata, flightDataCsv) {
    const flightData = await flightDataParser(flightDataCsv);
    const payload = {
      rocket_name: metadata.rocketName,
      flight_datetime: metadata.flightDatetime.toISOString(),
      ...flightData,
    };

    try {
      var record = await fetchData('/api/flights', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
    }
    catch (e) {
      if (isClientError(e) || isNetworkError(e) || isServerError(e)) {
        throw new Error('Failed to create flight record');
      }
      throw e;
    }

    await refreshFlightRecords();
    await selectFlightData(record.id);
  }

  // Fetches and updates flight records
  async function refreshFlightRecords() {
    try {
      setFlightRecords({
        error: null,
        isLoading: true,
        records: flightRecords.records,
      });

      const records = await fetchData('/api/flights');
      const recordDict = records.reduce((prev, record) => ({
        ...prev,
        [record.id]: {
          id: record.id,
          rocketName: record.rocket_name,
          flightDatetime: new Date(record.flight_datetime),
        }
      }), {});

      setFlightRecords({
        error: null,
        isLoading: false,
        records: recordDict,
      });
    }
    catch (e) {
      if (isClientError(e) || isNetworkError(e) || isServerError(e)) {
        setFlightRecords({
          error: e,
          isLoading: false,
          records: {},
        });
      }
      throw e;
    }
  }

  // Fetch requested data, update the state, and store the data locally. If
  // local data exists, it is not fetched again.
  async function selectFlightData(flightRecordId) {
    try {
      setFlightData({
        error: null,
        isLoading: true,
        data: flightData.data,
      });

      if (!flightDataExists(flightRecordId)) {
        const data = await fetchData(`/api/flights/${flightRecordId}`);
        flightDataStore.current[flightRecordId] = data;
      }

      setFlightData({
        error: null,
        isLoading: false,
        data: flightDataStore.current[flightRecordId],
      });
    }
    catch (e) {
      if (isClientError(e) || isNetworkError(e) || isServerError(e)) {
        setFlightData({
          error: e,
          isLoading: false,
          data: null,
        });
      }
      throw e;
    }
  }

  // Check if flight data is already fetched and stored locally
  function flightDataExists(flightRecordId) {
    return Boolean(flightDataStore.current[flightRecordId]);
  }

  return [
    flightData,
    flightRecords,
    createFlightRecord,
    refreshFlightRecords,
    selectFlightData,
  ];
}

export default useFlightRecordStorage;
