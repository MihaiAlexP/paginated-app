import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationNav = (props) => {
  const {
    active = 1,
    count = 1,
    itemsPerPage = 20,
    adjacentPageCount = 2,
    onClick,
  } = props;
  const pageCount = Math.ceil(count / itemsPerPage);

  const renderPaginationItems = () => {
    // flag for active items, also used to prevent click callback for active items
    let isACtive = false;

    const items = Array.from({ length: pageCount },(e, i) => {
      isACtive = (i + 1 === active);
      
      if (i === 1 && active - adjacentPageCount > 2) {
        return <Pagination.Ellipsis disabled key="first-ellipsis" />;
      }
      if (i === pageCount - 2  && pageCount - (active + adjacentPageCount) > 1) {
        return <Pagination.Ellipsis disabled key="last-ellipsis" />;
      }

      if ((i >= active - adjacentPageCount - 1 && i <= active + adjacentPageCount - 1) ||
          i === 0 ||
          i === pageCount - 1
      ) {
        return <Pagination.Item
          key={i}
          active={isACtive}
          {...(!isACtive && { onClick: () => onClick(i + 1) })}
        >{i + 1}</Pagination.Item>;
      }

      return null;

    });

    return items;
  }

  return (
    <Pagination>
      <Pagination.Prev
        disabled={active === 1}
        {...(!(active === 1) && { onClick: () => onClick('prev') })}
      />
      {renderPaginationItems()}
      <Pagination.Next
        disabled={active === pageCount}
        {...(!(active === pageCount) && { onClick: () => onClick('next') })}
      />
    </Pagination>
  );
}

export default PaginationNav;
