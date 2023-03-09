/**
 * Chart.js hides active elements (tooltip, data points, etc) when the cursor
 * leaves the canvas. But since the legend area is within the canvas, active
 * elements will remain visible when cursor is within that area. If the tooltip
 * is configured to follow the cursor (like it is in this case), the tooltip
 * will follow the cursor to the legend area, but the values will become stale.
 * This feels odd behaviour, and this plugin will hide all active elements when
 * the cursor is moved to the legend area.
 */

function hideTooltip(chart) {
  const eventPosition = {x: 0, y: 0};
  chart.tooltip.setActiveElements([], {eventPosition});
}

function hideDataPoints(chart) {
  chart.setActiveElements([]);
}

const plugins = [{
  id: 'activeElementHider',
  afterEvent(chart, args) {
    const e = args.event;
    if (e.type === 'mousemove') {
      const {
        bottom,
        top,
        right,
        left
      } = chart.chartArea;
      if (e.x <= left || e.x >= right || e.y >= bottom || e.y <= top) {
        hideTooltip(chart);
        hideDataPoints(chart);
        args.changed = true;
      }
    }
  }
}];

export default plugins;
