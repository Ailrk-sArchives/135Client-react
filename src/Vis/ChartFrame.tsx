import React, {useState, Fragment, useEffect, useRef} from 'react'
import {
  Pane, Button, Tab, Icon, Stack, Text, Strong, TextInput,
  toaster, SelectMenu, TagInput, Tooltip,
} from 'evergreen-ui'
import {Link, useLocation} from 'react-router-dom'
import LineChart from './LineChart'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import {SpotRecord, spotRecordKeys} from '../Data/data'
import {valid} from 'glamor'

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
    dateFormat={"yyyy-MM-d aa h:mm"}
    timeIntervals={5}
    customInput={<CustomInput />}
  />
);

const Sep = () => <Icon icon={"slash"} size={33} marginLeft={5} marginRight={5} />

const HeaderTitle = (props: {
  did: number,
  setDid: React.Dispatch<React.SetStateAction<number>>
}) => (
    <Pane className="chartHeader-title" display="flex">
      <Tooltip content="点击查看设备数据">
        <Tab
          paddingTop={7}
          width={90}>
          <Link to={{pathname: `/Device/${props.did}/SpotRecords`}}
            style={{textDecoration: 'none'}}>
            <Strong size={600}>设备ID:  </Strong>
          </Link>
        </Tab>
      </Tooltip>
      <Tooltip content="输入设备ID">
        <TextInput width={80}
          fontSize={18}
          placeholder={props.did.toString()}
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) =>
              props.setDid(() => Number.parseInt(e.target.value))
          } />
      </Tooltip>
    </Pane>
  );

type DateState = [Date, React.Dispatch<React.SetStateAction<Date>>];
const SelectDate = (props: {start: DateState, end: DateState}) => {
  const [startDate, setStartDate] = props.start;
  const [endDate, setEndDate] = props.end;
  return (
    <Pane
      width={470}
      display="flex">
      <Strong size={600} paddingTop={4} marginRight={20}>日期: </Strong>
      <Pane
        className="charHeader-startdate">
        <ChartDatePicker
          date={startDate}
          setDate={setStartDate} />
      </Pane>
      <Text size={600} paddingTop={4} marginLeft={10} marginRight={10}>至</Text>
      <Pane
        className="chartHeader-enddate">
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
  endDate: Date,
  keys: Array<RecordKeys>,
}
const SearchBtn = (props: ChartLocState) => {
  return (
    <Pane background="#66788A"
      height={40} width={80}>
      <Link to={{pathname: "/Visualization", state: props}} style={{textDecoration: 'none'}}>
        <Tab height="100%"
          paddingLeft={-10}
          width="100%">
          <Strong color="#ffffff" fontSize={18} > 查询 </Strong>
        </Tab>
      </Link>
    </Pane>
  );
}

type RecordKeys = Exclude<keyof SpotRecord, "_kind" | "spot_record_time">;
const KeySelector = (props: {
  keys: Array<RecordKeys>,
  setKeys: React.Dispatch<React.SetStateAction<Array<RecordKeys>>>,
}) => {
  const {keys, setKeys} = props;
  const [selected, setSelected] = useState<string>(keys[0] ?? "ADD");
  const ref = useRef<TagInput>(null);
  useEffect(() => {
    console.log(ref);
  }, []);
  return (
    <Pane display="flex" height={40}>
      <Tooltip content="点击按钮添加标签">
        <TagInput width={450} height={40}
          placeholder={"Add labels"}
          ref={ref}
          values={keys}
          onChange={keys => setKeys(keys as Array<RecordKeys>)} />
      </Tooltip>

      <SelectMenu
        title="select keys"
        options={
          spotRecordKeys
            .filter(e =>
              !["spot_record_time",
                "spot_record_id",
                "device_id"].includes(e[0]))
            .map(label => ({label: label[1], value: label[0]}))}
        selected={selected}
        onSelect={item => {
          if (keys.length < 3) {
            setSelected(item.value as string);
            setKeys(keys => keys.concat([item.value as RecordKeys]))
            let rv = ref.current?.props.values;
            if (rv !== undefined) rv = keys;
          }
          else {
            toaster.warning("最多同时显示3个标签");
          }
        }}>
        <Button height={40}>
          <Icon icon="plus" />
        </Button>
      </SelectMenu>
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
  console.log(loc);
  const [redraw, setRedraw] = useState<boolean>(false);
  const [did, setDid] = useState<number>(loc.state?.did ?? 1);
  const [keys, setKeys] =
    useState<Array<RecordKeys>>(loc.state?.keys ?? ["temperature"]);
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
        paddingTop={30}
        paddingLeft={20}
        height={100}
        width="100hv"
        display="flex"
        style={{flexDirection: "column", flexWrap: "wrap", }}
        background="tint2">
        <Pane
          height="100px"
          display="flex" >
          <HeaderTitle did={did} setDid={setDid} />
          <Sep />
          <SelectDate start={[startDate, setStartDate]}
            end={[endDate, setEndDate]} />
          <Sep />
          <KeySelector keys={keys} setKeys={setKeys} />
          <Sep />
          <div onClick={onClickSearch}>
            <SearchBtn did={did}
              startDate={startDate}
              endDate={endDate}
              keys={keys} />
          </div>
        </Pane>
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

