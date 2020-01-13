/* Sidebar
 */

import React, {useState} from 'react';
import {Pane, TabNavigation, Tab, Text, Icon, IconName, TableHeadProps} from 'evergreen-ui';
import {Link} from 'react-router-dom';


export type TabName = string;
export type TabIcon = Icon | IconName | string;
export type TabHref = Link | string | undefined;

export interface FixedLengthArray
  <T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
};
export interface TypedTriple<T extends any, U extends any, P extends any>
  extends FixedLengthArray<T | U | P, 3> {
  0: T; 1: U; 2: P;
};
export type TabContentTriple = TypedTriple<TabName, TabIcon, TabHref>;


const TabContentResolver:
  React.FC<{contentList: TabContentTriple}> = (props) => {
  const [tabName, tabIcon, tabHerf] = props.contentList;
  // TODO return differnet from of tabs based on input type
  return <Pane/>;
};


/*                   <Tab key={index} */
/*                     height={50} */
/*                     id={tab} */
/*                     size={600} */
/*                     width={props.sidebarWidth} */
/*                     isSelected={index === selectedTabIndex} */
/*                     onClick={() => setSelectedTabIndex(index)}> */

/*                     <Icon icon={tab[1] as IconName} marginLeft={"5%"}/> */
/*                       { */

/*                         <Text size={400} marginLeft={6}> {tab[0]} </Text> */
/*                       } */
/*                   </Tab> */


const Sidebar:
  React.FC<{
    sidebarWidth: number,
    headerHeight: number,
    sidebarButtons?: Array<TabContentList>
  }> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>();

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
                props.sidebarButtons.map((tab, index) => <TabContentResolver contentList={tab}/>)
                : null
            }
          </TabNavigation>
        </Pane>
      </Pane>
    );
  };

export default Sidebar;
