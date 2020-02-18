import axios, {AxiosResponse} from 'axios';
import {apiBaseUrl} from '../config';
import * as AdaptorTypes from './dataAdaptor';


const makeApi =
  <T>(url: string, api_func: ((url: string, params?: T) => any),
    params?: T) => {
    if (!params) return api_func(url);
    return api_func(url, params);
  };

const concatPath = (base: string, path: string) => {
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

export interface Spot {
  project_id?: number;
  project_name?: string;
  spot_id?: number;
  spot_name?: string;
  spot_type?: string;
  number_of_device?: number;
};
export const spotKeys: DataTypeKeys = [
  ["project_id", "所在项目id", "若所在测点不存在请先创建"],
  ["spot_name", "测点名称", "任意测点名称"],
  ["spot_type", "房间类型", "任意测点类型"]
];

export interface Device {
  create_time?: string;
  device_id?: number;
  device_name?: string;
  device_type?: string;
  modify_time?: string;
  online?: boolean;
  spot_id?: number;
  spot_name?: string;
  project_id?: string;
  project_name?: string;
};
export const deviceKeys: DataTypeKeys = [
  ["create_time", "创建时间", "2000-01-30T10:10:10"],
  ["device_name", "设备名", "任意设备名称"],
  ["device_type", "设备型号", "任意设备型号"],
  ["modify_time", "最后修改时间", "2000-01-30T10:10:10"],
  ["online", "在线", "0 或 1"],
  ["spot_id", "所在测点id", "若所在测点不存在请先创建"],
];

export interface ClimateArea {
  area_name: string
};

export interface Location {
  city?: string;
  climate_area?: ClimateArea;
  province?: string;
};


export interface Company {
  company_name: string;
};

export interface Project {
  area?: number;
  building_height?: string;
  building_type?: string;
  construction_company?: Company;
  demo_area?: string;
  district?: string;
  finished_time?: string;
  floor?: string;
  latitude: number;
  location?: Location;
  longitude: number;
  outdoor_spot?: string;  // TODO outdoor is its own type too.
  project_company?: Company;
  project_id?: number;
  project_name?: string;
  record_started_from?: string;
  started_time?: string;
  tech_support_company?: Company;
  description?: string;
};
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
  ac_power?: number;
  co2?: number;
  device_id?: number;
  humidity?: number;
  pm25?: number;
  spot_record_id?: number;
  spot_record_time?: number;
  temperature?: number;
  window_opened?: boolean;
};
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

export interface ApiResponse<T> {
  status: number;
  data?: T;
  message: string;
};

export interface PagedData<T> {
  totalElementCount: number;  // total elements in the db.
  data: T;
  currentPage: number;
  pageSize: number;
};

export interface ApiRequest<T> {
  request: T;
};

export interface PaginationRequest {
  size: number;
  pageNo: number;
};

export interface ProjectDetail {
  project_id?: number;
  image?: string;
  image_description?: string;
};


export type ApiDataType = Spot | Device | Project | SpotRecord;

export const apiDataTypeCheck = (data: ApiDataType):
  | "Spot"
  | "Device"
  | "Project"
  | "SpotRecord"
  | undefined => {

  if ((data as Project).location !== undefined) return "Project";
  if ((data as Spot).spot_type !== undefined) return "Spot";
  if ((data as Device).device_name !== undefined) return "Device";
  if ((data as SpotRecord).window_opened !== undefined) return "SpotRecord";

};

const makeRequest = <T>(params: T) => {
  return {"request": params};
};

const makeJsonRequestHeader = () => ({headers: {"Content-Type": "application/json"}});

const good_response =
  <T>(response: AxiosResponse<ApiResponse<T>>): boolean => response.data.status === 0;

export const makePaginationRequest =
  (pageNo: number, size: number): PaginationRequest => {
    const paginationRequest: PaginationRequest = {
      size: size,
      pageNo: pageNo
    };
    return paginationRequest;
  }

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

export type Message = string;
export type FeedBack = { message: string, status: number };

export class IdempotentApis {

