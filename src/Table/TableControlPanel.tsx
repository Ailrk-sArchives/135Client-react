import React from 'react';
import {Pane, Tab, Badge, SearchInput, Button, Text, Icon} from 'evergreen-ui';


const Title: React.FC<{titlename: string}> = (props) => {
  const titlename: string = props.titlename;
  return (
    <Pane height={50} width={"100hv"} display="flex" justifyContent="space-between">
      <Pane className="leftTableHeadInfoGroup" display="flex">

        <Icon icon="pin" marginTop={12} marginRight={10} size={18} />
        <Text paddingTop={10} size={600}>{titlename} </Text>
      </Pane>

      <Pane className="TableButtonGroup" display="flex" paddingRight={20}>

        <SearchInput placeholder="查询" height={35} />

        <Tab height={35} width={35} marginRight={10}>
          <Icon icon="key-enter" height={"100hv"} width={"100hv"} size={18}/>
        </Tab>

        <Tab height={35} width={35}>
          <Icon icon="list" height={"100hv"} width={"100hv"} size={18}/>
        </Tab>

        <Tab height={35} width={35}>
          <Icon icon="export" height={"100hv"} width={"100hv"} size={18}/>
        </Tab>


      </Pane>
    </Pane>
  );
}

const TableControlPanel: React.FC<{}> = (props) => {
  return (
    <Pane background="tint2" paddingTop={10} paddingButton={10}
    paddingRight={20} paddingLeft={20}>
      <Title titlename="Title"/>
    </Pane>
  );
};



export default TableControlPanel
