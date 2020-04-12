import React, {useState, Fragment, useEffect, forwardRef} from 'react'
import {Pane, Button, Tab, Stack, Text, Strong, TextInput, toaster} from 'evergreen-ui'
import {Link, useLocation} from 'react-router-dom'
import LineChart from './LineChart'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {SpotRecord} from '../Data/data'

const chartCommonProperties = {
  width: 1300,
  height: 600,
  margin: {top: 20, right: 20, bottom: 60, left: 80},
  animate: true,
  enableSlices: 'x',
};

const CustomInput = ({value, onClick}: any) => (
  <Pane background="overlay"
    padding={2}>
    <Tab onSelect={onClick}
      height={30}>
      <Text color="#ffffff" fontSize={16}> {value} </Text>
    </Tab>
  </Pane>
);

const ChartDatePicker = (props: {date: Date, setDate: Function}) => (
  <DatePicker
    selected={props.date}
    onChange={d => props.setDate(d ?? new Date())}
    showTimeSelect
    timeFormat={"HH:mm"}
    dateFormat={"yyyy/MM/d, h:mm aa"}
    timeIntervals={5}
    customInput={<CustomInput />}
  />
);

const HeaderTitle = (props: {
  did: number,
  setDid: React.Dispatch<React.SetStateAction<number>>
}) => (
    <Pane className="chartHeader-title" display="flex">
      <Strong paddingTop={5} marginRight={15} size={600}>设备ID:  </Strong>
      <TextInput width={100}
        fontSize={18}
        placeholder={props.did.toString()}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) =>
            props.setDid(() => Number.parseInt(e.target.value))
        } />
    </Pane>
  );

type DateState = [Date, React.Dispatch<React.SetStateAction<Date>>];
const SelectDate = (props: {start: DateState, end: DateState}) => {
  const [startDate, setStartDate] = props.start;
  const [endDate, setEndDate] = props.end;
  return (
    <Pane
      display="flex"
      marginLeft={30}>
      <Text size={600} paddingTop={5} marginRight={20}>日期: </Text>
      <Pane
        className="charHeader-startdate">
        <ChartDatePicker
          date={startDate}
          setDate={setStartDate} />
      </Pane>
      <Text size={600} paddingTop={5} marginLeft={10} marginRight={10}>至</Text>
      <Pane
        className="charHeader-enddate">
        <ChartDatePicker
          date={endDate}
          setDate={setEndDate} />
      </Pane>
    </Pane>
  );
}

interface ChartLocState {
  did: number,
  startDate: Date,
  endDate: Date
}
const SearchBtn = (props: ChartLocState) => {
  return (
    <Pane background="#66788A"
      height={40} width={80}
      paddingRight={10}
      display="relative">
      <Link to={{pathname: "/Visualization", state: props}} style={{textDecoration: 'none'}}>
        <Tab height="100%"
          width="100%">
          <Strong color="#ffffff" fontSize={20} > 查询 </Strong>
        </Tab>
      </Link>
    </Pane>
  );
}

export const ChartFrame: React.FC<{currentZoom: number}> = props => {
  // TODO: main jobs
  // 1. header with enough information,
  // 2. be able to change the digram with header setting.
  // 3. be able to show multiple entries for on device.
  // 4. be able to show one entry for multiple devices.
  let loc = useLocation<ChartLocState>();
  const [redraw, setRedraw] = useState<boolean>(false);
  const [did, setDid] = useState<number>(loc.state?.did ?? 1);
  const [keys, setKeys] =
    useState<Array<Exclude<keyof SpotRecord, "_kind" | "spot_record_time">>>
      (["temperature"]);

  const [startDate, setStartDate] =
    useState<Date>(loc.state?.startDate ??
      (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
      })());
  const [endDate, setEndDate] = useState<Date>(loc.state?.endDate ?? new Date());

  const onClickSearch = () => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const start = startDate.getTime();
    const end = endDate.getTime();

    const daydiff = Math.floor((end - start) / msPerDay);
    if (daydiff > 60) {
      toaster.notify("一次最多60天的数据", {duration: 2});
      return;
    }
    setRedraw(!redraw);
  };

  if (redraw) {
    window.location.reload(true);
  }

  const ChartHeader = () => {
    return (
      <Pane className="chartHeader-container"
        height="100px"
        background="tint2"
        width="100hv"
        display="flex"
        justifyContent="space-between"
        paddingLeft={40}
        paddingRight={30}
        paddingTop={20}>
        <Pane display="flex" marginRight={400}>
          <HeaderTitle did={did} setDid={setDid} />
          <SelectDate start={[startDate, setStartDate]}
            end={[endDate, setEndDate]} />
        </Pane>
        <div onClick={onClickSearch}>
          <SearchBtn did={did} startDate={startDate} endDate={endDate} />
        </div>
      </Pane>
    );
  }

  return (
    <Fragment>
      <Pane background="overlay"
        paddingTop={2}
        paddingLeft={2}
        paddingRight={2}
        paddingBottom={10}
        width="100%"
        height="100%">

        <ChartHeader />
        <Pane height={600}
          paddingLeft={60}
          background="tint2"
          width="100hv" >
          <LineChart
            did={did}
            keys={keys}
            dateRange={[startDate, endDate]}
            extraPros={chartCommonProperties} />
        </Pane>
      </Pane>
    </Fragment>
  );
}

