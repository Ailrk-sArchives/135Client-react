/*
 * The purpose of these Component is to transfer
 * data from Main component downwards to other components
 * like control panel, pagination, tables, etc.
 *
 * */

import React, {useEffect, useState} from 'react';
import {Card} from 'evergreen-ui';

import TablePaginationBar, {PaginationProps} from './TablePagination';
import TableControlPanel from './TableControlPanel';
import {ControlHub, PanelOperationTable} from './utils/utils';
import {
  ApiDataType, apiDataTypeCheck, Spot, Project, Device, SpotRecord,
  DataTypeKeys
} from '../Data/data';
import {PanelDataType} from '../Data/dataAdaptor';

export interface TableFCParams {
  currentZoom: number,
  loaded: boolean,
  data: Array<ApiDataType>,
  setData?: Function,
  panelOperationTable?: PanelOperationTable,
  tickAll: boolean,
  setTickAll: Function,
  tickone: Function;
  itemCheckedList: Array<boolean>,
  setItemCheckedList: Function
};

export type TableFC = React.FC<TableFCParams>;

export interface ContentControlParams {
  titlename?: string,
  tableParent?: ApiDataType,

  paginationProps?: PaginationProps,
  tableFC: TableFC,
  loaded: boolean,
  data: Array<PanelDataType>,
  setData?: Function,
  itemCheckedList: Array<boolean>,
  setItemCheckedList: Function,

  tickAll: boolean,
  setTickAll: Function,
  setShown?: Function,

  dataTypeKeys?: DataTypeKeys,

  panelOperationTable?: PanelOperationTable,

  resourceId?: number

};

const tableParentNameResolver = (props: {
  tableParent?: ApiDataType,
  setTableParentName: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {

  if (props.tableParent !== undefined) {

    switch (apiDataTypeCheck(props.tableParent)) {
      case "Spot":
        props.setTableParentName((props.tableParent as Spot)?.spot_name);
        break;

      case "Project":
        props.setTableParentName((props.tableParent as Project)?.project_name);
        break;

      case "SpotRecord":
        props.setTableParentName(
          (props.tableParent as SpotRecord)?.spot_record_time?.toString());
        break;

      case "Device":
        props.setTableParentName((() => {
          const dt = (props.tableParent as Device)?.device_type;
          const dn = (props.tableParent as Device)?.device_name;

          if (dt !== undefined && dn !== undefined) {
            return `${dn} | ${dt} `;
          }
        })());
        break;

      default:
        props.setTableParentName("");
        break;
    }

  }
}

// render content for a Table Component.
const ContentCard =
  (props: ContentControlParams): React.FC<{currentZoom: number}> => {

    const [tableParentName, setTableParentName] = useState<string | undefined>("");

    // check table Parent types
    useEffect(() =>
      tableParentNameResolver({
        tableParent: props.tableParent,
        setTableParentName: setTableParentName
      }),
      [tableParentName, props.tableParent]);


    const titlename: string = `${props.titlename} > ${tableParentName} `;
    const env = props;

    return (props: {currentZoom: number}) => {  // return FC of content

      const tickone = (index: number) => { // helper function.

        env.setItemCheckedList(
          env.itemCheckedList.slice(0, index)
            .concat([
              !env.itemCheckedList[index]
            ])
            .concat(env.itemCheckedList.slice(index + 1)))
      };


      const controlHub: ControlHub = {
        titlename: titlename,

        panelOperationTable: env.panelOperationTable,
        dataTypeKeys: env.dataTypeKeys,

        data: env.data,
        setData: env.setData,
        resourceId: env.resourceId
      };

      const tableFCParams: TableFCParams = {
        currentZoom: props.currentZoom,
        loaded: env.loaded,

        data: env.data,
        setData: env.setData,

        panelOperationTable: env.panelOperationTable,

        tickAll: env.tickAll,
        setTickAll: env.setTickAll,
        tickone: tickone,

        itemCheckedList: env.itemCheckedList,
        setItemCheckedList: env.setItemCheckedList
      }

      // dispatching data into different subcomponents.
      return (
        <Card background="overlay"
          paddingTop={2}
          paddingLeft={2}
          paddingRight={2}
          paddingBottom={2}
          width="100%"
          height="100%">

          { React.createElement(TableControlPanel, controlHub) }
          { React.createElement(env.tableFC,  tableFCParams) }

          {
            env.paginationProps ?
              React.createElement(TablePaginationBar, env.paginationProps)
              :
              null
          }

        </Card>);

    };
  }



export default ContentCard;
