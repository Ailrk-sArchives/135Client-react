import React from 'react';
import {IdempotentApis, NonIdempotentApis, makePaginationRequest} from './Data/data';
import Frame from './Frame';

const test_apis = () => {
  //
  IdempotentApis.Get.projectViewGet()
  .then((response) => {
    console.log('projectViewGet');
    console.log(response)});

  IdempotentApis.Get.spotRecordView(4)
  .then((response) => {
    console.log('spotViewGet');
    console.log(response)});

  IdempotentApis.Get.PostPayload
    .fetchProject(makePaginationRequest(1, 10))
    .then((response) => {
      console.log('projectPaged');
      console.log(response);
    });

  IdempotentApis.Get.PostPayload.fetchSpot(makePaginationRequest(1, 10))
    .then((response) => {
      console.log('spotPaged');
      console.log(response);
    });

  IdempotentApis.Get.PostPayload
    .fetchSpotByProject(makePaginationRequest(10, 50), 4)
    .then((response) => {
      console.log('spotRecordPaged');
      console.log(response);
    });

  IdempotentApis.Get.PostPayload
    .fetchDevice(makePaginationRequest(1, 10))
    .then((response) => {
      console.log('devicePaged');
      console.log(response);
    });

};

const Test: React.FC<{}> = (props) => {
  test_apis();
  return <Frame children={<p>test</p>}/>;
};


export default Test;

