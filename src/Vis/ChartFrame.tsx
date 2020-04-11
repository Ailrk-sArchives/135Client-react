import React, {useState, Fragment} from 'react'
import {Pane} from 'evergreen-ui'
import LineChart from './LineChart'

const chartCommonProperties = {
  width: 1200,
  height: 600,
  margin: {top: 20, right: 20, bottom: 60, left: 80},
  animate: true,
  enableSlices: 'x',
};


export const ChartFrame: React.FC<{currentZoom: number}> = props => {
  // TODO: main jobs
  // 1. header with enough information,
  // 2. be able to change the digram with header setting.
  // 3. be able to show multiple entries for on device.
  // 4. be able to show one entry for multiple devices.
  const [did, setDid] = useState<number>(1);
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  const ChartHeader = () => (
    <Pane height="100px" width="100hv">
      good
    </Pane>
  );

  return (
    <Fragment>
      <ChartHeader />
      <LineChart
        did={1}
        keys={"temperature"}
        dateRange={[new Date(2020, 1, 16, 5), new Date(2020, 1, 17, 6)]}
        extraPros={chartCommonProperties} />
    </Fragment>
  );
}
