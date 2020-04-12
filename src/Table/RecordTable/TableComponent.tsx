import React, {useState, useRef} from 'react';
import {
  Pane, Table, Position, Popover, Menu, Icon,
  Tooltip, Spinner
} from 'evergreen-ui';
import {SpotRecord, ApiResponse} from '../../Data/data';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {TablePopupMenuProps, mapToObject} from '../utils/utils'
import {TableFC} from '../ContentCard';
import {Wait, CallbackProps} from '../utils/callbacks';
import ConfirmDialogue, {ConfirmDialogueProps} from '../ConfirmDialogue';
import SubmitDialogue, {SubmitDialogueProps} from '../SubmitDialogue';


export const PopupMenu:
  React.FC<TablePopupMenuProps & {data: SpotRecord}> = props => {
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

    const spotRecordId = data.spot_record_id || 1;
    const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
    const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);

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
                <Menu.Item icon="edit"
                  onSelect={() => {
                    entries.forEach((val, key) => {
                      if (Object.keys(data).includes(key)) {
                        const v = data[(key as keyof SpotRecord)];
                        setEntries(entries.set(key, v ? v.toString() : undefined));
                      }
                    });

                    Wait.update(confirmed,
                      () => {
                        return {
                          panelOperationTable: panelOperationTable,
                          panelData: mapToObject(entries),
                          someid: spotRecordId,
                        }
                      },
                      breakSig)?.then(res => {

                        if (setSomeDatas && someDatas && res) {
                          const updated = (res as ApiResponse<SpotRecord>).data;
                          setSomeDatas(
                            someDatas.map(
                              e =>
                                (e as SpotRecord)
                                  .spot_record_id === updated?.spot_record_id ?
                                  updated : e))
                        }

                      }).catch(() => undefined);

                    setShownSubmitDialog(true);
                  }

                  }>修改...</Menu.Item>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item icon="trash" intent="danger"
                  onSelect={() => {
                    Wait.delete(confirmed,
                      {
                        someid: spotRecordId,
                        panelOperationTable: panelOperationTable
                      },
                      breakSig)?.then(res => {
                        if (setSomeDatas && someDatas && res)
                          setSomeDatas(
                            someDatas
                              .filter(e =>
                                (e as SpotRecord).spot_record_id != spotRecordId));
                      }).catch(() => undefined);

                    setMessage("确定要删除吗？");
                    setShownConfirmDialog(true);
                  }

                  }>
                  删除...
        </Menu.Item>
              </Menu.Group>
            </Menu>
          }>
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
        <Table.Cell> CO2 </Table.Cell>
        <Table.Cell> PM 2.5 </Table.Cell>
        <Table.Cell> 温度 </Table.Cell>
        <Table.Cell> 湿度 </Table.Cell>
        <Table.Cell> 空调功耗 </Table.Cell>
        <Table.Cell> 窗磁开关 </Table.Cell>
        <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
          记录时间
        </Table.Cell>
        <Table.Cell> 设备ID </Table.Cell>
        <Table.Cell> 操作 </Table.Cell>
      </Table.Head>
      {
        loaded ?
          <Table.VirtualBody
            height=
            {
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
                data.map((r, index) => (
                  <Table.Row key={index} isSelectable height={40}>
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
                    <Table.Cell>{grapName((r as SpotRecord).spot_record_id)}</Table.Cell>
                    <Table.Cell>{grapName((r as SpotRecord).co2)}</Table.Cell>
                    <Table.Cell>{grapName((r as SpotRecord).pm25)}</Table.Cell>
                    <Table.Cell> {grapName((r as SpotRecord).temperature)} </Table.Cell>
                    <Table.Cell>{grapName((r as SpotRecord).humidity)}</Table.Cell>
                    <Table.Cell>{grapName((r as SpotRecord).ac_power)}</Table.Cell>
                    <Table.Cell>
                      <Tooltip content={(r as SpotRecord).window_opened ? "on" : "off"}>
                        {
                          (r as SpotRecord).window_opened ?
                            <Icon icon='dot' color='success' size={20} />
                            : <Icon icon='dot' color="muted" size={20} />}
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                      {grapName((r as SpotRecord).spot_record_time)}
                    </Table.Cell>
                    <Table.Cell>{grapName((r as SpotRecord).device_id)}</Table.Cell>
                    <Table.Cell>
                      {
                        React.createElement(PopupMenu, {
                          ...panelPopupMenuProps,
                          data: (r as SpotRecord),
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



