import React, {useState, useEffect} from 'react';
import {
  Table, Pane, Checkbox, Position, Menu, toaster, Stack, Spinner,
  Popover, Icon, Tooltip, Text
} from 'evergreen-ui';
import {Link} from 'react-router-dom';
import { IdempotentApis, Device } from '../../Data/data';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {TableFC} from '../ContentCard';


export const PopupMenu:
  React.FC<{
    device: Device,
    devices: Array<Device>,
    setDevices?: Function,
  }> = (props) => {
    const [deleteMsg, setDeleteMsg] = useState<string>("");
    const deviceId = props.device.device_id || 1;

    const linkCss: React.CSSProperties = {
      textDecoration: 'none',
    };

    return (
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item icon="edit">修改...</Menu.Item>
              <Menu.Item icon="download">下载...</Menu.Item>
              <Link to={
                {
                  pathname: "/Device" + "/" + deviceId + "/" + "SpotRecords",
                  state: {tableParent: props.device}
                }
              } style={linkCss}>
                <Menu.Item icon="list-columns">
                  <Text> 查看数据...</Text>
                </Menu.Item>
              </Link>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash"
                intent="danger"
                onSelect={
                  () => {

                    if (props.setDevices) {
                      IdempotentApis.Delete.deviceViewDelete(deviceId)
                        .then((res) => setDeleteMsg(res))
                        .catch(e => console.log(e));

                      props.setDevices(
                        props.devices.filter(e => e.device_id != deviceId));
                    }
                  }

                }>

                删除...
            </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Icon icon="more" />
      </Popover>
    );
  };


export const tableFC: TableFC = (props) => (
  <Table background="tint2">

    <Table.Head height={70} elevation={1}>

      <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
        onClick={
          () => {
            props.setItemCheckedList(
              props.itemCheckedList.map(() => !props.tickAll))
            props.setTickAll(!props.tickAll);
          }
        }>

        <Pane>
          {props.tickAll ?
            <Icon icon="tick" />
            : <Icon icon="square" />}
        </Pane>
      </Table.Cell>

      <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}> ID </Table.Cell>
      <Table.Cell> 设备名称 </Table.Cell>
      <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 设备类型 </Table.Cell>
      <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}> 测点名称 </Table.Cell>

      <Table.Cell> 所属项目 </Table.Cell>

      <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 创建时间 </Table.Cell>

      <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 修改时间 </Table.Cell>
      <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 在线 </Table.Cell>
      <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 操作 </Table.Cell>

    </Table.Head>

    {
      props.loaded ?

        <Table.VirtualBody height={
          dynamicHeight(
            props.currentZoom,
            {
              largeScale: 0.35,
              normalScale: 0.56,
              smallScale: 0.65
            } as dynamicHeightProperties
          )
        }>

          {
            props.data.length > 0 ?
              props.data.map((d, index) => (
                <Table.Row key={index} isSelectable height={80}>

                  <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
                    onClick={() => props.tickone(index)} >
                    <Pane>
                      {!props.itemCheckedList[index] ?
                        <Icon icon="square" />
                        :
                        <Icon icon="tick" />
                      }
                    </Pane>
                  </Table.Cell>

                  <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
                  >{grapName((d as Device).device_id)}</Table.Cell>

                  <Table.Cell>{grapName((d as Device).device_name)}</Table.Cell>

                  <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
                  >{grapName((d as Device).device_type)}</Table.Cell>

                  <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                    {grapName((d as Device).spot_name)}
                  </Table.Cell>

                  <Table.Cell>{grapName((d as Device).project_name)}</Table.Cell>

                  <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                    {grapName((d as Device).create_time)}</Table.Cell>

                  <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                    {grapName((d as Device).modify_time)}</Table.Cell>

                  <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}>
                    <Tooltip content={(d as Device).online ? "online" : "offline"}>
                      {
                        (d as Device).online ?
                          <Icon icon='dot' color='success' size={20} />
                          :
                          <Icon icon='dot' color="muted" size={20} />
                      }
                    </Tooltip>
                  </Table.Cell>

                  <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                  >{
                      <PopupMenu device={d as Device}
                        devices={props.data as Array<Device>}
                        setDevices={props.setData} />

                    }</Table.Cell>

                </Table.Row>
              ))
              :
              <Pane display="flex"
                alignItems="center"
                justifyContent="center"> 暂无数据 </Pane>
          }

        </Table.VirtualBody>

        :
        <Pane display="flex"
          alignItems="center"
          justifyContent="center"
          height={
            dynamicHeight(
              props.currentZoom,
              {
                largeScale: 0.35,
                normalScale: 0.56,
                smallScale: 0.65
              } as dynamicHeightProperties
            )}>
          <Spinner />
        </Pane>

    }
  </Table>
);

