/* Map components goes here.
 */
import React, { useState } from 'react';
import { Pane, Card } from 'evergreen-ui';
import Frame from './Frame';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';
import { LatLng, latLng } from 'leaflet';
import getZoomRatio from './winZoom';
import 'leaflet/dist/leaflet.css';

const pos: LatLng = latLng(31.544, 111.782);

const Mapp: React.FC<{projectLocs: Array<LatLng> | undefined}> = (props) => {
  const [mapzoom, setMapzoom] = useState<number>(5);
  const [currentZoom, setCurrentzoom] =
    useState<number>(getZoomRatio());
  window.onresize = () => setCurrentzoom(getZoomRatio());

  const content = (
    <Pane>
      <Card background="overlay"
        paddingTop={5}
        paddingLeft={5}
        paddingRight={5}
        paddingBottom={40}
        width="100%"
        height="100%">
        <MapCanvas mapzoom={mapzoom} projectLocs={props.projectLocs}
          currentZoom={currentZoom}/>
      </Card>
    </Pane>
  );

  return <Frame children={content}/> ;
};


const MapCanvas: React.FC<{ mapzoom: number,
  projectLocs: Array<LatLng> | undefined, currentZoom: number }> = (props) => {

  const mapCss: React.CSSProperties = {
    height: ((zoom) => 73000 * (1 / zoom))(props.currentZoom),
    width: "100hv",
  };

  return (
    <Map center={pos} zoom={props.mapzoom} style={mapCss}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
    </Map>
  );
};

export default Mapp;

