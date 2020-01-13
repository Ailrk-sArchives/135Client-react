import React from 'react';
import { Pane, Table } from 'evergreen-ui';
import Frame from '../Frame';

const TableFrame: React.FC<{}> = (props) => {
  const content = (
    <h1>Table</h1>
  );
  return <Frame children={content}/>;
};


export default Table;
