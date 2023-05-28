import { useState } from 'react';

import Form from 'react-bootstrap/Form';

function FlightCreationForm({handleFlightCreation}) {
  const [formFields, setFormFields] = useState({
    rocketName: '',
    flightDatetime: '',
    flightDataCsv: null,
  });

  function handleSubmit(e) {
    e.preventDefault();

    const flightMetadata = {
      rocketName: formFields.rocketName,
      flightDatetime: new Date(formFields.flightDatetime),
    };

    handleFlightCreation(flightMetadata, formFields.flightDataCsv);
  }

  function updateField(e) {
    const value = e.target.files ? e.target.files[0] : e.target.value;
    setFormFields({
      ...formFields,
      [e.target.name]: value,
    });
  }

  return (
    <Form id="flight-creation-form" onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Rocket name</Form.Label>
        <Form.Control
          name="rocketName"
          placeholder="Rocket name"
          type="text"
          value={formFields.rocketName}
          onChange={updateField}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Flight date</Form.Label>
        <Form.Control
          name="flightDatetime"
          type="datetime-local"
          onChange={updateField}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Flight data (.csv)</Form.Label>
        <Form.Control
          accept=".csv"
          name="flightDataCsv"
          type="file"
          onChange={updateField}
          required
        />
      </Form.Group>
    </Form>
  );
}

export default FlightCreationForm;
