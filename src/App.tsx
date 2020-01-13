/* Entrance of the App
*/
import React, { useState, Suspense, lazy } from 'react';
import {Pane, Text, Spinner } from 'evergreen-ui';
import { Router, Route, Switch } from 'react-router-dom';
import Frame from './Frame';
import Header from './Header';
import Sidebar from './Sidebar/Sidebar';
import history from './history';

const Mapp: any = lazy(() => import('./Mapp/Mapp'));
const Table: any = lazy(() => import('./Table/Table'));
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

      <Header/>

      <Router history={history}>

        <Suspense fallback= {
          <Pane alignItems="center" display="flex"
          justifyContent="center" height={800}> <Spinner/> </Pane> }>
          <Switch>
            <Route exact path="/">
              <Sidebar sidebarButtons={
                [
                  ['项目地图', 'map', '/'],
                  ['项目列表', 'panel-table', '/']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight}/>
            </Route>

            <Route path="/Map" component={Mapp}>
              <Sidebar sidebarButtons={
                [
                  ['项目地图', 'map', '/Map']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight} />

            </Route>

            <Route path="/Table" component={Table}>
              <Sidebar sidebarButtons={
                [
                  ['数据表格', 'panel-table', '/Table']
                ]
              }
                sidebarWidth={sidebarWidth}
                headerHeight={headerHeight} />
            </Route>

            <Route path="/Test" component={Test}>
              <Sidebar sidebarButtons={
                [
                  ['测试', '', '/Test']
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
              <Route path="/Table" component={Table}/>
              <Route path="/Test" component={Test}/>
            </Switch>
          </Suspense>
        </Router>

      </Pane>

    </Pane>

  );

};

export default App;
