import React, {useState, useRef, useEffect} from 'react';
import {
  Pane, Menu, Popover, Position, Tab, SearchInput,
  Text, Icon,
} from 'evergreen-ui';
import {
  ApiDataType, Spot, SpotRecord, Project,
  Device, ApiResponse,
} from '../Data/data';
import {PanelDataType} from '../Data/dataAdaptor';
import SubmitDialogue, {SubmitDialogueProps} from './SubmitDialogue';
import ConfirmDialogue, {ConfirmDialogueProps} from './ConfirmDialogue';
import {
  PanelOperationTable,
  ControlHub,
  mapToObject,
  apiDataArrayIsDuplicated
} from './utils/utils';
import {Wait, CallbackProps} from './utils/callbacks';
import {PanelPopupMenuProps} from './utils/utils';
import {Export} from './utils/export';

const _ControlPanel = (controlHub: ControlHub) => {
  /*
   * The layout of control panel.
   *
   * _ControlPanel will dispatch data from controlHub
   * to it's specific subcomponents.
   *
   */
  const titlename: string = controlHub.titlename;
  const confirmed = useRef<boolean>(false);
  const breakSig = useRef<boolean>(false);
  const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
  const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [entries, setEntries] = useState<Map<string, string | undefined>>(new Map());

  const panelPopupMenuProps: PanelPopupMenuProps = {
    confirmed,
    breakSig,
    dataTypeKeys: controlHub.dataTypeKeys,
    shownSubmitDialog,
    setShownSubmitDialog,
    shownConfirmDialog,
    setShownConfirmDialog,
    message,
    setMessage,
    entries,
    setEntries,

    someDatas: controlHub.data,
    setSomeDatas: controlHub.setData,
    panelOperationTable: controlHub.panelOperationTable,

    dataTypeTag: controlHub.dataTypeTag,

  };

  return (
    <Pane height={50}
      width={"100hv"}
      display="flex"
      justifyContent="space-between">

      <Pane
        className="leftTableHeadInfoGroup"
        display="flex">
        <Icon icon="pin"
          marginTop={12}
          marginRight={10}
          size={18} />
        <Text paddingTop={10} size={600}>{titlename} </Text>
      </Pane>

      <Pane
        className="TableButtonGroup"
        display="flex"
        paddingRight={20}>
        <SearchInput placeholder="查询" height={35} />

        <Tab height={35}
          width={35}
          marginRight={10}
          hoverElevation={4}>
          <Icon icon="key-enter"
            height={"100hv"}
            width={"100hv"}
            size={18} />
        </Tab>

        <Tab height={35} width={35}>
          {React.createElement(PanelPopupMenu, panelPopupMenuProps)}
        </Tab>

        <Tab height={35} width={35}>
          <ExportOptionMenu someDatas={controlHub.data}
            titlename={titlename} />
        </Tab>
      </Pane>

    </Pane>
  );
}

const TableControlPanel = (controlHub: ControlHub) => {
  /*
   * Wrapper of control panel
   * Handle the positioning and styling.
   */
  return (
    <Pane background="tint2"
      paddingTop={10}
      paddingButton={10}
      paddingRight={20}
      paddingLeft={20}>
      {React.createElement(_ControlPanel, controlHub)}
    </Pane>
  );
};

/*
 * Panel popup for control panel.
 * post, update will happend here.
 */
const PanelPopupMenu: React.FC<PanelPopupMenuProps> = props => {

  const {
    entries,
    setEntries,
    shownSubmitDialog,
    setShownSubmitDialog,
    shownConfirmDialog,
    setShownConfirmDialog,
    confirmed,
    breakSig,
    dataTypeKeys,
    dataTypeTag,

    message,
    setMessage,

    panelOperationTable,

    setSomeDatas,
    someDatas,
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
    shown: props.shownConfirmDialog,
    setShown: props.setShownConfirmDialog,
    message,
  };

  const linkCss: React.CSSProperties = {
    textDecoration: 'none',
  };


  const post_wrapper = (callbackProps:
    | {
      panelOperationTable: PanelOperationTable,
      panelData: PanelDataType,
    }
    | Function) => {
    // wrap post operation with different types.
    //
    switch (dataTypeTag) {
      case "Spot":
        return () =>
          Wait.post(
            confirmed,
            callbackProps as CallbackProps<Spot>,
            breakSig);

      case "SpotRecord":
        return () =>
          Wait.post(
            confirmed,
            callbackProps as CallbackProps<SpotRecord>,
            breakSig);

      case "Project":
        return () =>
          Wait.post(
            confirmed,
            callbackProps as CallbackProps<Project>,
            breakSig);

      case "Device":
        return () =>
          Wait.post(
            confirmed,
            callbackProps as CallbackProps<Device>,
            breakSig);

      default:
        return undefined
    }
  };

  return (
    <>
      <SubmitDialogue {...submitDialogProps} />
      <ConfirmDialogue {...confirmDialogueProps} />
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item icon="symbol-cross"
                hoverElevation={1}
                activeElevation={2}
                onSelect={() => {
                  setShownSubmitDialog(true);
                  const usepost = post_wrapper(() => {
                    return {
                      panelOperationTable: panelOperationTable,
                      panelData: mapToObject(entries),
                    };
                  });
                  if (usepost !== undefined)
                    usepost()
                      ?.then(res => {
                        if (  // modify ui without reload.
                          setSomeDatas !== undefined &&
                          !apiDataArrayIsDuplicated(
                            someDatas,
                            (res as ApiResponse<ApiDataType>).data))
                          setSomeDatas(
                            someDatas
                              ?.concat(
                                (res as ApiResponse<ApiDataType>).data
                                || []));
                      }).catch(() => undefined);
                }}>
                添加...
                  </Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash"
                intent="danger"
                hoverElevation={3}
                activeElevation={4}
                onSelect={() => {
                  setShownConfirmDialog(true);
                  setMessage("确定要删除所选项目吗？");
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


/*
 * export popup for control panel.
 * To export files into different formats.
 */
const ExportOptionMenu: React.FC<{
  someDatas?: Array<ApiDataType>,
  titlename?: string,
}> = props => {
  const {
    titlename,
    someDatas,
  } = props;

  const linkCss: React.CSSProperties = {
    textDecoration: 'none',
  };

  return (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}
              onSelect={
                () => Export
                  .downloadJson(someDatas, `${titlename ?? "data"}.json`)
              }
            >
              导出 JSON...
            </Menu.Item>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}
              onSelect={
                () => Export
                  .downloadXml(someDatas, `${titlename ?? "data"}.xml`)
              }
            >
              导出 XML...
            </Menu.Item>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}
              onSelect={
                () => Export
                  .downloadXlsx(someDatas, `${titlename ?? "data"}.xlsx`)
              }
            >
              导出 XLSX...
            </Menu.Item>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}
              onSelect={
                () => Export
                  .downloadCsv(someDatas, `${titlename ?? "data"}.csv`)
              }
            >
              导出 CSV...
            </Menu.Item>
          </Menu.Group>
          <Menu.Divider />
        </Menu>
      }
    >
      <Icon icon="export" />
    </Popover>
  );

}

export default TableControlPanel;
