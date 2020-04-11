import React, {useState, useRef} from 'react';
import {
  Table, Pane, Position, Menu, Spinner,
  Popover, Icon, Tooltip, Text
} from 'evergreen-ui';
import {Link} from 'react-router-dom';
import {Device, ApiResponse} from '../../Data/data';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {TablePopupMenuProps, mapToObject} from '../utils/utils'
import {Wait, CallbackProps} from '../utils/callbacks';
import {TableFC} from '../ContentCard';
import ConfirmDialogue, {ConfirmDialogueProps} from '../ConfirmDialogue';
import SubmitDialogue, {SubmitDialogueProps} from '../SubmitDialogue';


export const PopupMenu:
  React.FC<TablePopupMenuProps & {data: Device}> = props => {

    const {
      confirmed,
      breakSig,
      dataTypeKeys,
      entries,
      setEntries,
      message,
      setMessage,
      setSomeDatas,
      someDatas,
      data,
      panelOperationTable,
    } = props;

    const deviceId = data.device_id || 1;
    const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
    const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);

    const linkCss: React.CSSProperties = {
      textDecoration: 'none',
    };

    const submitDialogProps: SubmitDialogueProps = {
      confirmed,
      breakSig,
      dataTypeKeys,
      shown: shownSubmitDialog,
      setShown: setShownSubmitDialog,
      entries,
      setEntries,
    };

    const confirmDialogueProps: ConfirmDialogueProps = {
      confirmed,
      breakSig,
      shown: shownConfirmDialog,
      setShown: setShownConfirmDialog,
      message,
    };

    return (
      <>
        {
          React.createElement(SubmitDialogue, submitDialogProps)
        }
        {
          React.createElement(ConfirmDialogue, confirmDialogueProps)
        }
        <Popover
          position={Position.BOTTOM_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <Link to={
                  {
                    pathname: "/Device" + "/" + deviceId + "/" + "SpotRecords",
                    state: {tableParent: props.data}
                  }
                } style={linkCss}>
                  <Menu.Item icon="list-columns">
                    <Text> 查看数据...</Text>
                  </Menu.Item>
                </Link>

                <Menu.Item icon="edit"
                  onSelect={() => {
                    entries.forEach((val, key) => {
                      if (Object.keys(data).includes(key)) {
                        const v = data[(key as keyof Device)];
                        setEntries(entries.set(key, v ? v.toString() : undefined));
                      }
                    });
                    Wait.update(confirmed,
                      () => {
                        return {
                          panelOperationTable: panelOperationTable,
                          panelData: mapToObject(entries),
                          someid: deviceId,
                        }
                      },
                      breakSig)?.then(res => {
                        if (setSomeDatas && someDatas && res) {
                          const updated = (res as ApiResponse<Device>).data;
                          setSomeDatas(
                            someDatas.map(
                              e => (e as Device).device_id === updated?.device_id ?
                                updated : e))
                        }
                      }).catch(() => undefined);
                    setShownSubmitDialog(true);
                  }}
                >修改...</Menu.Item>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item icon="trash"
                  intent="danger"
                  onSelect={() => {
                    entries.forEach((val, key) => {
                      if (Object.keys(data).includes(key)) {
                        const v = data[(key as keyof Device)];
                        setEntries(entries.set(key, v ? v.toString() : undefined));
                      }
                    });
                    Wait.update(confirmed,
                      () => {
                        return {
                          panelOperationTable: panelOperationTable,
                          panelData: mapToObject(entries),
                          someid: deviceId,
                        }
                      },
                      breakSig)?.then(res => {
                        if (setSomeDatas && someDatas && res)
                          setSomeDatas(
                            someDatas
                              .filter(e =>
                                (e as Device).device_id != deviceId));
                      }).catch(() => undefined);
                    setShownSubmitDialog(true);
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
      </>
    );
  };

export const Tablefc: TableFC = (props) => {

  const {
    dataTypeKeys,
    dataTypeTag,
    setItemCheckedList,
    itemCheckedList,
    tickAll,
    tickone,
    setTickAll,
    data,
    setData,
    loaded,
    currentZoom,
    panelOperationTable,
  } = props;

  const [message, setMessage] = useState<string>("");
  const [entries, setEntries] =
    useState<Map<string, string | undefined>>(new Map());
  const confirmed = useRef<boolean>(false);
  const breakSig = useRef<boolean>(false);

  const panelPopupMenuProps: TablePopupMenuProps = {
    confirmed,
    breakSig,
    dataTypeKeys,
    message,
    setMessage,
    entries,
    setEntries,

    someDatas: data,
    setSomeDatas: setData,
    panelOperationTable: panelOperationTable,

    dataTypeTag: dataTypeTag,
  };

  return (
    <Table background="tint2">
      <Table.Head height={70} elevation={1}>
        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
          onClick={
            () => {
              setItemCheckedList(
                itemCheckedList.map(() => !tickAll))
              setTickAll(!tickAll);
            }
          }
        >
          <Pane>
            {tickAll ?
              <Icon icon="tick" />
              : <Icon icon="square" />}
          </Pane>
        </Table.Cell>
        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}> ID </Table.Cell>
        <Table.Cell> 设备名称 </Table.Cell>
        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 设备类型 </Table.Cell>
        <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}> 测点名称 </Table.Cell>
        <Table.Cell> 所属项目 </Table.Cell>
        <Table.Cell flexBasis={170} flexShrink={0} flexGrow={0}> 创建时间 </Table.Cell>
        <Table.Cell flexBasis={170} flexShrink={0} flexGrow={0}> 修改时间 </Table.Cell>
        <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 在线 </Table.Cell>
        <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 操作 </Table.Cell>
      </Table.Head>
      {
        loaded ?
          <Table.VirtualBody height={
            dynamicHeight(
              currentZoom,
              {
                largeScale: 0.35,
                normalScale: 0.56,
                smallScale: 0.65
              } as dynamicHeightProperties
            )
          }>
            {
              data.length > 0 ?
                data.map((d, index) => (
                  <Table.Row key={index} isSelectable height={80}>
                    <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
                      onClick={() => tickone(index)} >
                      <Pane>
                        {!itemCheckedList[index] ?
                          <Icon icon="square" />
                          :
                          <Icon icon="tick" />
                        }
                      </Pane>
                    </Table.Cell>
                    <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}>{grapName((d as Device).device_id)}</Table.Cell>
                    <Table.Cell>{grapName((d as Device).device_name)}</Table.Cell>
                    <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
                    >{grapName((d as Device).device_type)}</Table.Cell>
                    <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                      {grapName((d as Device).spot_name)}
                    </Table.Cell>
                    <Table.Cell>{grapName((d as Device).project_name)}</Table.Cell>
                    <Table.Cell flexBasis={170} flexShrink={0} flexGrow={0}>
                      {grapName((d as Device).create_time)}</Table.Cell>
                    <Table.Cell flexBasis={170} flexShrink={0} flexGrow={0}>
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
                    > {
                        React.createElement(PopupMenu, {
                          ...panelPopupMenuProps,
                          data: (d as Device),
                        })
                      }
                    </Table.Cell>
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
                currentZoom,
                {
                  largeScale: 0.35,
                  normalScale: 0.56,
                  smallScale: 0.65
                } as dynamicHeightProperties
              )}
          >
            <Spinner />
          </Pane>
      }
    </Table>
  );
}
