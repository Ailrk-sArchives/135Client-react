import React, {useState, useRef} from 'react';
import {
  Pane, Menu, Popover, Position, Tab, SearchInput,
  Text, Icon, toaster
} from 'evergreen-ui';
import {ApiDataType, DataTypeKeys} from '../Data/data';
import SubmitDialogue, {SubmitDialogueProps} from './SubmitDialogue';
import ConfirmDialogue, {ConfirmDialogueProps} from './ConfirmDialogue';
import {Operation, PanelOperationTable, HTTPMethods, ControlHub} from './utils/utils';
import {waitClickAndPost, CallbackProps} from './utils/callbacks';
import {ShownDialogProps} from './utils/dialogStateUtils';

type PanelPopupMenuProps =
  & ShownDialogProps
  & Omit<SubmitDialogueProps, "shown" | "setShown">
  & Omit<ConfirmDialogueProps, "shown" | "setShown">;

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
  const [shownConfirmDialog, setShownConfirmDialog] = useState<boolean>(false);
  const [shownSubmitDialog, setShownSubmitDialog] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [entries, setEntries] = useState<Map<string, string | undefined>>(new Map());

  const panelPopupMenuProps: PanelPopupMenuProps = {
    confirmed,
    dataTypeKeys: controlHub.dataTypeKeys,
    shownSubmitDialog,
    setShownSubmitDialog,
    shownConfirmDialog,
    setShownConfirmDialog,
    message,
    setMessage,
    entries,
    setEntries
  };

  return (
    <Pane height={50} width={"100hv"} display="flex" justifyContent="space-between">

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
          { React.createElement(PanelPopupMenu, panelPopupMenuProps) }
        </Tab>

        <Tab height={35} width={35}>
          <ExportOptionMenu />
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
    <Pane background="tint2" paddingTop={10} paddingButton={10}
      paddingRight={20} paddingLeft={20}>
      { React.createElement(_ControlPanel, controlHub) }
    </Pane>
  );

};


/*
 * Panel popup for control panel.
 * post, update will happend here.
 */
const PanelPopupMenu:
  React.FC<PanelPopupMenuProps> = (props) => {

    const dprops: SubmitDialogueProps = {
      confirmed: props.confirmed,
      dataTypeKeys: props.dataTypeKeys,
      shown: props.shownSubmitDialog,
      setShown: props.setShownConfirmDialog,
      entries: props.entries,
      setEntries: props.setEntries
    };

    const confirmDialogueProps: ConfirmDialogueProps = {
      confirmed: props.confirmed,
      shown: props.shownConfirmDialog,
      setShown: props.setShownConfirmDialog,
      message: props.message,
      setMessage: props.setMessage
    };

    const linkCss: React.CSSProperties = {
      textDecoration: 'none',
    };

    return (
      <>
        {
          React.createElement(SubmitDialogue, dprops)
        }
      {
        React.createElement(ConfirmDialogue, confirmDialogueProps)
      }
        <Popover
          position={Position.BOTTOM_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item icon="symbol-cross"
                  hoverElevation={1}
                  activeElevation={2}
                  onSelect={() => {
                    props.setShownSubmitDialog(true);
                    //waitClickAndPost(props.confirmed, );
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
                    props.setShownConfirmDialog(true);
                    props.setMessage("确定要删除所选项目吗？");
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
  };


/*
 * export popup for control panel.
 * To export files into different formats.
 */
const ExportOptionMenu: React.FC<{}> = (props) => {
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
              activeElevation={2}>
              导出 JSON...
            </Menu.Item>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}>
              导出 XLSX...
            </Menu.Item>
            <Menu.Item icon="download"
              hoverElevation={1}
              activeElevation={2}>
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
