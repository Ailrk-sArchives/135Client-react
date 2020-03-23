/*
 * The purpose of these Component is to transfer
 * data from Main component downwards to other components
 * like control panel, pagination, tables, etc.
 *
 * */

import React, {useEffect, useState} from 'react';
import {Card, Table} from 'evergreen-ui';

import TablePaginationBar, {PaginationProps} from './TablePagination';
import TableControlPanel from './TableControlPanel';
import {ControlHub, PanelOperationTable} from './utils/utils';
import {
  ApiDataType, Spot, Project, Device, SpotRecord, DataTypeKeys,
  ApiDataTypeTag
} from '../Data/data';
import {PanelDataType} from '../Data/dataAdaptor';

type TableFCParams =
  & ControlHub
  & {
    currentZoom: number,

    loaded: boolean,

    itemCheckedList: Array<boolean>,

    setItemCheckedList: Function

    tickAll: boolean,

    setTickAll: Function,

    tickone: Function;
  };

export type TableFC = React.FC<TableFCParams>;

export interface ContentControlParams {
  titlename?: string,

  tableParent?: ApiDataType,

  paginationProps?: PaginationProps,

  tableFC: TableFC,

  loaded: boolean,

  data: Array<ApiDataType>,

  setData: Function,

  itemCheckedList: Array<boolean>,

  setItemCheckedList: Function,

  tickAll: boolean,

  setTickAll: Function,

  setShown?: Function,

  dataTypeKeys?: DataTypeKeys,

  dataTypeTag: ApiDataTypeTag,

  panelOperationTable: PanelOperationTable,

  resourceId?: number

};

function tableParentNameResolver(props: {

  tableParent?: ApiDataType,

  setTableParentName: React.Dispatch<React.SetStateAction<string | undefined>>

}) {
  const {
    tableParent,
    setTableParentName,
  } = props;

  if (tableParent !== undefined) {

    switch (tableParent._kind) {
      case "Spot":
        setTableParentName((tableParent as Spot)?.spot_name);
        break;

      case "Project":
        setTableParentName((tableParent as Project)?.project_name);
        break;

      case "SpotRecord":
        setTableParentName(
          (tableParent as SpotRecord)?.spot_record_time?.toString());
        break;

      case "Device":
        setTableParentName((() => {
          const dt = (tableParent as Device)?.device_type;
          const dn = (tableParent as Device)?.device_name;

          if (dt !== undefined && dn !== undefined) {
            return `${dn} | ${dt} `;
          }
        })());
        break;

      default:
        setTableParentName("");
        break;
    }

  }
}

// render content for a Table Component.
const ContentCard =
  (props: ContentControlParams): React.FC<{currentZoom: number}> => {

    const {
      tableParent,
      titlename,
      itemCheckedList,
      setItemCheckedList,
      tickAll,
      setTickAll,
      dataTypeKeys,
      dataTypeTag,
      data,
      setData,
      loaded,
      resourceId,
      tableFC,
      paginationProps,
      panelOperationTable,
    } = props;
    const Tablefc = tableFC;

    const [tableParentName, setTableParentName] = useState<string | undefined>("");
    // check table Parent types
    useEffect(() =>
      tableParentNameResolver({
        tableParent: tableParent,
        setTableParentName: setTableParentName
      }),
      [tableParentName, tableParent]);

    return (props: {currentZoom: number}) => {  // return FC of content

      const tickone = (index: number) => { // helper function.

        setItemCheckedList(
          itemCheckedList.slice(0, index)
            .concat([
              !itemCheckedList[index]
            ])
            .concat(itemCheckedList.slice(index + 1)))
      };


      const controlHub: ControlHub = {
        titlename: `${titlename} > ${tableParentName} `,

        panelOperationTable,
        dataTypeKeys,

        dataTypeTag,
        data,
        setData,
        resourceId,
      };

      const tableFCParams: TableFCParams = {  // controlHub c TableFCParams
        ...controlHub,
        currentZoom: props.currentZoom,
        loaded,

        tickAll,
        setTickAll,
        tickone,

        itemCheckedList,
        setItemCheckedList,
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
          <TableControlPanel {...controlHub} />
          <Tablefc {...tableFCParams} />
          {
            paginationProps ?
              React.createElement(TablePaginationBar, paginationProps)
              :
              null
          }
        </Card>);

    };
  }


export default ContentCard;
