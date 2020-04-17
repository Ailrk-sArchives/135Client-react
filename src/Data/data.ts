import axios, {AxiosResponse} from 'axios';
import {apiBaseUrl} from '../config';
import * as AdaptorTypes from './dataAdaptor';


function makeApi<T>(
  url: string,
  api_func: ((url: string, params?: T) => any),
  params?: T) {
  if (!params) return api_func(url);
  return api_func(url, params);
};

function concatPath(base: string, path: string) {
  // handel with back slashFunction
  if (base.slice(-1) === '/') {base = base.slice(0, -1)};
  if (path.slice(0, 1) !== '/') {path = '/' + path};
  return base + path;
};

export type DataTypeKeyName = string;
export type DataTypeDemonstrateName = string;
export type DataTypeInputHint = string;
export type DataTypeKeys =
  Array<[DataTypeKeyName,
    DataTypeDemonstrateName,
    DataTypeInputHint]>;

export type HTTPMethods =
  | "post"
  | "delete"
  | "put"
  | "get"
  | undefined
  ;

export interface Spot {
  _kind: "Spot",
  project_id?: number,
  project_name?: string,
  spot_id?: number,
  spot_name?: string,
  spot_type?: string,
  number_of_device?: number,
}

export const spotKeys: DataTypeKeys = [
  ["project_id", "所在项目id", "若所在测点不存在请先创建"],
  ["spot_name", "测点名称", "任意测点名称"],
  ["spot_type", "房间类型", "任意测点类型"]
];

export interface Device {
  _kind: "Device",
}
export interface Device {
  create_time?: string,
  device_id?: number,
  device_name?: string,
  device_type?: string,
  modify_time?: string,
  online?: boolean,
  spot_id?: number,
  spot_name?: string,
  project_id?: string,
  project_name?: string,
}
export const deviceKeys: DataTypeKeys = [
  ["create_time", "创建时间", "2000-01-30T10:10:10"],
  ["device_name", "设备名", "任意设备名称"],
  ["device_type", "设备型号", "任意设备型号"],
  ["modify_time", "最后修改时间", "2000-01-30T10:10:10"],
  ["online", "在线", "0 或 1"],
  ["spot_id", "所在测点id", "若所在测点不存在请先创建"],
];

export interface ClimateArea {_kind: "ClimateArea", }
export interface ClimateArea {
  area_name: string,
}

export interface Location {_kind: "Location", }
export interface Location {
  city?: string,
  climate_area?: ClimateArea,
  province?: string,
}

export interface Company {_kind: "Company", }
export interface Company {company_name: string, }

export interface Project {
  _kind: "Project",
}
export interface Project {
  area?: number,
  building_height?: string,
  building_type?: string,
  construction_company?: Company,
  demo_area?: string,
  district?: string,
  finished_time?: string,
  floor?: string,
  latitude: number,
  location?: Location,
  longitude: number,
  outdoor_spot?: string,  // TODO outdoor is its own type too.
  project_company?: Company,
  project_id?: number,
  project_name?: string,
  record_started_from?: string,
  started_time?: string,
  tech_support_company?: Company,
  description?: string,
}
export const projectKeys: DataTypeKeys = [
  ["project_name", "项目名称", "任意项目名称"],
  ["area", "建筑面积", "10.3"],
  ["demo_area", "示范面积", "10.3"],
  ["building_height", "建筑高度", "24"],
  ["floor", "层高", "5"],
  ["building_type", "建筑类型", "任意类型名称"],
  ["started_time", "开工时间", "2000-01-30T10:10:10"],
  ["finished_time", "竣工时间", "2000-01-30T10:10:10"],
  ["record_started_from", "开始记录时间", "2000-01-30T10:10:10"],
  ["construction_company", "建设单位", "某单位"],
  ["tech_support_company", "技术支撑公司", "某单位"],
  ["project_company", "项目单位", "某单位"],
  ["district", "所在城区", "沙坪坝区"],
  ["latitud", "纬度", "30.000000 精度大于3位"],
  ["longitud", "经度", "120.000000 精度大于3位"],

  ["province", "所在省", "重庆"],
  ["city", "所在市", "重庆"],
  ["area_name", "所在气候区", "A1"],

  ["outdoor_spot", "室外测点id", "若不存在可以为空"],
  ["description", "技术亮点", "介绍..."]
];

