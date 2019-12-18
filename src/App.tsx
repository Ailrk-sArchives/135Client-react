/* Entrance of the App
*/
import React, { useState, Suspense, lazy } from 'react';
import {Pane, Text, Spinner } from 'evergreen-ui';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import history from './history';

const Mapp: any = lazy(() => import('./Mapp'));
const Table: any = lazy(() => import('./Table'));


const App: React.FC = () => {
  const [logined, setLogined] = useState<boolean>(false); // login info
  const sidebarWidth: number = 200;
  const headerHeight: number = 72;

  const mainStyle: React.CSSProperties = {
    minHeight: 800,
    height: "100hv",
  };

  return ( // routing.
    <Pane className="Main" style={mainStyle}>

      <Header/>
      <Sidebar children={<p>asd</p>}
        sidebarWidth={sidebarWidth}
        headerHeight={headerHeight}/>

      <Pane marginLeft={sidebarWidth}>
        <Router history={history}>
          <Suspense fallback= {
            <Pane alignItems="center" display="flex"
            justifyContent="center" height={600}> <Spinner /> </Pane> }>
            <Switch>
              <Route exact path="/" component={Mapp}/>
              <Route path="/Map" component={Mapp}/>
              <Route path="/Table" component={Table}/>
            </Switch>
          </Suspense>
        </Router>
        <Pane
          height={400} width="100hv" background="tint2"
          margin={0} padding={0}
          bottom={0}> </Pane>

      </Pane>
    </Pane>


  );

};

export default App;