  static Get = class {

    static projectViewGet = (): Promise<Array<Project>> =>
      makeApi(concatPath(apiBaseUrl, '/api/v1/project/all'),
        (url: string) => {
          return axios.get(url)
            .then(response => {

              if (good_response<Array<Project>>(response))
                return response.data.data;

            })
            .catch(e => console.error(e));
        });


    static spotViewGet = (pid: number): Promise<Array<Spot>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project/${pid}/spots`),
        (url: string) => {

          return axios.get(url)
            .then(response => {

              if (good_response<Array<Spot>>(response))
                return response.data.data;

            })
            .catch(e => console.error(e));

        });

    static spotRecordView = (did: number): Promise<Array<SpotRecord>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/device/${did}/records`),
        (url: string) => {
          return axios.get(url)
            .then(response => {

              if (good_response<Array<SpotRecord>>(response))
                return response.data.data;

            })
            .catch(e => console.error(e));
        });

    static projecPicView = (pid: number): Promise<Array<ProjectDetail>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project_pic/${pid}`),
        (url: string) => {

          return axios.get(url)
            .then(response => {

              if (good_response<Array<ProjectDetail>>(response))
                return response.data.data;

            })
            .catch(e => console.error(e));
        });


    static Paged = class {

      static projectPaged = (params: PaginationRequest): Promise<PagedData<Array<Project>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project`),
          (url: string, params) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<PagedData<Array<Project>>>(response))
                  return response.data.data;

              })
              .catch(e => console.error(e))
          },
          params);

      static spotByProjectPaged =
        (params: PaginationRequest, pid: number): Promise<PagedData<Array<Spot>>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}/spot`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {

                  if (good_response<PagedData<Array<Spot>>>(response))
                    return response.data.data

                })
                .catch(e => console.error(e))
            },
            params);

      static spotPaged = (params: PaginationRequest): Promise<PagedData<Array<Spot>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<PagedData<Array<Spot>>>(response))
                  return response.data.data

              })
              .catch(e => console.error(e))
          },
          params);

      static deviceBySpotPaged =
        (params: PaginationRequest, sid: number): Promise<PagedData<Array<Device>>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/spot/${sid}/device`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {

                  if (good_response<PagedData<Array<Device>>>(response))
                    return response.data.data

                })
                .catch(e => console.error(e))
            },
            params);

      static devicePaged = (params: PaginationRequest): Promise<PagedData<Array<Device>>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then(response => {

                if (good_response<PagedData<Array<Device>>>(response))
                  return response.data.data

              })
              .catch(e => console.error(e))
          },
          params);

      static spotRecordPaged =
        (params: PaginationRequest, did: number): Promise<PagedData<Array<SpotRecord>>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/device/${did}/spot_record`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then(response => {

                  if (good_response<PagedData<Array<SpotRecord>>>(response))
                    return response.data.data

                })
                .catch(e => console.error(e))
            },
            params);
    };
  };


  static Put = class {

    static updateProject =
      (params: AdaptorTypes.PanelProject, pid: number): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}`),
          (url: string) => {
            return axios.put(url,
              AdaptorTypes.MakeServerData.makeProject(params))
              .then(response => {
                return response.data as ApiResponse<any>;
              })

              .catch(e => console.error(e))
          });

    static updateSpot =
      (params: AdaptorTypes.PanelSpot, sid: number): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/spot/${sid}`),
          (url: string) => {
            return axios.put(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpot(params)))
              .then(response => {
                return response.data as ApiResponse<any>;
              })

              .catch(e => console.error(e))
          });

    static updateDevice =
      (params: AdaptorTypes.PanelDevice, did: number): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/device/${did}`),
          (url: string) => {
            return axios.put(url,
              makeRequest(AdaptorTypes.MakeServerData.makeDevice(params)))
              .then(response => {
                return response.data as ApiResponse<any>;
              })

              .catch(e => console.error(e))
          });

    static updateSpotRecord =
      (params: AdaptorTypes.PanelSpotRecord, rid: number): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/spotRecord/${rid}`),
          (url: string) => {
            return axios.put(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpotRecord(params)))
              .then(response => {
                return response.data as ApiResponse<any>;
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
            .then(response => response.data as ApiResponse<any>)  // always return message from the server.
            .catch(e => console.error(e))
      );

    static deleteSpotRecord= (rid: number): Promise<FeedBack> =>
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
      (params: AdaptorTypes.PanelProject): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeProject(params)),
              makeJsonRequestHeader())

              .then(response => {
                return response.data as ApiResponse<any>
              })
              .catch(e => console.error(e));
          }
        );

    static postSpot =
      (params: AdaptorTypes.PanelSpot): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot/`),
          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpot(params)),
              makeJsonRequestHeader())

              .then(response => {
                return response.data as ApiResponse<any>
              })
              .catch(e => console.error(e));
          }
        );

    static postDevice =
      (params: AdaptorTypes.PanelDevice): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeDevice(params)),
              makeJsonRequestHeader())

              .then(response => {
                return response.data as ApiResponse<any>
              })
              .catch(e => console.error(e));
          }
        );

    static postSpotRecord =
      (params: AdaptorTypes.PanelSpotRecord): Promise<FeedBack> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spotRecord/`),

          (url: string) => {
            return axios.post(url,
              makeRequest(AdaptorTypes.MakeServerData.makeSpotRecord(params)),
              makeJsonRequestHeader())

              .then(response => {
                return response.data as ApiResponse<any>
              })
              .catch(e => console.error(e));
          }
        );
    };


};



