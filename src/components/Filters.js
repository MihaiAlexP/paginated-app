import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap'; 

const Filters = (props) => {
  const filters = props.filters;
  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Search for..."
        aria-label="Search for..."
        aria-describedby="basic-addon2"
        defaultValue={filters}
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={props.onClick}>Go</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

export default Filters;
