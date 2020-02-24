import React, {useState, useRef} from 'react';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {
  Table, Pane, Position, Menu, Spinner,
  Popover, Text, Icon,
} from 'evergreen-ui';
import {Project, ApiResponse} from '../../Data/data';
import {TableFC} from '../ContentCard';
import {Link} from 'react-router-dom';
import {TablePopupMenuProps, PanelOperationTable, mapToObject} from '../utils/utils'
import {Wait, CallbackProps} from '../utils/callbacks';
import ConfirmDialogue, {ConfirmDialogueProps} from '../ConfirmDialogue';
import SubmitDialogue, {SubmitDialogueProps} from '../SubmitDialogue';


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
  const [entries, setEntries] = useState<Map<string, string | undefined>>(new Map());

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
      <Table.Head height={70}
        elevation={1}>

        <Table.Cell flexBasis={50}
          flexShrink={0}
          flexGrow={0}
          onClick={
            () => {
              setItemCheckedList(
                itemCheckedList.map(() => !tickAll))
              setTickAll(!tickAll);
            }
          }>

          <Pane>
            {tickAll ?
              <Icon icon="tick" />
              : <Icon icon="square" />}
          </Pane>
        </Table.Cell>

        <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> ID </Table.Cell>
        <Table.Cell> 项目名称 </Table.Cell>
        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 项目地址 </Table.Cell>
        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 区域 </Table.Cell>
        <Table.Cell> 负责单位 </Table.Cell>
        <Table.Cell> 竣工时间 </Table.Cell>
        <Table.Cell> 开始监测时间 </Table.Cell>
        <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 操作 </Table.Cell>

      </Table.Head>
      {
        data ?
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
            {data ?

              data.map((p, index) => (
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

                  <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                  >{grapName((p as Project).project_id)}</Table.Cell>

                  <Table.Cell>{grapName((p as Project).project_name)}</Table.Cell>

                  <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
                  >{grapName((p as Project).location)}</Table.Cell>

                  <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                    {grapName((p as Project).district)}
                  </Table.Cell>

                  <Table.Cell>{grapName((p as Project).project_company)}</Table.Cell>

                  <Table.Cell>{grapName((p as Project).finished_time)}</Table.Cell>

                  <Table.Cell>{grapName((p as Project).record_started_from)}</Table.Cell>

                  <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                  >{
                      React.createElement(PopupMenu, {
                        ...panelPopupMenuProps,
                        data: (p as Project),
                      })
                    } </Table.Cell>
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
                  largeScale: 0.45,
                  normalScale: 0.66,
                  smallScale: 0.75
                } as dynamicHeightProperties
              )}>
            <Spinner />
          </Pane>


      }

    </Table>
  );
}


export const PopupMenu:
  React.FC<TablePopupMenuProps & {data: Project}> = props => {
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

    const projectId = data.project_id || 1;
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
                <Menu.Item icon="edit"
                  onSelect={() => {
                    entries.forEach((val, key) => {
                      if (Object.keys(data).includes(key)) {
                        const v = data[(key as keyof Project)];
                        setEntries(entries.set(key, v ? v.toString() : undefined));
                      }
                    });
                    Wait.update(confirmed,
                      () => {
                        return {
                          panelOperationTable: panelOperationTable,
                          panelData: mapToObject(entries),
                          someid: projectId,
                        }
                      },
                      breakSig)?.then(res => {
                        if (setSomeDatas && someDatas && res) {
                          const updated = (res as ApiResponse<Project>).data;
                          setSomeDatas(
                            someDatas.map(
                              e =>
                                (e as Project).project_id === updated?.project_id ?
                                  updated : e))
                        }
                      }).catch(() => undefined);
                    setShownSubmitDialog(true);
                  }
                  }
                >修改...</Menu.Item>
                <Menu.Item icon="download">下载...</Menu.Item>
                <Link to={
                  {
                    pathname: "/Project" + "/" + projectId + "/" + "Spots",
                    state: {tableParent: props.data}
                  }
                } style={linkCss}>
                  <Menu.Item icon="list-columns">
                    <Text> 查看测点...  </Text>
                  </Menu.Item>
                </Link>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item icon="trash" intent="danger"
                  hoverElevation={2}
                  onSelect={() => {
                    Wait.delete(confirmed,
                      {
                        someid: projectId,
                        panelOperationTable: panelOperationTable
                      },
                      breakSig)?.then(res => {
                        if (setSomeDatas && someDatas && res)
                          setSomeDatas(
                            someDatas
                              .filter(e =>
                                (e as Project).project_id != projectId));
                      }).catch(() => undefined);
                    setMessage("确定要删除吗？");
                    setShownConfirmDialog(true);
                  }}
                >
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


