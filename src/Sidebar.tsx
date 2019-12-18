/* Sidebar
 */

import React from 'react';
import { Pane } from 'evergreen-ui';

const Sidebar:
  React.FC<{children: any,
    sidebarWidth: number,
    headerHeight: number}> = (props) => {

  return (
    <Pane
      position="fixed"
      height={4000}
      width={props.sidebarWidth}
      top={0}
      background="overlay">
      <Pane marginTop={props.headerHeight}>
        {props.children}
      </Pane>
    </Pane>
  );
};

export default Sidebar;
