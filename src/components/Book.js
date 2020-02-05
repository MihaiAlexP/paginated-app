import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Book = (props) => {
  const {
    id,
    bookTitle,
    bookAuthor = [],
    bookPages,
    bookPublicationCity,
    bookPublicationCountry,
    bookPublicationYear,
  } = props;

  return (
    <ListGroup.Item key={id}>
      <h4>{bookTitle}</h4>
      <p>
        {bookPages} pages, by {bookAuthor.join(', ')}
        <br />
        {bookPublicationCity}, {bookPublicationCountry}, {bookPublicationYear}
      </p>
    </ListGroup.Item>
  );
}

export default Book;
