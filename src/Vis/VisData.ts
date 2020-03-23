import {IdempotentApis, SpotRecord, FilterRequest, FetchedData} from '../Data/data';

// TODO retrive a specific field of SpotRecord as an array.
function daysElapsed(time: number) {
  return Math.floor(time / (1000 * 60 * 60 * 24));
}

export type SpotRecordKey = Exclude<keyof SpotRecord, "_kind" | "spot_record_time">;

export interface RecordSlice {
  value: SpotRecord[SpotRecordKey],
  time: Pick<SpotRecord, "spot_record_time">,
}

export interface DateRange {
  start: Date,
  end: Date,
}


export class VisData {
  resolved: Promise<FetchedData<Array<SpotRecord>>> | undefined;

  constructor(drange: DateRange, did: number) {
    const {start, end} = drange;

    const elapsed = end.getTime() - start.getTime();
    if (daysElapsed(elapsed) > 14 || elapsed < 0) this.resolved = undefined;

    const req: Partial<FilterRequest> = {
      startTime: start.toJSON().split('.')[0],
      endTime: end.toJSON().split('.')[0],
    }

    this.resolved = IdempotentApis.Get.PostPayload.fetchSpotRecord(req, did);
    return this;
  }

  slice(key: SpotRecordKey): Promise<Array<RecordSlice>> | undefined {
    return this.resolved
      ?.then(fetched => fetched.data.map(e => ({
        value: e[key],
        time: e["spot_record_time"],
      }) as RecordSlice))

  }

  sliceMap(keys: Set<SpotRecordKey>):
    Promise<Map<SpotRecordKey, Array<RecordSlice>>> | undefined {

    const map = new Map<SpotRecordKey, Array<RecordSlice>>();
    keys.forEach(k => map.set(k, []));

    return this.resolved
      ?.then(
        fetched => {

          fetched.data.forEach(
            record => keys.forEach(
              key => {
                const slice: RecordSlice = {
                  value: record[key],
                  time: record["spot_record_time"],
                };

                if ([...map.keys()].includes(key)) {

                }
              }
            ))

          return map;
        })
  }
}
