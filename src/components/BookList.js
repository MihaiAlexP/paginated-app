import React from 'react';
import { ListGroup } from 'react-bootstrap';

import Book from './Book';

const BookList = (props) => {
  const { books = [] } = props;

  return (
    <ListGroup>
      {books.map(book => <Book key={book.id} {...book} />)}
    </ListGroup>
  );
}

export default BookList;
