import axios from 'axios';
import { apiBaseUrl } from './config';


const makeApi =
  <T>(url: string, api_func: ((url: string, params?: T) => any),
    params?: T) => {
    if (!params) return api_func(url);
    return api_func(url, params);
  };

const concatPath = (base: string, path: string) => {
  // handel with back slashFunction
  if (base.slice(-1) === '/') { base = base.slice(0, -1) };
  if (path.slice(0, 1) !== '/') { path = '/' + path };
  return base + path;
};

export interface Spot {
  project_id?: number;
  project_name?: string;
  spot_id?: number;
  spot_name?: string;
  spot_type?: string;
  number_of_device?: number;
};

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
 description?: string;
 district?: string;
 finished_time?: string;
 floor?: string;
 latitude: number;
 location?: Location;
 longitude: number;
 outdoor_spot?: string;
 project_company?: Company;
 project_id?: number;
 project_name?: string;
 record_started_from?: string;
 started_time?: string;
 tech_support_company?: Company;
};

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

export interface ApiResponse {
  status: number;
  data: any;
  message: string;
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

const makeRequest = <T>(params: T) => {
  return { "request": params };
}

const makeJsonRequestHeader = () => ({ headers: {"Content-Type": "application/json"}});

const good_response = (response: any): boolean => response.data.status === 0;

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

export class IdempotentApis {

  static Get = class {

    static projectViewGet = (): Promise<Array<Project>> =>
      makeApi(concatPath(apiBaseUrl, '/api/v1/project/all'),
        (url: string) => {
          return axios.get(url)
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));
        });


    static spotViewGet = (pid: number): Promise<Array<Spot>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project/${pid}/spots`),
        (url: string) => {

          return axios.get(url)
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));

        });

    static spotRecordView = (did: number): Promise<Array<SpotRecord>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/device/${did}/records`),
        (url: string) => {

          return axios.get(url)
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));
        });

    static projecPicView = (pid: number): Promise<Array<ProjectDetail>> =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project_pic/${pid}`),
        (url: string) => {

          return axios.get(url)
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));
        });
    static Paged = class {

      static projectPaged = (params: PaginationRequest): Promise<Array<Project>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project`),
          (url: string, params) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then((response) => {if (good_response(response)) return response.data.data;})
              .catch((e) => console.error(e))
          },
          params);

       static spotByProjectPaged =
         (params: PaginationRequest, pid: number): Promise<Array<Spot>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}/spot`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then((response) => {if (good_response(response)) return response.data.data})
              .catch((e) => console.error(e))
          },
          params);

      static spotPaged = (params: PaginationRequest): Promise<Array<Spot>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then((response) => {if (good_response(response)) return response.data.data})
              .catch((e) => console.error(e))
          },
          params);

       static deviceBySpotPaged =
         (params: PaginationRequest, sid: number): Promise<Array<Spot>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/spot/${sid}/device`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then((response) => {if (good_response(response)) return response.data.data})
              .catch((e) => console.error(e))
          },
          params);

      static devicePaged = (params: PaginationRequest): Promise<Array<Device>> =>
        makeApi(concatPath(apiBaseUrl, `api/v1/device`),
          (url: string) => {
            return axios.post(url, makeRequest(params), makeJsonRequestHeader())
              .then((response) => {if (good_response(response)) return response.data.data})
              .catch((e) => console.error(e))
          },
          params);

      static spotRecordPaged =
        (params: PaginationRequest, did: number): Promise<Array<SpotRecord>> =>
          makeApi(concatPath(apiBaseUrl, `api/v1/device/${did}/spot_record`),
            (url: string) => {
              return axios.post(url, makeRequest(params), makeJsonRequestHeader())
                .then((response) => {if (good_response(response)) return response.data.data})
                .catch((e) => console.error(e))
            },
            params);

    };
  };

  static Put = class {
    static projectViewUpdate = (params: Project, pid: number): Promise<Array<Project>> =>
      makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}`),
        (url: string) => {
          return axios.put(url, params)
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e))
        });

    static spotViewUpdate = (params: Project,
      pid: number, sid: number): Promise<Array<Project>> =>
      makeApi(concatPath(apiBaseUrl, `api/v1/project/spot/${pid}`),
        (url: string) => {
          return axios.put(url, makeRequest(params))
            .then((response) => {if (good_response(response)) return response.data.data})
            .catch((e) => console.error(e))
        });
  };

  static Delete = class {
    static projectViewDelete = (params: Project, pid: number): Promise<Message> =>
      makeApi(concatPath(apiBaseUrl, `api/v1/project/${pid}`),
        (url: string) => {
          return axios.put(url, makeRequest(params))
            .then((response) => response.data.message)  // always return message from the server.
            .catch((e) => console.error(e))
        });

    static spotViewDelete = (params: Project, pid: number): Promise<Message> =>
      makeApi(concatPath(apiBaseUrl, `api/v1/spot/${pid}`),
        (url: string) => {
          return axios.put(url, makeRequest(params))
            .then((response) => response.data.message)  // always return message from the server.
            .catch((e) => console.error(e))
        });
  };

};

export class NonIdempotentApis {
  static Post = class {
    static projectViewPost = (params: Project) =>
      makeApi(concatPath(apiBaseUrl, '/api/v1/project/all'),
        (url: string) => {
          return axios.post(url, makeRequest(params), makeJsonRequestHeader())
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));

        },
        params);

    static spotViewPost = (params: Spot, pid: number) =>
      makeApi(concatPath(apiBaseUrl, `/api/v1/project/${pid}/spots`),
        (url: string) => {

          return axios.post(url, makeRequest(params), makeJsonRequestHeader())
            .then((response) => {if (good_response(response)) return response.data.data;})
            .catch((e) => console.error(e));

        },
        params);
  };
};



