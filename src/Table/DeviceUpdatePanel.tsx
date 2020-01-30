import React, {useState} from 'react';
import { Pane, SideSheet } from 'evergreen-ui';


const DeviceUpdatePanel:
  React.FC<{did: number, shown: boolean}> = (props) => {

    const deviceUpdateTable: React.FC<{did: number}> = (props) => {

      return <Pane/>;
    }

    const sidesheet: React.FC<{did: number, shown: boolean}> = (props) => {

      return <Pane/>;
    };

    return (<Pane/>);
  };

export default DeviceUpdatePanel;
