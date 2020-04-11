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

const toLineChartData = (raw: NivoFeed, key: string): Serie => {
  const {did, data} = raw;
  const datums: Array<Datum> =
    data.map(record => {
    // debugger;
      const timestring = record.spot_record_time;
      const date: Date = timestring ? new Date(timestring) : new Date();
      let y = record[key as keyof SpotRecord];

      if (typeof y == "boolean") {y = y ? "true" : "false";}
      return {x: date, y: y, };
    });

  return ({id: did, data: datums, }) as Serie;
}

const toBarChartData = (raw: NivoFeed, key: string): BarDatum => {
  return {} as BarDatum;
}

