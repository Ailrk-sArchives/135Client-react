/* Sidebar
 */

import React, {useState} from 'react';
import {Pane, TabNavigation} from 'evergreen-ui';
import TabContentResolver, {TabContentTriple} from '../utils/TabContentResolver';


const Sidebar:
  React.FC<{
    sidebarWidth: number,
    headerHeight: number,
    sidebarButtons?: Array<TabContentTriple>
  }> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

    return (
      <Pane
        position="fixed"
        height={4000}
        width={props.sidebarWidth}
        top={0}
        background="tint1"
        border>
        <Pane marginTop={props.headerHeight + 20}>
          <TabNavigation marginX={-6} marginY={10} marginBottom={16}>
            {
              props.sidebarButtons ?
                props.sidebarButtons.map((tab, index) =>
                  <TabContentResolver contentList={tab} selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex} index={index} key={index}
                    tabwidth={props.sidebarWidth}
                    tabHeigh={55}/>)
                : null
            }
          </TabNavigation>
        </Pane>
      </Pane>
    );
  };

export default Sidebar;
