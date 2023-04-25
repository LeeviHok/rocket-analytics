import Form from 'react-bootstrap/Form';
import Placeholder from 'react-bootstrap/Placeholder';
import Table from 'react-bootstrap/Table';

function SelectionRow({flightRecord, selectedFlightRecordId, handleSelect}) {
  return (
    <tr>
      <td>{flightRecord.rocketName}</td>

      <td>{
        flightRecord.flightDatetime.toLocaleDateString(
          'fi-FI', {timeZone: 'Europe/Helsinki'}
        )
      }</td>

      <td>
        <Form.Check
          type="radio"
          id={flightRecord.id}
          checked={flightRecord.id === selectedFlightRecordId ? true : false}
          onChange={() => (handleSelect(flightRecord.id))}
        />
      </td>
    </tr>
  );
}

function SelectionRowPlaceholder() {
  return (
    <tr>
      <td>
        <Placeholder as="span" animation="glow">
          <Placeholder xs={10} />
        </Placeholder>
      </td>

      <td>
        <Placeholder as="span" animation="glow">
          <Placeholder xs={10} />
        </Placeholder>
      </td>

      <td>
        <Form.Check type="radio" checked={false} disabled />
      </td>
    </tr>
  );
}

function FlightSelectionTable({
  flightRecords,
  isLoading,
  selectedFlightRecordId,
  handleSelect,
}) {
  function renderTableBody() {
    if (isLoading) {
      return (
        [...Array(3)].map((_, i) => (
          <SelectionRowPlaceholder key={i} />
        ))
      );
    }
    return (
      Object.keys(flightRecords).map(id => (
        <SelectionRow
          key={id}
          flightRecord={flightRecords[id]}
          selectedFlightRecordId={selectedFlightRecordId}
          handleSelect={handleSelect}
        />
      ))
    );
  }

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
        {renderTableBody()}
      </tbody>
    </Table>
  );
}

export default FlightSelectionTable;
