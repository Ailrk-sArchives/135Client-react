/*
   Map components goes here.
 */
import React, {useState, useEffect} from 'react';
import {Pane, Text, Card, Tooltip, Table, Dialog, Stack} from 'evergreen-ui';
import Frame from '../Frame';
import {Map, Marker, TileLayer, Popup, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {IdempotentApis, Project} from '../data';
import {FeatureCollection, Feature} from 'geojson';
import placeholder from '../static/placeholder.png';
import {ProjectInfosCards, ProjectInfosAll,
  projectInfosAll, projectInfosInCards} from '../Mapp/index';
import {grapName} from '../utils/utils';

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


const filterGeoJson =  // filter FeatureCollection type GeoJson.
  (data: FeatureCollection, propertyNames: Array<string>) => {
    data.features = data.features
      .filter((e: Feature) =>
        e.properties ? propertyNames.includes(e.properties.NAME) : null);
    return data;
  };

const tableRow = <T extends any>(e: Array<any>, info: T) => {
  /*
   *  generate row of key-val pairs
   *  @param e:    A tuple of key and value from Object.entries().
   *  @param info: projetInfo.
   */
  const [key, val] = e;

  if (Object.keys(info).includes(key)) {
    const k: keyof ProjectInfosCards = key;
    return (
      <Table.Row key={key}>
        <Table.TextCell> <h5> {info[k]} </h5> </Table.TextCell>
        <Table.TextCell> {grapName(val)} </Table.TextCell>
      </Table.Row>);
  }
};

const Mapp: React.FC<{}> = (props) => {
  // zoom depth of the map
  const [mapzoom, setMapzoom] = useState<number>(5);

  // fetech data in initialize pharse.
  const [projects, setProjects] = useState<Array<Project>>([]);

  useEffect(() => {
    IdempotentApis.Get.projectViewGet().then((ps) => setProjects(ps));
  }, []);

  const chinaGeoJson: FeatureCollection = require('../static/china-province.json');
  const provinces: Array<string> =
    ["江苏", "上海", "浙江", "安徽", "湖南", "湖北", "重庆", "四川"];

  const contentFC: React.FC<{currentZoom: number}> = (props) => (
    <Pane>
      <Card background="overlay"
        paddingTop={5}
        paddingLeft={5}
        paddingRight={5}
        paddingBottom={40}
        width="100%"
        height="100%">
        <MapCanvas mapzoom={mapzoom} projects={projects} currentZoom={props.currentZoom}
          geoJson={filterGeoJson(chinaGeoJson, provinces)} />
        <Pane width="70hv" display="flex" />
        <p style={{color: "#66788A", height: 3, width: 20, fontSize: 6, cursor: "default"}}>
          B y . j    i    m    m    y
              </p>
      </Card>
    </Pane>
  );

  return <Frame children={React.createElement(contentFC)} />;
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
      props.projects.map((p) => p.latitude && p.longitude ?
        (<Marker position={L.latLng(p.latitude, p.longitude)}
          key={p.project_id}
          icon={markerIcon}>
          <Popup>
            <MapPopup project={p} projectInfosInCards={projectInfosInCards}
              setdialogueIsShown={setdialogueIsShown} setdialogueProject={setdialogueProject} />
          </Popup>
        </Marker>
        )
        : null)
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
    projectInfosInCards: ProjectInfosCards,
    setdialogueProject: Function,
    setdialogueIsShown: Function
  }> = (props) => {

    return (
      <Pane width={300} height={470}
        onClick={() => {props.setdialogueProject(props.project); props.setdialogueIsShown(true)}}>
        <Pane> <h4>{props.project.project_name}</h4></Pane>
        <img src={placeholder} alt={placeholder} width={300} height={200} />
        {
          Object.entries(props.project).map(
            (e) => tableRow(e, props.projectInfosInCards))
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
            <Dialog isShown={props.isShown} width={700} hasFooter={false} topOffset="8vmin"
              title={
                props.project ? props.project.project_name : ''
              }

              onCloseComplete={
                () => {
                  props.setdialogueProject(undefined);
                  props.setdialogueIsShown(false)
                }
              }
              preventBodyScrolling>
              <Pane alignItems="center" justifyContent="center" display="flex">
                <img src={placeholder} alt={placeholder} width={500} height={300} />
                <br />
              </Pane>
              {
                (props.project) ?
                  Object.entries(props.project).map((e) =>
                    tableRow(e, props.projectInfosAll))
                  : null
              }
            </Dialog>
        }
      </Stack>
    );
  };

export default Mapp;

