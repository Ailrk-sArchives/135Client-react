import {ResponsiveLine, Serie} from "@nivo/line"
import {Pane} from 'evergreen-ui';
import React, {useState, useEffect} from 'react'
import {NivoFeed} from './VisData'
import * as VisD from './VisData'
import {SpotRecord} from "../Data/data";


// draw line chart for potentially more than one line.
const LineChart: React.FC<{
  did: number,
  keys: Exclude<keyof SpotRecord, "_kind" | "spot_record_time">,
  dateRange: [Date, Date],
  extraPros: any,
}> = props => {
  const {
    did,
    keys,
    dateRange,
    extraPros,
  } = props;

  const [data, setData] = useState<Array<Serie>>([]);
  useEffect(() => {
    // TODO: could support multiple dids.
    VisD.recordByDateRange(did, dateRange)
      .then(res => {
        const records = res.data;
        const raw: NivoFeed = {did: did, data: records};
        const feed = [VisD.toNivoData(raw, keys, "Line") as Serie];
        console.log(feed);
        setData(() => feed);
      });
  }, []);

  return (
    <Pane width="100hv" height={600}>
      <ResponsiveLine
        data={data}
        colors={{scheme:"nivo"}}
        xScale={{type: 'time'}}
        yScale={{
          type: 'point',
          stacked: true,
        }}
        axisBottom={{format: "%H:%M"}}
        {...extraPros}
      />
    </Pane>
  );
}

export default LineChart;
