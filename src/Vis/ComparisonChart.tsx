import {ResponsiveLine, Serie} from "@nivo/line"
import {Pane, Spinner} from 'evergreen-ui';
import React, {useState, useEffect} from 'react'
import {NivoFeed} from './VisData'
import * as VisD from './VisData'
import {SpotRecord} from "../Data/data";

//TODO implement.

// draw line chart for potentially more than one line.
const ComparisonChart: React.FC<{
  did: number,
  keys: Array<Exclude<keyof SpotRecord, "_kind" | "spot_record_time">>,
  dateRange: [Date, Date],
  extraPros: any,
}> = props => {
  const {
    did,
    keys,
    dateRange,
    extraPros,
  } = props;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<Array<Serie>>([]);
  useEffect(() => {
    VisD.recordByDateRange(did, dateRange)
      .then(res => {
        const records = res.data;

        if (records.length == 0) {
          setLoaded(true);
          return;
        };

        const raw: NivoFeed = {did: did, data: records};
        const feed = keys.map(k => VisD.toNivoData(raw, k, "Line") as Serie);
        setData(() => feed);
        setLoaded(true);
      });
  }, []);

  return (
    <>
      {loaded ? data.length > 0 ?
        <ResponsiveLine
          data={data}
          colors={{scheme: "nivo"}}
          xScale={{type: 'time'}}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
          }}
          axisBottom={{format: "%m/%d-%H:%M"}}
          {...extraPros}
        />
        :
        <Pane display="flex"
          alignItems="center"
          justifyContent="center"> 暂无数据 </Pane>
        :
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Spinner />
        </Pane>}
    </>
  );
}

export default ComparisonChart;
