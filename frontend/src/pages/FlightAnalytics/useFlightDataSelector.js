import { useRef, useState } from 'react';

function useFlightDataSelector(getFlightData) {
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
  const [selectedFlightData, setSelectedFlightData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const callbackRef = useRef(null);

  /**
   * Selects flight data which will be displayed in flight chart.
   * @param {Number} flightRecordId - Flight record ID which data to select
   * @param {Function} [callback] - Callback to run after data is retrieved
   */
  function selectFlightData(flightRecordId, callback) {
    getFlightData(flightRecordId).then(flightData => {
      setSelectedFlightData(flightData);
      setIsLoading(false);
      if(callbackRef.current) {
        callbackRef.current();
        callbackRef.current = null;
      }
    });
    callbackRef.current = callback;
    setIsLoading(true);
  }

  return [
    selectedFlightData,
    isLoading,
    selectFlightData,
  ];
}

export default useFlightDataSelector;
