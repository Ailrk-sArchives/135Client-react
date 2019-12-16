/* Map components goes here.
 */
import React, { useState } from 'react';
import { Pane } from 'evergreen-ui';
import Frame from './Frame';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';
import { LatLng, latLng } from 'leaflet';
import './Mapp.css';

const pos: LatLng = latLng(31.544, 111.782);

const Mapp: React.FC<{}> = (props) => {
  const [zoom, setZoom] = useState<number>(6);

  const content = (
    <div>
      <MapCanvas zoom={zoom} />
      <ProvinceTable/>
    </div>
  );

  return <Frame children={content}/> ;
};

const MapCanvas: React.FC<{zoom: number}> = (props) => {

  return (
    <Map center={pos} zoom={props.zoom}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
    </Map>
  );
};

const ProvinceTable: React.FC<{}> = (props) => {
  return ( <Pane></Pane>)
};


export default Mapp;

