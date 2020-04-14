/* Entrance of the App
*/
import React, {useState, useEffect, Suspense, lazy} from 'react';
import {Pane, Text, Spinner, Icon} from 'evergreen-ui';
import {Router, Route, Switch} from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar/Sidebar';
import history from './history';

const Mapp: any = lazy(() => import('./Mapp/Mapp'));
const DeviceTable: any = lazy(() => import('./Table/DeviceTable/DeviceTable'));
const ProjectTable: any = lazy(() => import('./Table/ProjectTable/ProjectTable'));
const RecordTable: any = lazy(() => import('./Table/RecordTable/RecordTable'));
const SpotTable: any = lazy(() => import('./Table/SpotTable/SpotTable'));
const Test: any = lazy(() => import('./Test'));
const Visualization: any = lazy(() => import('./Vis/Visualization'));
const Login: any = lazy(() => import('./Login'));

const sidebarWidth: number = 220;
const headerHeight: number = 72;

const mainStyle: React.CSSProperties = {
  minHeight: 600,
  height: "100hv",
};

const App: React.FC = () => {
  const [logined, setLogined] = useState<boolean>(false); // login info
  return logined
    ? <LoginedSession />
    : <LoginPageSession setLogined={setLogined} />;
};

const SessionSideBar = () =>
  <Suspense fallback={
    <Pane alignItems="center"
      display="flex"
      justifyContent="center"
      height={800}> <Spinner /> </Pane>}>
    <Switch>
      <Route exact path="/">
        <Sidebar sidebarButtons={
          [
            ['项目地图', 'map', '/Map', '展示项目所在地'],
            ['项目列表', 'panel-table', '/ProjectTable', '展示所有项目'],
            ['设备列表', 'panel-table', '/DeviceTable', '展示所有设备']
          ]
        }
          sidebarWidth={sidebarWidth}
          headerHeight={headerHeight} />

      </Route>

      <Route path={["/Map", "/ProjectTable", "/Project/:sid/Spots"]} component={Mapp}>
        <Sidebar sidebarButtons={
          [
            ['项目地图', 'map', '/Map', '展示项目所在地'],
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
            ['项目地图', 'map', '/Map', '展示项目所在地'],
            ['项目列表', 'panel-table', '/ProjectTable', '展示所有项目'],
            ['设备列表', 'panel-table', '/DeviceTable', '展示所有设备']
          ]
        }
          sidebarWidth={sidebarWidth}
          headerHeight={headerHeight} />
      </Route>

      <Route path="/Visualization" component={Visualization}>
        <Sidebar sidebarButtons={
          [
            ['折线图', '', '/Test', '显示数据折线图'],
            //['柱状图', '', '/Test', '显示数据柱状图'],
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

const SessionContent = () =>
  <Suspense fallback={
    <Pane alignItems="center"
      display="flex"
      justifyContent="center"
      height={800}> <Spinner /> </Pane>}>
    <Switch>
      <Route exact
        path="/"
        component={Mapp} />
      <Route path="/Map"
        component={Mapp} />
      <Route path="/ProjectTable"
        component={ProjectTable} />
      <Route path="/DeviceTable"
        component={DeviceTable} />
      <Route path="/Device/:did/SpotRecords"
        component={RecordTable} />
      <Route path="/Project/:pid/Spots"
        component={SpotTable} />
      <Route path="/Spot/:sid/Devices"
        component={DeviceTable} />
      <Route path="/Visualization"
        component={Visualization} />
      <Route path="/Test"
        component={Test} />
    </Switch>
  </Suspense>


const LoginedSession = () => {
  return (
    <Pane className="Main" position="relative" height="100hv">
      <Router history={history}>
        <Header />
        <SessionSideBar />
      </Router>

      <Pane marginLeft={sidebarWidth}>
        <Router history={history}>
          <SessionContent />
        </Router>
      </Pane>
    </Pane>
  );
}

const LoginPageSession = (props: {
  setLogined: React.Dispatch<React.SetStateAction<boolean>>
}) =>
  <Router history={history}>
    <Route path="/">
      <Suspense fallback={
        <Pane alignItems="center"
          display="flex"
          justifyContent="center"
          height={800}> <Spinner /> </Pane>}>
        <Login setLogined={props.setLogined} />
      </Suspense>
    </Route>
  </Router>

export default App;
