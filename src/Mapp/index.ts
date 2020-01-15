export interface ProjectInfosCards {  // infos on card on <Map>
  location?: string;
  building_type?: string;
  finished_time?: string;
  construction_company?: string;
  project_company?: string;
};

export interface ProjectInfosAll extends ProjectInfosCards {  // all infos for project
  area?: string;
  building_height?: string;
  demo_area?: string;
  description?: string;
  district?: string;
  floor?: string;
  record_started_from?: string;
  started_time?: string;
  tech_support_company?: string;
};

export const projectInfosInCards: ProjectInfosCards = {
  "location": "地址",
  "construction_company": "施工单位",
  "project_company": "负责单位",
  "building_type": "建筑类型",
  "finished_time": "竣工日期"
};

export const projectInfosAll: ProjectInfosAll = {
  ...projectInfosInCards,
  "started_time": "开工时间",
  "record_started_from": "开始记录时间",
  "building_height": "建筑高度",
  "area": "建筑面积",
  "demo_area": "示范面积",
  "floor": "楼层",
  "district": "街区",
  "tech_support_company": "技术支撑单位",
  "description": "技术亮点"
}


