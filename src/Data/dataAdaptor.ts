/*
 * Convert data entered from ControlPanel Dialog into
 * Backend json format.
 * */


import {
  Project, Spot, SpotRecord, Device, projectKeys, spotKeys, spotRecordKeys,
  deviceKeys
} from './data';
import {DateString} from './datetieStringFormater';


/* Define PanelSpot */
export interface PanelSpot {_kind: "PanelSpot", }
export interface PanelSpot {
  project_id: number,
  spot_name?: string,
  spot_type?: string,
} /* End PanelSpot */


/* Define PanelProject */
export interface PanelProject {_kind: "PanelProject", }
export interface PanelProject {
  started_time?: DateString,
  finished_time?: DateString,
  record_started_from?: DateString,
}
export interface PanelProject {
  construction_company?: string,
  tech_support_company?: string,
  project_company?: string,
}
export interface PanelProject {
  district?: string,
  latitude: number,
  longitude: number,
  province: string,
  city: string,
  area_name: string,
}
export interface PanelProject {
  area?: number,
  demo_area?: number,
  building_height?: number,
  floor?: number,
  building_type?: string,
}
export interface PanelProject {
  project_name: string,
  outdoor_spot?: number,
  description: string,
} /* End PanelProject */


/* Define PanelSpotRecord */
export interface PanelSpotRecord {_kind: "PanelSpotRecord", }
export interface PanelSpotRecord {
  spot_record_time: DateString,
}
export interface PanelSpotRecord {
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
export interface PanelDevice {_kind: "PanelDevice", }
export interface PanelDevice {
  device_name?: string,
  device_type?: string,
}
export interface PanelDevice {
  create_time: DateString,
  modify_time: DateString,
  online?: boolean,
  spot_id: number,
} /* End PanelDevice */
export type PanelDataType =
  | PanelSpot
  | PanelProject
  | PanelDevice
  | PanelSpotRecord ;

/*
 * data structures that are exactly the same as that the server.
 * will be send directly to the server to update or psot.
 */

/* Define PanelDevice*/

export interface ServerProject {_kind: "ServerProject", }
export interface ServerProject {
  location?: {
    province: string,
    city: string,
    climate_area: {area_name: string},
  },
  longitude?: number,
  latitude?: number,
  district?: string,
}
export interface ServerProject {
  tech_support_company?: {company_name: string},
  project_company?: {company_name: string},
  construction_company?: {company_name: string},
}
export interface ServerProject {
  started_time?: DateString,
  finished_time?: DateString,
  record_started_from?: DateString,
}
export interface ServerProject {
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

export interface ServerDevice {_kind: "ServerDevice", }
export interface ServerDevice {
  device_name: string,
  device_type?: string,
  online?: string,
  spot?: number,  // spot id
  create_time?: DateString,
  modify_time?: DateString,
}

export interface ServerSpot {_kind: "ServerSpot", }
export interface ServerSpot {
  project?: number,  // project id
  spot_name?: string,
  spot_type?: string,
  image?: string,
}

export interface ServerSpotRecord {_kind: "ServerSpotRecord", }
export interface ServerSpotRecord {
  spot_record_time: DateString,
  device: number,
  spot_record_id?: number,
  window_opened: boolean,
  temperature: number,
  humidity: number,
  ac_power: number,
  pm25: number,
  co2: number,
}

export type ServerData =
  | ServerDevice
  | ServerSpot
  | ServerSpotRecord
  | ServerProject;


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

