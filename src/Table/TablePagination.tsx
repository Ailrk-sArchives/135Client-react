import React from 'react';
import {Pane} from 'evergreen-ui';
import {PaginationRequest} from '../data';

type TablePaginationProp = T extends

const TablePagination:
  React.FC<{
  paginationRequest: PaginationRequest,
  }> = (props) => {

    <Pane {...props}>
    </Pane>
    return <Pane></Pane>;
  };


export default TablePagination;