export interface SpotRecord {
  _kind: "SpotRecord",
}
export interface SpotRecord {
  ac_power?: number,
  co2?: number,
  device_id?: number,
  humidity?: number,
  pm25?: number,
  spot_record_id?: number,
  spot_record_time?: string,
  temperature?: number,
  window_opened?: boolean,
}
export const spotRecordKeys: DataTypeKeys = [
  ["ac_power", "空调功耗", "0.0"],
  ["co2", "CO2", "0.0"],
  ["pm25", "PM2.5", "100"],
  ["device_id", "所属设备id", "若所属设备不存在请先创建"],
  ["humidity", "湿度", "50.1"],
  ["temperature", "温度", "20.1"],
  ["spot_record_time", "记录时间", "2000-01-30T10:10:10"],
  ["window_opened", "窗磁开关", "0 或 1"]
];

export interface ProjectDetail {_kind: "ProjectDetail", }
export interface ProjectDetail {
  project_id?: number,
  image?: string,
  image_description?: string,
};

export interface ApiResponse<T> extends WithData<T> {
  status: number,
  data?: T,
  message: string,
}

// --
export interface FetchedData<T> extends WithData<T> {
  totalElementCount: number,  // total elements in the db.
  data: T,
}

export interface PagedData<T> extends FetchedData<T> {
  currentPage: number,
  pageSize: number,
}

export interface FilteredData<T> extends FetchedData<T> {}

// --
export interface ApiRequest<T> {
  request: T,
}

export interface PaginationRequest {
  size: number,
  pageNo: number,
}

export interface FilterRequest {
  startTime: string,
  endTime: string,
  keyword: string,
}


export type RequestParams =
  | PaginationRequest
  | Partial<FilterRequest>  // filter request doesn't need to be total.
  ;

// type guards for RequestParams
export function isPaginationRequest(req: RequestParams): req is PaginationRequest {
  return (req as PaginationRequest).pageNo !== undefined;
}

export function isFilterRequest(req: RequestParams): req is FilterRequest {
  return (req as FilterRequest).keyword !== undefined;
}

export type ApiDataType =
  | Spot
  | Device
  | Project
  | SpotRecord
  | ProjectDetail
  ;

export type ApiDataTypeTag =
  | "Spot"
  | "Device"
  | "Project"
  | "SpotRecord"
  | "ProjectDetail"
  ;

const makeRequest = <T>(params: T) => {
  return {"request": params};
};

const makeJsonRequestHeader = () => ({headers: {"Content-Type": "application/json"}});

const good_response =
  <T>(response: AxiosResponse<ApiResponse<T>>): boolean => response.data.status === 0;

export function makePaginationRequest(pageNo: number, size: number): PaginationRequest {
  const paginationRequest: PaginationRequest = {
    size: size,
    pageNo: pageNo
  };
  return paginationRequest;
};

type PadTag = (tag: ApiDataTypeTag, e: ApiDataType) => ApiDataType;
const padtag: PadTag = (tag, e) => {
  e._kind = tag;
  return e;
};

function padTagFetchedData(tag: ApiDataTypeTag, e: PagedData<Array<ApiDataType>>) {
  for (const n of e.data)
    (n as ApiDataType)._kind = tag;
  return e;
}

// map operation to any structure contains data.
interface WithData<T> {data?: T, }
function fmapData<T, U>(f: (e: T) => U, m: WithData<T>): WithData<U | T> {

  if (m.data !== undefined) {
    let {data, ...rest} = m;
    return {
      ...rest,
      data: data ? f(data) : undefined,
    } as WithData<U>;
  }
  return m;
};


/* Server Response is wrapped in http response json
    it has structure like
   { status: 200,
      statusText: 'OK',
      data: {
        status: 0,
        message: ...,
        data: { ...    // data from the server }
      }
      ...  }
  TODO: if return value is not 0, return message instead.
*/

