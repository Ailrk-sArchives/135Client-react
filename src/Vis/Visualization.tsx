import React, {useState} from 'react'
import {ChartFrame} from './ChartFrame';
import Frame from '../Frame'


const Visualization: React.FC<{}> = () => {
  return (
    <Frame>
      {React.createElement(ChartFrame)}
    </Frame>
  );
}

export default Visualization;
