import Papa from 'papaparse';

function transposeFlightData(rows) {
  // Define subset of data which will be transposed from the rows. This will
  // also map the CSV file headers to the corresponding API fields.
  const datasets = [
    {
      apiField: 'accel_axial',
      csvHeader: 'Axial Accel (Gs)',
    },
    {
      apiField: 'pressure',
      csvHeader: 'Baro (Atm)',
    },
    {
      apiField: 'current',
      csvHeader: 'Current Draw (A)',
    },
    {
      apiField: 'accel_lateral',
      csvHeader: 'Lateral Accel (Gs)',
    },
    {
      apiField: 'temperature',
      csvHeader: 'Temperature (F)',
    },
    {
      apiField: 'time',
      csvHeader: 'Time',
    },
    {
      apiField: 'velocity',
      csvHeader: 'Velocity (Accel-Ft/Sec)',
    },
    {
      apiField: 'voltage_battery',
      csvHeader: 'Volts Battery (V)',
    },
    {
      apiField: 'voltage_pyro_3',
      csvHeader: 'Volts Pyro 3rd (V)',
    },
    {
      apiField: 'voltage_pyro_4',
      csvHeader: 'Volts Pyro 4th (V)',
    },
    {
      apiField: 'voltage_pyro_apogee',
      csvHeader: 'Volts Pyro Apogee (V)',
    },
    {
      apiField: 'voltage_pyro_main',
      csvHeader: 'Volts Pyro Main (V)',
    },
  ];
  const csvHeaders = datasets.map(dataset => dataset['csvHeader']);
  const apiFields = datasets.map(dataset => dataset['apiField']);
  
  const columns = csvHeaders.map(header => (
    rows.map(row => row[header])
  ));

  return columns.reduce((prev, column, i) => ({
    ...prev,
    [apiFields[i]]: column,
  }), {});
}

async function parseCsv(csv) {
  return new Promise(resolve => {
    Papa.parse(csv, {
      complete: results => resolve(results.data),
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
    });
  });
}

async function parseFlightData(flightDataCsv) {
  const flightDataRows = await parseCsv(flightDataCsv);
  return transposeFlightData(flightDataRows);
}

export default parseFlightData;
