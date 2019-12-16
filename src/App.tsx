/* Entrance of the App
*/
import React, { useState, Suspense, lazy } from 'react';
import {Pane, Text, Spinner } from 'evergreen-ui';
import { Router, Route, Switch } from 'react-router-dom';
import Layout from './Layout';
import history from './history';

const Mapp: React.FC = lazy(() => import('./Mapp'));
const Table: React.FC = lazy(() => import('./Table'));


const App: React.FC = () => {
  const [logined, setLogined] = useState<boolean>(false); // login info

  return ( // routing.
    <div>
      <Layout/>
      <Router history={history}>
        <Suspense fallback= {
          <Pane display="flex" alignItems="center"
          justifyContent="center" height={400}> <Spinner /> </Pane> }>
          <Switch>
            <Route exact path="/" component={Mapp}/>
            <Route path="/Map" component={Mapp}/>
            <Route path="/Table" component={Table}/>
          </Switch>
        </Suspense>
      </Router>
    </div>

  );

};

export default App;
