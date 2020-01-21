/* Entrance of the App
*/
import React, { useState, Suspense, lazy } from 'react';
import {Pane, Text, Spinner, Icon, defaultTheme } from 'evergreen-ui';
import { Router, Route, Switch } from 'react-router-dom';
import Frame from './Frame';
import Header from './Header';
import Sidebar from './Sidebar/Sidebar';
import history from './history';
import {Rectangle} from 'leaflet';

const Mapp: any = lazy(() => import('./Mapp/Mapp'));
const DeviceTable: any = lazy(() => import('./Table/DeviceTable'));
const ProjectTable: any = lazy(() => import('./Table/ProjectTable'));
const RecordTable: any = lazy(() => import('./Table/RecordTable'));
const SpotTable: any = lazy(() => import('./Table/SpotTable'));
const Test: any = lazy(() => import('./Test'));


const App: React.FC = () => {
  const [logined, setLogined] = useState<boolean>(false); // login info
  const sidebarWidth: number = 220;
  const headerHeight: number = 72;

  const mainStyle: React.CSSProperties = {
    minHeight: 600,
    height: "100hv",
  };

  return ( // routing.
    <Pane className="Main" position="relative" height="100hv">

      <Router history={history}>

        <Header/>
        <Suspense fallback= {
          <Pane alignItems="center" display="flex"
          justifyContent="center" height={800}> <Spinner/> </Pane> }>
          <Switch>
            <Route exact path="/">
              <Sidebar sidebarButtons={
                [
                  ['项目地图', 'map', '/', '展示项目所在地'],
                  ['项目列表', 'panel-table', '/ProjectTable', '展示所有项目'],
                  ['设备列表', 'panel-table', '/DeviceTable', '展示所有设备']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight}/>
            </Route>

              <Route path={["/Map", "/ProjectTable", "/Project/:sid/Spots"]} component={Mapp}>
              <Sidebar sidebarButtons={
                [
                  ['项目地图', 'map', '/', '展示项目所在地'],
                  ['项目列表', 'panel-table', '/ProjectTable', '展示所有项目'],
                  ['设备列表', 'panel-table', '/DeviceTable', '展示所有设备']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight} />

            </Route>

            <Route path={["/DeviceTable", "/Device/:did/SpotRecords", "/Spot/:sid/Devices"]}
              component={DeviceTable}>
              <Sidebar sidebarButtons={
                [
                  ['项目地图', 'map', '/', '展示项目所在地'],
                  ['项目列表', 'panel-table', '/ProjectTable', '展示所有项目'],
                  ['设备列表', 'panel-table', '/DeviceTable', '展示所有设备']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight} />
            </Route>

            <Route path="/Test" component={Test}>
              <Sidebar sidebarButtons={
                [
                  ['测试', '', '/Test', '']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight} />
            </Route>

          </Switch>
        </Suspense>
      </Router>

      <Pane marginLeft={sidebarWidth}>
        <Router history={history}>
          <Suspense fallback= {
            <Pane alignItems="center" display="flex"
            justifyContent="center" height={800}> <Spinner/> </Pane> }>
            <Switch>
              <Route exact path="/" component={Mapp}/>

              <Route path="/Map" component={Mapp}/>

              <Route path="/ProjectTable" component={ProjectTable}/>

              <Route path="/DeviceTable" component={DeviceTable} />

              <Route path="/Device/:did/SpotRecords"
                children={React.createElement(RecordTable)}/>

              <Route path="/Project/:pid/Spots"
                children={React.createElement(SpotTable)}/>

              <Route path="/Spot/:sid/Devices"
                children={React.createElement(DeviceTable)}/>

              <Route path="/Test" component={Test}/>

            </Switch>
          </Suspense>
        </Router>

      </Pane>

    </Pane>

  );

};

export default App;
