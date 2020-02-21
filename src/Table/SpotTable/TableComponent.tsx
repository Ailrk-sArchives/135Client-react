import React, {useState, useRef, useEffect} from 'react';
import {
  Pane, Menu, Spinner, Text, Table, Position, Icon, Popover, toaster,
  Tab
} from 'evergreen-ui';
import {Spot, spotKeys} from '../../Data/data';
import {Link} from 'react-router-dom';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {TableFC} from '../ContentCard';
import {PanelOperationTable, TablePopupMenuProps} from '../utils/utils'
import {Wait, CallbackProps} from '../utils/callbacks';
import ConfirmDialogue, {ConfirmDialogueProps} from '../ConfirmDialogue';
import SubmitDialogue, {SubmitDialogueProps} from '../SubmitDialogue';


export const PopupMenu: React.FC<TablePopupMenuProps & {data: Spot}> = (props) => {
  const spotId = props.data.spot_id || 1;

  const linkCss: React.CSSProperties = {
    textDecoration: 'none',
  };
  const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
  const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);


  const opCallbackProps: CallbackProps<Spot> = {
    someid: spotId,
    someDatas: props.someDatas as Array<Spot>,
    setSomeData: Function,
    panelOperationTable: props.panelOperationTable
  };

  const submitDialogProps: SubmitDialogueProps = {
    confirmed: props.confirmed,
    dataTypeKeys: props.dataTypeKeys,
    shown: shownSubmitDialog,
    setShown: setShownConfirmDialog,
    entries: props.entries,
    setEntries: props.setEntries
  };

  const confirmDialogueProps: ConfirmDialogueProps = {
    confirmed: props.confirmed,
    shown: shownConfirmDialog,
    setShown: setShownConfirmDialog,
    message: props.message
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
              <Menu.Item icon="edit"
                onSelect={() => {
                  Wait.update(props.confirmed, opCallbackProps)
                    ?.then(() => {
                      if (props.setSomeDatas && props.someDatas)
                        props.setSomeDatas(
                          props.someDatas
                            .filter(e => (e as Spot).spot_id != spotId));
                    })
                    .then(() => props.confirmed.current = false);
                  setShownSubmitDialog(true);
                }}>

                修改...</Menu.Item>
              <Menu.Item icon="download">下载...</Menu.Item>
            </Menu.Group>
            <Link to={
              {
                pathname: "/Spot" + "/" + spotId + "/" + "Devices",
                state: {tableParent: props.data}
              }
            } style={linkCss}>
              <Menu.Item icon="list-columns"> <Text>查看设备... </Text></Menu.Item>
            </Link>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash" intent="danger"
                onSelect={() => {
                  Wait.delete(props.confirmed, opCallbackProps)
                    ?.then(() => {
                      if (props.setSomeDatas && props.someDatas)
                        props.setSomeDatas(
                          props.someDatas
                            .filter(e => (e as Spot).spot_id != spotId));
                    })
                    .then(() => props.confirmed.current = false);
                  props.setMessage("确定要删除吗？");
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

  const [message, setMessage] = useState<string>("");
  const [entries, setEntries] = useState<Map<string, string | undefined>>(new Map());
  const confirmed = useRef<boolean>(false);

  const panelPopupMenuProps: TablePopupMenuProps = {
    confirmed,
    dataTypeKeys: props.dataTypeKeys,
    message,
    setMessage,
    entries,
    setEntries,

    someDatas: props.data,
    setSomeDatas: props.setData,
    panelOperationTable: props.panelOperationTable,

    dataTypeTag: props.dataTypeTag,
  };


  return (

    <Table background="tint2">
      <Table.Head height={40} elevation={1}>

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

        <Table.Cell> ID </Table.Cell>
        <Table.Cell> 测点名称 </Table.Cell>
        <Table.Cell> 测点类型 </Table.Cell>
        <Table.Cell> 项目名称 </Table.Cell>
        <Table.Cell> 设备数量 </Table.Cell>
        <Table.Cell> 操作 </Table.Cell>

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
            {props.data.length > 0 ?

              props.data.map((s, index) => (
                <Table.Row key={index} isSelectable height={70}>

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
}



