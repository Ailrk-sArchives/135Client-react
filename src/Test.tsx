import React from 'react';
import * as data from './data';
import Frame from './Frame';

const test_apis = () => {
  //
  data.projectViewGet()
  .then((response) => {
    console.log('projectViewGet');
    console.log(response)});

  data.spotViewGet(4)
  .then((response) => {
    console.log('spotViewGet');
    console.log(response)});

  data.projectPaged(data.makePaginationRequest(1, 10))
    .then((response) => {
      console.log('projectPaged');
      console.log(response);
    });

  data.spotPaged(data.makePaginationRequest(1, 10))
    .then((response) => {
      console.log('spotPaged');
      console.log(response);
    });

  data.spotRecordPaged(data.makePaginationRequest(10, 50), 4)
    .then((response) => {
      console.log('spotRecordPaged');
      console.log(response);
    });

};

const Test: React.FC<{}> = (props) => {
  test_apis();
  return <Frame children={<p>test</p>}/>;
};


export default Test;

