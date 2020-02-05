import React from 'react';
import { fetchData } from '../utils/index';
import { Container, Row, Col, Spinner, Alert, Dropdown } from 'react-bootstrap';

import Filters from './Filters';
import BookList from './BookList';
import PaginationNav from './PaginationNav';

class App extends React.Component {
  state = {
    loading: false,
    error: '',
    count: 0,
    itemsPerPage: 20,
    active: 1,
    filters: [],
  }

  componentDidMount() {
    this.updateStateFromURLParams();
  }

  componentDidUpdate(prevProps, prevState) {
    const { active, itemsPerPage } = this.state;
    
    // check if filters were updated
    const isFilterUpdated = this.isFilterUpdated(prevState.filters);

    // update url params if active page or filters changed
    // fetch books with new params
    if (prevState.active !== active ||
      isFilterUpdated ||
      prevState.itemsPerPage !== itemsPerPage
    ) {
      this.updateURLParams();

      const { itemsPerPage, filters } = this.state;
      const requestData = {
        page: active,
        itemsPerPage,
        filters: filters.length ? [{type: 'all', values: filters}] : [],
      };
      this.getBooks(requestData);
    }
  }

  isFilterUpdated(prevFilters) {
    const { filters } = this.state;
    
    let isFilterUpdated = false;
    if (prevFilters.length !== filters.length) {
      isFilterUpdated = true;
    } else {
      filters.forEach(item => {
        if (prevFilters.indexOf(item) === -1) {
          isFilterUpdated = true;
        }
      });
    }

    return isFilterUpdated;
  }

  getBooks(requestData) {
    this.setState({ loading: true });
    fetchData(requestData)
      .then((data) => {
        const books = data.books.map(item => {
          item.bookAuthor = item.book_author;
          item.bookTitle = item.book_title;
          item.bookPublicationYear = item.book_publication_year;
          item.bookPublicationCountry = item.book_publication_country;
          item.bookPublicationCity = item.book_publication_city;
          item.bookPages = item.book_pages;

          return item;
        });
        this.setState({ books: books, count: data.count, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }

  updateStateFromURLParams() {
    const query = new URLSearchParams(window.location.search);
    const decodedFilters = query.get('filters') ? decodeURIComponent(query.get('filters')) : null;
    const active = JSON.parse(query.get('page')) || 1;
    const filters = !!decodedFilters ? decodedFilters.split(',') : [];
    const isFilterUpdated = this.isFilterUpdated(filters);

    // only update state if we need to
    if (this.state.active !== active || isFilterUpdated) {
      this.setState({
        active,
        filters,
      });
    } else if (this.state.active === 1) {
      const requestData = {
        page: this.state.active,
        itemsPerPage: this.state.itemsPerPage,
        filters: this.state.filters.length ? [{type: 'all', values: this.state.filters}] : [],
      };
      this.getBooks(requestData);
    }
  }

  updateURLParams() {
    const { active, filters } = this.state;
    let currentUrlParams = new URLSearchParams(window.location.search);

    currentUrlParams.set('page', active);
    currentUrlParams.set('filters', encodeURIComponent(filters.join(',')));

    const url = window.location.pathname + "?" + currentUrlParams.toString();
    window.history.replaceState({url: url}, null, url);
  }

  handlePaginationClick(value) {
    let page = value;
    
    if (page === 'prev') {
      page = this.state.active - 1;
    }

    if (page === 'next') {
      page = this.state.active + 1;
    }

    if (this.state.active !== page) {
      this.setState({ active: page });
    }
  }

  handleSearchClick(ev) {
    const searchTerm = ev.target.parentNode.parentNode.querySelector('input').value;

    if (this.state.filters.indexOf(searchTerm) === -1) {
      this.setState({ active: 1, filters: [searchTerm] });
    }
  }

  handlePerPageChange(value) {
    if (this.state.itemsPerPage !== value) {
      this.setState({ itemsPerPage: value });
    }
  }

  render() {
    const { loading, error, books, count, itemsPerPage, active, filters } = this.state;

    return (
      <Container className="library-wrapper">
        <Row className="justify-content-md-center">
          <Col>
            <h1>Book library</h1>
            <Filters onClick={(ev) => this.handleSearchClick(ev)} filters={filters} />
            {!loading && !error && count === 0 &&
              <Alert variant="info">
                No books found matching the search.
              </Alert>
            }
            {count > 0 &&
              <Row className="justify-content-md-center">
                <Col sm={12} md={6} lg={6}>
                  <PaginationNav
                    count={count}
                    itemsPerPage={itemsPerPage}
                    active={active}
                    onClick={(value) => this.handlePaginationClick(value)}
                  />
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Dropdown className="navigation-dropdown">
                    <Dropdown.Toggle variant="secondary" size="sm" id="per-page">
                      Books per page
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(5)}>5</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(10)}>10</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(20)}>20</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(50)}>50</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            }
            {loading && !error &&
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            }
            {!loading && !error && count > 0 &&
              <BookList books={books} />
            }
            {count > 0 &&
              <Row className="justify-content-md-center">
                <Col sm={12} md={6} lg={6}>
                  <PaginationNav
                    count={count}
                    itemsPerPage={itemsPerPage}
                    active={active}
                    onClick={(value) => this.handlePaginationClick(value)}
                  />
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Dropdown className="navigation-dropdown">
                    <Dropdown.Toggle variant="secondary" size="sm" id="per-page">
                      Books per page
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(5)}>5</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(10)}>10</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(20)}>20</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handlePerPageChange(50)}>50</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            }
            {!loading && error &&
              <Alert variant="danger">
                {error}
              </Alert>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;