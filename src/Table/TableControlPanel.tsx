import React from 'react';
import {
  Pane, Menu, Popover, Position, Tab, Badge, SearchInput,
  Button, Text, Icon, toaster
} from 'evergreen-ui';
import {ApiDataType} from '../data';


export interface ControlHub<T extends ApiDataType> {
  data?: Array<T>,
  setData?: Function,
  shown?: boolean,
  titlename: string,
  resourceId?: number
};


const PopupMenu:
  React.FC<{
    resourceId?: number
  }> = (props) => {
    const linkCss: React.CSSProperties = {
      textDecoration: 'none',
    };

    return (
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item icon="download">添加...</Menu.Item>
              <Menu.Item icon="download">下载...</Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash"
                intent="danger"
                onSelect={
                  () => {
                    toaster.danger('删除设备', {description: '您已成功删除'});
                  }}>
                删除...
            </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Icon icon="list" />
      </Popover>
    );
  };



const _ControlPanel: React.FC<{titlename: string, resourceId?: number}> = (props) => {
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
          <PopupMenu resourceId={props.resourceId}/>
        </Tab>

        <Tab height={35} width={35}>
          <Icon icon="export" height={"100hv"} width={"100hv"} size={18}/>
        </Tab>
      </Pane>

    </Pane>
  );
}

const TableControlPanel =
  <T extends ApiDataType>(props: ControlHub<T>) => {

  return (
    <Pane background="tint2" paddingTop={10} paddingButton={10}
    paddingRight={20} paddingLeft={20}>
      <_ControlPanel titlename={props.titlename} resourceId={props.resourceId}/>
    </Pane>
  );

};



export default TableControlPanel;
