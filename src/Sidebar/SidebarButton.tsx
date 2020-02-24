import React from 'react';
import {Pane} from 'evergreen-ui';


// button used to route between different components within the same url.
const SidebarButton:
  React.FC<{
    children: any,
    routeTo?: string,
    sidebarWidth: number
  }> = (props) => {

    return (
      <Pane width={props.sidebarWidth}
        display="flex"
        justifyContent="center"
        alignItems="center"
        elevation={2}
        hoverElevation={3}
        height={70}
        background="tint2"
        border>
        {props.children}
      </Pane>
    );
  };


export default SidebarButton;
