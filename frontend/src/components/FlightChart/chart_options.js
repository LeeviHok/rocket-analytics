const options = {
  animation: false, // Disable animation to improve performance
  responsive: true, // Allow chart to adjust when resizing
  datasets: {
    line: {
      pointRadius: 0, // Don't draw points to improve performance
      borderWidth: 1, // Draw thinner line to see small details better
    }
  },
  interaction: {
    mode: 'nearest',  // Show tooltip always when mouse is in chart area
    axis: 'x',        //
    intersect: false, //
  },
  plugins: {
    tooltip: {
      position: 'cursor', // Show tooltip always at the cursor
    },
    legend: {
      position: 'top',    // Position dataset legend to top
    },
    title: {
      display: true,       // Show title for the chart
      text: 'Flight data', // Chart title
    },
  },
  scales: {
    x: {
      title: {
        display: true,    // Show title for the x-axis
        text: 'Time (s)', // X-axis title
      },
      ticks: {
        autoSkip: true,      // Skip some of the x-axis labels
        autoSkipPadding: 20, // Add spacing between x-axis labels
        callback: function(_, index) {
          const value = this.getLabelForValue(index); // Show x-axis labels
          return parseFloat(value).toFixed(2);        // with 2 decimal places
        },
      },
    },
    // Each dataset has its own y-axis. Only one axis is shown and ticks are
    // hidden to make the UI clear. Tooltip is used to show the values instead
    // of ticks.
    altitude_agl: {
      position: 'left',
      ticks: {display: false},
    },
    altitude_asl: {
      position: 'left',
      display: false,
    },
    accel_axial: {
      position: 'left',
      display: false,
    },
    pressure: {
      position: 'left',
      display: false,
    },
    current: {
      position: 'left',
      display: false,
    },
    accel_lateral: {
      position: 'left',
      display: false,
    },
    temperature: {
      position: 'left',
      display: false,
    },
    velocity: {
      position: 'left',
      display: false,
    },
    voltage_battery: {
      position: 'left',
      display: false,
    },
    voltage_pyro_apogee: {
      position: 'left',
      display: false,
    },
    voltage_pyro_main: {
      position: 'left',
      display: false,
    },
    voltage_pyro_3: {
      position: 'left',
      display: false,
    },
    voltage_pyro_4: {
      position: 'left',
      display: false,
    },
  },
};

export default options;
