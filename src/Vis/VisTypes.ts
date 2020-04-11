import { Serie } from '@nivo/line';
import { BarDatum } from '@nivo/bar';

export type ChartTypes =
  | "Bar"
  | "Line"
  ;

export type NivoDatType =
  | Serie
  | BarDatum
  ;

export interface ToNivoData {
  toNivoData: (key: string, chart: ChartTypes) => NivoDatType,
}
