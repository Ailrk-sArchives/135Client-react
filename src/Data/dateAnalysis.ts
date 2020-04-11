export interface DateRange {
  start: Date,
  end: Date,
}

export interface DataSlice<T> {
  value: T[keyof T],
  time?: string,
}

export interface ZoomableTime<T> extends Array<DataSlice<T>>{
  zoom: (scale: "hour" | "day" | "mon") => ZoomableTime<T>,
}

export const nowRange = () => {
  const now = new Date(Date.now());
  const yesterday = new Date(Date.now());
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    start: yesterday,
    end: now,
  } as DateRange;
}


