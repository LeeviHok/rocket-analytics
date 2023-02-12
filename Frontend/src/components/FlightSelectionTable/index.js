import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

function FlightSelectionTable({
  flightRecords,
  selectedFlightRecordId,
  handleSelect,
}) {

  return (
    <Table>
      <thead>
        <tr>
          <th>Rocket</th>
          <th>Flight date</th>
          <th>Select</th>
        </tr>
      </thead>

      <tbody>
        {Object.keys(flightRecords).map(id => (
          <tr key={id}>
            <td>{flightRecords[id].rocketName}</td>

            <td>{
              flightRecords[id].flightDatetime.toLocaleDateString(
                'fi-FI', {timeZone: 'Europe/Helsinki'}
              )
            }</td>

            <td>
              <Form.Check
                type="radio"
                id={id}
                checked={id === selectedFlightRecordId ? true : false}
                onChange={() => (handleSelect(id))}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default FlightSelectionTable;
