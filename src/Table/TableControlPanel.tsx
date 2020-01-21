import React from 'react';
import {Pane, Text, Icon} from 'evergreen-ui';


const Title: React.FC<{titlename: string}> = (props) => {
  const titlename: string = props.titlename;
  return (
    <Pane height={50} width={300}>
      <Icon icon="pin" marginTop={12} marginRight={10} size={18} />
      <Text>
        {titlename}
      </Text>
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
