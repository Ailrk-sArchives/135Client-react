/* Reusable Header.
 */
import React, { useState } from 'react';
import {Pane, Strong, Text, Icon, Tab, TabNavigation, IconName} from 'evergreen-ui';
import TabContentResolver, {TabContentTriple} from './utils/TabContentResolver';
import history from './history';

const Header: React.FC = (props) => {
  const fixedHeaderCss: React.CSSProperties = {
    position: "fixed",
    width: "100hv",
    right: 0,
    top: 0,
    left: 0,
    zIndex: 1001
  };


  // redirect to home
  return (
    <div style={fixedHeaderCss}>
      <Pane elevation={3}
        hoverElevation={4}
        activeElevation={4}
        >

        <Pane background="tint2"
          height={72}
          padding={24}
          display="flex"
          justifyContent="space-between">

          <Title titlename={"十三五\"长江流域建筑供暖空调解决方案和相应系统\"云平台"}/>
          <Topnav tablists={[
            ['项目信息', 'office', '/', '项目信息汇总'],
            ['历史数据', 'join-table', '/DeviceTable', '设备列表历史汇总'],
            ['实时数据', 'timeline-line-chart', ,'实时设备数据汇总'] ,
            ['数据分析', 'comparison', , '数据对比及可视化']
          ]}/>
        </Pane>

      </Pane>
    </div>
  );
};

const Title: React.FC<{titlename: string}> = (props) => {
  const titlename: string = props.titlename;
  return (
    <Strong size={500}>
      <Icon icon="cloud" marginRight={16} size={18} />
        {titlename}
    </Strong>
  );

};

const Topnav: React.FC<{tablists: Array<TabContentTriple>}> = (props) => {
  const tablists: Array<TabContentTriple> = props.tablists;

  return (
    <TabNavigation display="flex">
      {
        tablists.map((tab, index) => (
          <TabContentResolver contentList={tab} index={index} key={index} tabwidth={100}/>))
      }
    </TabNavigation>
  );
};

export default Header;
