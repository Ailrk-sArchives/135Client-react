import React, {useState, useRef, useEffect} from 'react';
import {
  Pane, Menu, Spinner, Text, Table, Position, Icon, Popover,
  Tab, TableBody
} from 'evergreen-ui';
import {Spot, ApiResponse} from '../../Data/data';
import {Link} from 'react-router-dom';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {TableFC} from '../ContentCard';
import {TablePopupMenuProps, mapToObject} from '../utils/utils'
import {Wait} from '../utils/callbacks';
import ConfirmDialogue, {ConfirmDialogueProps} from '../ConfirmDialogue';
import SubmitDialogue, {SubmitDialogueProps} from '../SubmitDialogue';


export const PopupMenu: React.FC<TablePopupMenuProps & {data: Spot}> = props => {
  const spotId = props.data.spot_id || 1;

  const linkCss: React.CSSProperties = {
    textDecoration: 'none',
  };
  const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
  const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);

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
                  pathname: "/Spot" + "/" + spotId + "/" + "Devices",
                  state: {tableParent: data}
                }
              } style={linkCss}>
                <Menu.Item icon="list-columns"> <Text>查看设备... </Text></Menu.Item>
              </Link>
              <Menu.Item icon="edit"
                onSelect={() => {
                  entries.forEach((val, key) => {
                    if (Object.keys(data).includes(key)) {
                      const v = data[(key as keyof Spot)];
                      setEntries(entries.set(key, v ? v.toString() : undefined));
                    }
                  });
                  Wait.update(confirmed,
                    () => {
                      return {
                        panelOperationTable: panelOperationTable,
                        panelData: mapToObject(entries),
                        someid: spotId,
                      }
                    },
                    breakSig)?.then(res => {
                      if (setSomeDatas && someDatas && res) {
                        const updated = (res as ApiResponse<Spot>).data;
                        setSomeDatas(
                          someDatas.map(
                            e => (e as Spot).spot_id === updated?.spot_id ?
                              updated : e))
                      }
                    }).catch(() => undefined);
                  setShownSubmitDialog(true);
                }}>
                修改...
              </Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash" intent="danger"
                onSelect={() => {
                  Wait.delete(confirmed,
                    {
                      someid: spotId,
                      panelOperationTable: panelOperationTable
                    },
                    breakSig)?.then(res => {
                      if (setSomeDatas && someDatas && res)
                        setSomeDatas(
                          someDatas
                            .filter(e => (e as Spot).spot_id != spotId));
                    }).catch(() => undefined);
                  setMessage("确定要删除吗？");
                  setShownConfirmDialog(true);
                }}>
                删除...
            </Menu.Item>
            </Menu.Group>
          </Menu>
        }>
        <Icon icon="more" />
      </Popover>
    </>
  );
}

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
      <Table.Head height={40} elevation={1}>
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
        <Table.Cell> ID </Table.Cell>
        <Table.Cell> 测点名称 </Table.Cell>
        <Table.Cell> 测点类型 </Table.Cell>
        <Table.Cell> 项目名称 </Table.Cell>
        <Table.Cell> 设备数量 </Table.Cell>
        <Table.Cell> 操作 </Table.Cell>
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
            )}
          >
            {data.length > 0 ?
              data.map((s, index) => (
                <Table.Row key={index} isSelectable height={70}>
                  <Table.Cell flexBasis={50}
                    flexShrink={0}
                    flexGrow={0}
                    onClick={() => tickone(index)}>
                    <Pane>
                      {!itemCheckedList[index] ?
                        <Icon icon="square" />
                        :
                        <Icon icon="tick" />
                      }
                    </Pane>
                  </Table.Cell>
                  <Table.Cell>{grapName((s as Spot).spot_id)}</Table.Cell>
                  <Table.Cell>{grapName((s as Spot).spot_name)}</Table.Cell>
                  <Table.Cell>{grapName((s as Spot).spot_type)}</Table.Cell>
                  <Table.Cell> {grapName((s as Spot).project_name)} </Table.Cell>
                  <Table.Cell>{grapName((s as Spot).number_of_device)}</Table.Cell>
                  <Table.Cell>{
                    React.createElement(PopupMenu, {
                      ...panelPopupMenuProps,
                      data: (s as Spot),
                    })
                  }</Table.Cell>
                </Table.Row>
              ))
              : <Pane display="flex" alignItems="center" justifyContent="center"> 暂无数据 </Pane>
            }
          </Table.VirtualBody>
          :
          <Pane display="flex" alignItems="center" justifyContent="center"
            height={
              dynamicHeight(
                currentZoom,
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
}



