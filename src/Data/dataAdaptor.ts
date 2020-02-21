/*
 * Convert data entered from ControlPanel Dialog into
 * Backend json format.
 * */


import {
  Project, Spot, SpotRecord, Device, projectKeys, spotKeys, spotRecordKeys,
  deviceKeys
} from './data';
import {DateString} from './datetieStringFormater';

export interface PanelDataType {};

/* Define PanelSpot */
export interface PanelSpot extends PanelDataType {_kind: "PanelSpot", }
export interface PanelSpot extends PanelDataType {
  project_id: number,
  spot_name?: string,
  spot_type?: string,
} /* End PanelSpot */


/* Define PanelProject */
export interface PanelProject extends PanelDataType {_kind: "PanelProject", }
export interface PanelProject extends PanelDataType {
  started_time?: DateString,
  finished_time?: DateString,
  record_started_from?: DateString,
}
export interface PanelProject extends PanelDataType {
  construction_company?: string,
  tech_support_company?: string,
  project_company?: string,
}
export interface PanelProject extends PanelDataType {
  district?: string,
  latitude: number,
  longitude: number,
  province: string,
  city: string,
  area_name: string,
}
export interface PanelProject extends PanelDataType {
  area?: number,
  demo_area?: number,
  building_height?: number,
  floor?: number,
  building_type?: string,
}
export interface PanelProject extends PanelDataType {
  project_name: string,
  outdoor_spot?: number,
  description: string,
} /* End PanelProject */


/* Define PanelSpotRecord */
export interface PanelSpotRecord extends PanelDataType {_kind: "PanelSpotRecord", }
export interface PanelSpotRecord extends PanelDataType {
  spot_record_time: DateString,
}
export interface PanelSpotRecord extends PanelDataType {
  ac_power?: number,
  co2?: number,
  pm25?: number,
  device_id?: number,
  humidity?: number,
  temperature?: number,
  window_opened?:
  | "0"
  | "1",
} /* End PanelSpotRecord */

/* Define PanelDevice*/
export interface PanelDevice extends PanelDataType {_kind: "PanelDevice", }
export interface PanelDevice extends PanelDataType {
  device_name?: string,
  device_type?: string,
}
export interface PanelDevice extends PanelDataType {
  create_time: DateString,
  modify_time: DateString,
  online?: boolean,
  spot_id: number,
} /* End PanelDevice */

/*
 * data structures that are exactly the same as that the server.
 * will be send directly to the server to update or psot.
 */
export interface ServerData {};


/* Define PanelDevice*/

export interface ServerProject extends ServerData {_kind: "ServerProject", }
export interface ServerProject extends ServerData {
  location?: {
    province: string,
    city: string,
    climate_area: {area_name: string},
  },
  longitude?: number,
  latitude?: number,
  district?: string,
}
export interface ServerProject extends ServerData {
  tech_support_company?: {company_name: string},
  project_company?: {company_name: string},
  construction_company?: {company_name: string},
}
export interface ServerProject extends ServerData {
  started_time?: DateString,
  finished_time?: DateString,
  record_started_from?: DateString,
}
export interface ServerProject extends ServerData {
  outdoor_spot?: null,  // TODO support later.
  project_name?: string,
  district?: string,
  floor?: number,
  area?: number,
  demo_area?: number,
  building_type?: string,
  building_height?: string,
  description?: string,
} /* End PanelDevice*/

export interface ServerDevice extends ServerData {_kind: "ServerDevice", }
export interface ServerDevice extends ServerData {
  device_name: string,
  device_type?: string,
  online?: string,
  spot?: number,  // spot id
  create_time?: DateString,
  modify_time?: DateString,
}

export interface ServerSpot extends ServerData {_kind: "ServerSpot", }
export interface ServerSpot extends ServerData {
  project?: number,  // project id
  spot_name?: string,
  spot_type?: string,
  image?: string,
}

interface ServerSpotRecord extends ServerData {_kind: "ServerSpotRecord", }
interface ServerSpotRecord extends ServerData {
  spot_record_time: DateString,
  device: number,
  window_opened: boolean,
  temperature: number,
  humidity: number,
  ac_power: number,
  pm25: number,
  co2: number,
}


export class MakeServerData {

  static makeDevice = (data: PanelDevice): ServerDevice => (
    {
      device_name: data.device_name,
      device_type: data.device_type,
      online: data.online,
      spot: data.spot_id,
      create_time: data.create_time,
      modify_time: data.modify_time,
    } as ServerDevice);

  static makeProject = (data: PanelProject): ServerProject => (
    {
      outdoor_spot: null,  // TODO support later.

      location: {
        province: data.province,
        city: data.city,
        climate_area: {area_name: data.area_name},
      },

      tech_support_company: {company_name: data.tech_support_company},
      project_company: {company_name: data.project_company},
      construction_company: {company_name: data.construction_company},
      project_name: data.project_name,
      district: data.district,
      floor: data.floor,
      longitude: data.longitude,
      latitude: data.latitude,
      area: data.area,
      demo_area: data.demo_area,
      building_type: data.building_type,
      building_height: data.building_height,
      started_time: data.started_time,
      finished_time: data.finished_time,
      record_started_from: data.record_started_from,
      description: data.description,

    } as ServerProject);



  static makeSpot = (data: PanelSpot): ServerSpot => (
    {
      project: data.project_id,
      spot_name: data.spot_name,
      spot_type: data.spot_type,
      image: undefined
    } as ServerSpot);


  static makeSpotRecord = (data: PanelSpotRecord): ServerSpotRecord => (
    {
      spot_record_time: data.spot_record_time,
      device: data.device_id,
      window_opened: data.window_opened == "1",
      temperature: data.temperature,
      humidity: data.humidity,
      ac_power: data.ac_power,
      pm25: data.pm25,
      co2: data.co2,
    } as ServerSpotRecord
  )
}

;
