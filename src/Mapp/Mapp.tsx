/*
   Map components goes here.
 */
import React, {useState, useEffect} from 'react';
import {Pane, Card, Table, Dialog, Stack} from 'evergreen-ui';
import Frame from '../Frame';
import {Map, Marker, TileLayer, Popup, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {projectViewGet, Project, Location} from '../data';
import {FeatureCollection, Feature} from 'geojson';
import getZoomRatio from '../utils/winZoom';
import placeholder from '../static/placeholder.png';

// remove default leaflet icon.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker.png'),
  iconUrl: require('leaflet/dist/images/marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const pos: L.LatLng = L.latLng(31.544, 111.782);

const markerIcon = new L.Icon({
  iconRetinaUrl: require('leaflet/dist/images/marker.png'),
  iconUrl: require('leaflet/dist/images/marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowSize: [58, 85],
  shadowAnchor: [0, 82],
});

interface ProjectInfosInCards {
  location?: string;
  building_type?: string;
  finished_time?: string;
  construction_company?: string;
  project_company?: string;
};

interface ProjectInfosAll extends ProjectInfosInCards {
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

const projectInfosInCards: ProjectInfosInCards = {
  "location": "地址",
  "construction_company": "施工单位",
  "project_company": "负责单位",
  "building_type": "建筑类型",
  "finished_time": "竣工日期"
};

const projectInfosAll: ProjectInfosAll = {
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



const filterGeoJson =  // filter FeatureCollection type GeoJson.
  (data: FeatureCollection, propertyNames: Array<string>) => {
    data.features = data.features
      .filter((e: Feature) => e.properties ? propertyNames.includes(e.properties.NAME) : null);
    return data;
  };

const grapName = (val: string | object | undefined): string | null => {  // val =>
  return ((val != null) ?
    ((typeof val === 'object') ? Object.values(val)[0] : val)
    : null);
}

const tableRow = <T extends any>(e: Array<any>, info: T) => {
  const [key, val] = e;

  if (Object.keys(info).includes(key)) {
    const k: keyof ProjectInfosInCards = key;
    return (
      <Table.Row key={key}>
        <Table.TextCell> <h5> {info[k]} </h5> </Table.TextCell>
        <Table.TextCell> {grapName(val)} </Table.TextCell>
      </Table.Row>);
  }
};



const Mapp: React.FC<{}> = (props) => {
  // zoom depth of the map
  const [currentZoom, getCurrentZoom] = useState<number>(getZoomRatio());
  const [mapzoom, setMapzoom] = useState<number>(5);

  // fetech data in initialize pharse.
  const [projects, setProjects] = useState<Array<Project>>([]);

  window.onresize = () => getCurrentZoom(getZoomRatio());
  document.onfullscreenchange = () => getCurrentZoom(getZoomRatio());

  useEffect(() => {
    projectViewGet().then((ps) => setProjects(ps));
  }, []);

  const chinaGeoJson: FeatureCollection = require('../static/china-province.json');
  const provinces: Array<string> =
    ["江苏", "上海", "浙江", "安徽", "湖南", "湖北", "重庆", "四川"];

  const content = (
    <Pane>
      <Card background="overlay"
        paddingTop={5}
        paddingLeft={5}
        paddingRight={5}
        paddingBottom={40}
        width="100%"
        height="100%">
        <MapCanvas mapzoom={mapzoom}  projects={projects} currentZoom={currentZoom}
          geoJson={filterGeoJson(chinaGeoJson, provinces)}/>
      </Card>
    </Pane>
  );

  return <Frame children={content} />;
};


const MapCanvas:
  React.FC<{
    currentZoom: number,
    mapzoom: number,
    projects: Array<Project>,
    geoJson: FeatureCollection,
  }> = (props) => {

    const [dialogueIsShown, setdialogueIsShown] = useState<boolean>(false);
    const [dialogueProject, setdialogueProject] = useState<Project | undefined>();

    const mapCss: React.CSSProperties = {
      height: ((zoom) => {
        if (zoom >= 180) return window.innerHeight * 0.65;
        if (zoom >= 140) return window.innerHeight * 0.75;
        if (zoom >= 80) return window.innerHeight * 0.83;
        return window.innerHeight * 0.9;
      })(props.currentZoom),
      width: "100hv",
    };

    // create array of markers.
    const projectMarkers: Array<any> = props.projects ?
      props.projects.map((p) =>
        (<Marker position={L.latLng(p.latitude, p.longitude)}
          key={p.project_id}
          icon={markerIcon}>
          <Popup>
            <MapPopup project={p} projectInfosInCards={projectInfosInCards}
              setdialogueIsShown={setdialogueIsShown} setdialogueProject={setdialogueProject} />
          </Popup>
        </Marker>))
      : [];

    return (
      <Map center={pos} zoom={props.mapzoom} style={mapCss}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
        <GeoJSON data={props.geoJson}></GeoJSON>
        {projectMarkers}
        <ProjectInfoDialogue isShown={dialogueIsShown} project={dialogueProject}
        setdialogueIsShown={setdialogueIsShown} setdialogueProject={setdialogueProject}
        projectInfosAll={projectInfosAll}/>
      </Map>
    );
  };


const MapPopup:
  React.FC<{
    project: Project,
    projectInfosInCards: ProjectInfosInCards,
    setdialogueProject: Function,
    setdialogueIsShown: Function
  }> = (props) => {

    return (
      <Pane width={300} height={470}
        onClick={() => {props.setdialogueProject(props.project); props.setdialogueIsShown(true)}}>
        <Pane> <h4>{props.project.project_name}</h4></Pane>
        <img src={placeholder} alt={placeholder} width={300} height={200} />
        {
          Object.entries(props.project).map((e) => tableRow(e, props.projectInfosInCards))
        }
      </Pane>
    );
  };


// dialogue window openned when popup card is clicked.
const ProjectInfoDialogue:
  React.FC<{
    project?: Project,
    isShown: boolean,
    setdialogueIsShown: Function,
    setdialogueProject: Function,
    projectInfosAll: ProjectInfosAll
  }> = (props) => {

    return (
      <Stack value={1100}>
        {
          zindex =>
            <Dialog isShown={props.isShown}  width={700} hasFooter={false} topOffset="8vmin"
              title={props.project ? props.project.project_name : ''}
              onCloseComplete={
                () => {props.setdialogueProject(undefined); props.setdialogueIsShown(false)}
              }
              preventBodyScrolling>
              <Pane alignItems="center" justifyContent="center" display="flex">
                <img src={placeholder} alt={placeholder} width={500} height={300} />
                <br />
              </Pane>
              { (props.project)?
                Object.entries(props.project).map((e) => tableRow(e, props.projectInfosAll))
                : null
              }
            </Dialog>
        }
      </Stack>
    );
  };

export default Mapp;

