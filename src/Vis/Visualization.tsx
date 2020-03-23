import {BarSvgProps} from '@nivo/bar';
import {CalendarSvgProps} from '@nivo/calendar';
import {LineSvgProps} from '@nivo/line';
import {Pane} from 'evergreen-ui';
import React, {useState, useEffect} from 'react';
import Frame from '../Frame';
import {VisData, DateRange, SpotRecordKey, RecordSlice} from './VisData';
import {SpotRecord} from '../Data/data';


type ChartType =
  | "Bar"
  | "Line"
  | "Pie"
  | "Calendar"
  ;

type ChartProps =
  | BarSvgProps
  | LineSvgProps
  | CalendarSvgProps
  ;

interface Chart {
  type: ChartType,
  chart: (props: ChartProps) => JSX.Element,
}

const commonProps = {
  width: 900,
  height: 500,
  margin: {top: 60, right: 80, bottom: 60, left: 80},
};


// the control panel UI
const ChartControl: React.FC<{
  keys: Set<SpotRecordKey>,
  dateRange: DateRange,
}> = props => {

  return (
    <Pane>
      control
    </Pane>
  );
}

// the graph UI.
const ChartPanel: React.FC<{
  chartType: ChartType,
}> = props => {
  return <Pane>panel</Pane>;
}

const ChartFrame: React.FC<{currentZoom: number}> = props => {
  const [dateRange, setDateRange] = useState<DateRange>(NowRange());

  const [did, setDid] = useState<number>(1);

  const [vdata, setData] = useState<VisData | undefined>();
  const [keys, setKeys] = useState<Set<SpotRecordKey>>(new Set());


  useEffect(() => {
    setDateRange({start: new Date(2020, 0, 18), end: new Date(2020, 0, 19)})
  }, []);

  useEffect(() => {
    setData(new VisData(dateRange, did));
  }, [dateRange, did]);

  useEffect(() => {
    vdata?.slice("humidity")?.then(e => console.log(e)).catch(() => console.log("bad"));
  }, [vdata]);

  useEffect(() => {
    console.log(vdata?.sliceMap(new Set<SpotRecordKey>(["temperature"])));
  }, []);
  return (
    <>
      <ChartControl keys={keys} dateRange={dateRange} />
      <ChartPanel chartType={"Bar"} />
    </>
  );
}

const NowRange = () => {
  const now = new Date(Date.now());
  const yesterday = new Date(Date.now());
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    start: yesterday,
    end: now,
  } as DateRange;
}

/* Container component for charts.
 * states of charts will be stored here.
 * */
const Visulization: React.FC<{}> = () => {
  return (
    <Frame>
      {React.createElement(ChartFrame)}
    </Frame>
  );
}

export default Visulization;
