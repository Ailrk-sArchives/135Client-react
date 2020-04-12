import {Device, SpotRecord, IdempotentApis, FilterRequest} from '../Data/data';
import {ToNivoData, NivoDatType, ChartTypes} from './VisTypes';
import {Serie, Datum, DatumValue} from '@nivo/line';
import {BarDatum} from '@nivo/bar';
import React, {useEffect} from 'react';

// raw data ready to be raw to Charts.
export interface NivoFeed {
  data: Array<SpotRecord>,
  did: Device["device_id"],
}

export const recordByDateRange = (did: Device["device_id"], dateRange: [Date, Date]) => {
  const [start, end] = dateRange;
  const filterReq: Partial<FilterRequest> = {
    startTime: start.toJSON().split('.')[0],
    endTime: end.toJSON().split('.')[0],
  };
  return IdempotentApis
    .Get
    .PostPayload
    .fetchSpotRecord(filterReq, did ?? 1)
}

export const toNivoData = (raw: NivoFeed, key: string, chart: ChartTypes): NivoDatType => {
  // convert one raw data to one NivoDatType
  switch (chart) {
    case "Line":
      return toLineChartData(raw, key);
    case "Bar":
      return toBarChartData(raw, key);
  }
}

const maxConstraintFilter = (data: Array<SpotRecord>) =>
  data.length > 1000 ?
    data.filter((e, idx) => idx % Math.floor(data.length / 1000) == 0) : data;

// TODO: pad dummy
const zeroPadding = (data: Array<SpotRecord>) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const dummyRecord: SpotRecord = {
    _kind: "SpotRecord",
    ac_power: 0,
    co2: 0,
    device_id: 0,
    humidity: 0,
    pm25: 0,
    spot_record_id: 0,
    spot_record_time: undefined,
    temperature: 0,
    window_opened: false,
  };

  for (let i = 0; i < data.length; i++) {
    const current = new Date(data[i]?.spot_record_time ?? new Date());
    const next = new Date(data[i + 1]?.spot_record_time ?? new Date());
    const mkDummy = (d: Date) => {
      const dummy = Object.assign({}, dummyRecord);
      dummy.spot_record_time =
        d.setMinutes(d.getMinutes() + 5).toString();
      return dummy;
    }
    if (next.getTime() - current.getTime() / msPerDay > 1) {

      data.splice(i, 0, Object.assign({}, mkDummy(current))); i++;
      data.splice(i, 0, Object.assign({}, mkDummy(next))); i++;
    }
  }
  return data;
};

const toLineChartData = (raw: NivoFeed, key: string): Serie => {
  // aways make sure there are maximum 1000 points shown on graph.
  // pad 0 for missing data. (data is regarded missed if there is no data in 1 day.)
  const {data} = raw;
  const datums: Array<Datum> =
    maxConstraintFilter(data)
      .map(record => {
        const timestring = record.spot_record_time;
        const date: Date = timestring ? new Date(timestring) : new Date();
        let y = record[key as keyof SpotRecord];

        if (typeof y == "boolean") {y = y ? "true" : "false";}
        return {x: date, y: y, };
      });

  return ({id: key, data: datums, }) as Serie;
}

const toBarChartData = (raw: NivoFeed, key: string): BarDatum => {
  return {} as BarDatum;
}

