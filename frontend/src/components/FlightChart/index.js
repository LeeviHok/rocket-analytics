import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import options from './chart_options';
import plugins from './chart_plugins';

function FlightChart({flightData}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  // Custom positioner to make the tooltip follow the cursor
  Tooltip.positioners.cursor = function(elements, eventPosition) {
    return eventPosition;
  }

  // Create new y-axis for each dataset. This way datasets with large values
  // won't flatten datasets with smaller values.
  const chartData = {
    labels: flightData.time,
    datasets: [
      {
        label: 'Altitude AGL',
        yAxisID: 'altitude_agl',
        data: flightData.altitude_agl,
        backgroundColor: 'green',
        borderColor: 'green',
        hidden: false,
      },
      {
        label: 'Altitude ASL',
        yAxisID: 'altitude_asl',
        data: flightData.altitude_asl,
        backgroundColor: 'brown',
        borderColor: 'brown',
        hidden: true,
      },
      {
        label: 'Axial acceleration',
        yAxisID: 'accel_axial',
        data: flightData.accel_axial,
        backgroundColor: 'purple',
        borderColor: 'purple',
        hidden: false,
      },
      {
        label: 'Barometric pressure',
        yAxisID: 'pressure',
        data: flightData.pressure,
        backgroundColor: 'hotpink',
        borderColor: 'hotpink',
        hidden: true,
      },
      {
        label: 'Current',
        yAxisID: 'current',
        data: flightData.current,
        backgroundColor: 'orange',
        borderColor: 'orange',
        hidden: true,
      },
      {
        label: 'Lateral acceleration',
        yAxisID: 'accel_lateral',
        data: flightData.accel_lateral,
        backgroundColor: 'gold',
        borderColor: 'gold',
        hidden: true,
      },
      {
        label: 'Temperature',
        yAxisID: 'temperature',
        data: flightData.temperature,
        backgroundColor: 'blue',
        borderColor: 'blue',
        hidden: true,
      },
      {
        label: 'Velocity',
        yAxisID: 'velocity',
        data: flightData.velocity,
        backgroundColor: 'cyan',
        borderColor: 'cyan',
        hidden: true,
      },
      {
        label: 'Battery voltage',
        yAxisID: 'voltage_battery',
        data: flightData.voltage_battery,
        backgroundColor: 'lawngreen',
        borderColor: 'lawngreen',
        hidden: true,
      },
      {
        label: 'Apogee pyro channel voltage',
        yAxisID: 'voltage_pyro_apogee',
        data: flightData.voltage_pyro_apogee,
        backgroundColor: 'black',
        borderColor: 'black',
        hidden: true,
      },
      {
        label: 'Main pyro channel voltage',
        yAxisID: 'voltage_pyro_main',
        data: flightData.voltage_pyro_main,
        backgroundColor: 'grey',
        borderColor: 'grey',
        hidden: true,
      },
      {
        label: '3rd pyro channel voltage',
        yAxisID: 'voltage_pyro_3',
        data: flightData.voltage_pyro_3,
        backgroundColor: 'olive',
        borderColor: 'olive',
        hidden: true,
      },
      {
        label: '4th pyro channel voltage',
        yAxisID: 'voltage_pyro_4',
        data: flightData.voltage_pyro_4,
        backgroundColor: 'teal',
        borderColor: 'teal',
        hidden: true,
      },
    ],
  }

  return <Line data={chartData} options={options} plugins={plugins} />;
}

export default FlightChart;