const hasher = (p: string) => {
  let hash = 0;
  for (let i = 0; i < p.length; ++i) {
    let char = p.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export const loginVerify = (name: string, pw: string): Promise<boolean> => {
  const loginInfo = {
    name,
    pwhash: hasher(pw).toString(),
  }

  return makeApi(concatPath(apiBaseUrl, '/api/v1/login'),
    (url: string) => {
      return axios.post(url, makeRequest(loginInfo), makeJsonRequestHeader())
        .then((response: AxiosResponse<ApiResponse<void>>) => {
          console.log(response.data)
          return response.data.status == 0;
        })
        .catch(e => console.error(e))
    }, loginInfo);
}


export type Message = string;
export type FeedBack = {message: string, status: number};

export class IdempotentApis {

  static Get = class {

    static projectViewGet = (): Promise<Array<Project>> =>
      makeApi(concatPath(apiBaseUrl, '/api/v1/project/all'),
        (url: string) => {
          return axios.get(url)
            .then(response => {

              if (good_response<Array<Project>>(response))
                return (response.data.data as Array<Project>)
                  .map(e => padtag("Project", e));
            })
            .catch(e => console.error(e));
        });


    static spotViewGet = (pid: number): Promise<Array<Spot>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project/${pid}/spots`),
        (url: string) => {

          return axios.get(url)
            .then(response => {

              if (good_response<Array<Spot>>(response))
                return (response.data.data as Array<Spot>)
                  .map(e => padtag("Spot", e));
            })
            .catch(e => console.error(e));

        });

    static spotRecordView = (did: number): Promise<Array<SpotRecord>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/device/${did}/records`),
        (url: string) => {
          return axios.get(url)
            .then(response => {

              if (good_response<Array<SpotRecord>>(response))
                return (response.data.data as Array<SpotRecord>)
                  .map(e => padtag("SpotRecord", e));

            })
            .catch(e => console.error(e));
        });

    static projecPicView = (pid: number): Promise<Array<ProjectDetail>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project_pic/${pid}`),
        (url: string) => {

          return axios.get(url)
            .then(response => {

              if (good_response<Array<ProjectDetail>>(response))
                return (response.data.data as Array<ProjectDetail>)
                  .map(e => padtag("ProjectDetail", e));

            })
            .catch(e => console.error(e));
        });

    static PostPayload = class {

      static fetchProject = (params: RequestParams): Promise<FetchedData<Array<Project>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project`),
          (url: string, params) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<FetchedData<Array<Project>>>(response))
                  return fmapData(
                    padTagFetchedData.bind(null, "Project"), response.data).data;
              })
              .catch(e => console.error(e))
          },
          params);

      static fetchSpotByProject =  // what is this?
        (params: RequestParams, pid: number): Promise<FetchedData<Array<Spot>>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}/spot`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {
                  if (good_response<FetchedData<Array<Spot>>>(response)) {
                    return fmapData(
                      padTagFetchedData.bind(null, "Spot"), response.data).data;
                  }

                  // (response.data.data as Array<Spot>)
                  //     .map(e => padtag("Spot", e));
                })
                .catch(e => console.error(e))
            },
            params);

      static fetchSpot = (params: RequestParams): Promise<FetchedData<Array<Spot>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<FetchedData<Array<Spot>>>(response))
                  return fmapData(
                    padTagFetchedData.bind(null, "Spot"), response.data).data;

              })
              .catch(e => console.error(e))
          },
          params);

      static fetchDeviceBySpot =
        (params: RequestParams, sid: number): Promise<FetchedData<Array<Device>>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/spot/${sid}/device`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {

                  console.log(response);
                  if (good_response<FetchedData<Array<Device>>>(response))
                    return fmapData(
                      padTagFetchedData.bind(null, "Device"), response.data).data;
                })
                .catch(e => console.error(e))
            },
            params);

      static fetchDevice = (params: RequestParams): Promise<FetchedData<Array<Device>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<FetchedData<Array<Device>>>(response))
                  return fmapData(
                    padTagFetchedData.bind(null, "Device"), response.data).data;
              })
              .catch(e => console.error(e))
          },
          params);

      static fetchSpotRecord =
        (params: RequestParams, did: number): Promise<FetchedData<Array<SpotRecord>>> =>
          makeApi(
            concatPath(apiBaseUrl,
              isPaginationRequest(params)
                ? `api/v1/device/${did}/spot_record`
                : `api/v1/spotRecord/filter/${did}`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {

                  if (good_response<FetchedData<Array<SpotRecord>>>(response))
                    return fmapData(
                      padTagFetchedData.bind(null, "SpotRecord"), response.data).data;
                })
                .catch(e => console.error(e))
            },
            params);
    };

    static RealTime = class {
      static getRealtimeDevice = (): Promise<Array<Device>> =>
        makeApi(concatPath(apiBaseUrl, '/api/v1/realtime/devices'),
          (url: string) => {
            return axios.get(url)
              .then(response => {
                return (response.data.data as Array<Device>)
                  .map(e => padtag("Device", e));
              })
              .catch(e => console.error(e));
          });
    }
  };


  static Put = class {

    static updateProject =
      (params: AdaptorTypes.PanelProject, pid: number): Promise<ApiResponse<Project>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}`),
          (url: string) => {
            return axios.put(url,
              {
                // update need additional id of target to be updated
                // which is not provided in PanelDataType
                ...AdaptorTypes.MakeServerData.makeProject(params),
                project_id: pid
              })
              .then(response => {

                return fmapData(
                  padtag.bind(null, "Project"), response.data)
              })

              .catch(e => console.error(e))
          });

    static updateSpot =
      (params: AdaptorTypes.PanelSpot, sid: number): Promise<ApiResponse<Spot>> => {

        return makeApi(concatPath(apiBaseUrl, `api/v1/spot/${sid}`),
          (url: string) => {
            return axios.put(url,
              makeRequest({
                ...AdaptorTypes.MakeServerData.makeSpot(params),
                spot_id: sid,
              }))
              .then(response => {
                console.log(response);
                return fmapData(
                  padtag.bind(null, "Spot"), response.data)
              })

              .catch(e => console.error(e))
          });

      };
    static updateDevice =
      (params: AdaptorTypes.PanelDevice, did: number): Promise<ApiResponse<Device>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device/${did}`),
          (url: string) => {
            return axios.put(url,
              makeRequest({
                ...AdaptorTypes.MakeServerData.makeDevice(params),
                device_id: did,
              }))
              .then(response => {
                return fmapData(
                  padtag.bind(null, "Device"), response.data)
              })
              .catch(e => console.error(e))
          });

    static updateSpotRecord =
      (params: AdaptorTypes.PanelSpotRecord, rid: number): Promise<ApiResponse<SpotRecord>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spotRecord/${rid}`),
          (url: string) => {
            console.log(
              makeRequest({
                ...AdaptorTypes.MakeServerData.makeSpotRecord(params),
                spot_record_id: rid
              }));

            return axios.put(url,
              makeRequest({
                ...AdaptorTypes.MakeServerData.makeSpotRecord(params),
                spot_record_id: rid
              }))
              .then(response => {
                return fmapData(
                  padtag.bind(null, "SpotRecord"), response.data)
              })

              .catch(e => console.error(e))
          });

  };


  static Delete = class {
    static deleteProject = (pid: number): Promise<FeedBack> =>
      makeApi(

        concatPath(apiBaseUrl, `api/v1/project/${pid}`),

        (url: string) =>
          axios.delete(url)
            .then(response =>
              response.data as ApiResponse<any>)  // always return message from the server.
            .catch(e => console.error(e))
      );

    static deleteDevice = (did: number): Promise<FeedBack> =>
      makeApi(
        concatPath(apiBaseUrl, `api/v1/device/${did}`),
        (url: string) =>
          axios.delete(url)
            .then(response => response.data as ApiResponse<any>)  // always return message from the server.
            .catch(e => console.error(e))
      );


    static deleteSpot = (sid: number): Promise<FeedBack> =>
      makeApi(
        concatPath(apiBaseUrl, `api/v1/spot/${sid}`),

        (url: string) =>
          axios.delete(url)
            .then(response => response.data as ApiResponse<any>)
            .catch(e => console.error(e))
      );

    static deleteSpotRecord = (rid: number): Promise<FeedBack> =>
      makeApi(
        concatPath(apiBaseUrl, `api/v1/spotRecord/${rid}`),

        (url: string) =>
          axios.delete(url)
            .then(response => response.data as ApiResponse<any>)  // always return message from the server.
            .catch(e => console.error(e))
      );
  };
};


export class NonIdempotentApis {

  static Post = class {

    static postProject =
      (params: AdaptorTypes.PanelProject): Promise<ApiResponse<Project>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeProject(params)),
              makeJsonRequestHeader())

              .then(response => {
                return fmapData(
                  padtag.bind(null, "Project"), response.data) as ApiResponse<Project>

              })
              .catch(e => console.error(e));
          }
        );

    static postSpot =
      (params: AdaptorTypes.PanelSpot): Promise<ApiResponse<Spot>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot/`),
          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpot(params)),
              makeJsonRequestHeader())

              .then(response => {
                return fmapData(
                  padtag.bind(null, "Spot"), response.data) as ApiResponse<Spot>

              })
              .catch(e => console.error(e));
          }
        );

    static postDevice =
      (params: AdaptorTypes.PanelDevice): Promise<ApiResponse<Device>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeDevice(params)),
              makeJsonRequestHeader())

              .then(response => {
                return fmapData(
                  padtag.bind(null, "Device"), response.data) as ApiResponse<Device>

              })
              .catch(e => console.error(e));
          }
        );

    static postSpotRecord =
      (params: AdaptorTypes.PanelSpotRecord): Promise<ApiResponse<SpotRecord>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spotRecord/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpotRecord(params)),
              makeJsonRequestHeader())

              .then(response => {
                return fmapData(
                  padtag.bind(null, "SpotRecord"), response.data) as ApiResponse<SpotRecord>

              })
              .catch(e => console.error(e));
          }
        );
  };


};



