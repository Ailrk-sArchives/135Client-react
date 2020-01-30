import React, {useEffect, useState} from 'react';
import {Card} from 'evergreen-ui';

import TablePaginationBar,{PaginationProps} from './TablePagination';
import TableControlPanel, {ControlHub} from './TableControlPanel';
import {
  ApiDataType, apiDataTypeCheck, Spot, Project, Device, SpotRecord
} from '../data';


export type TableFC = React.FC<{
  currentZoom: number,
  loaded: boolean,
  data: Array<ApiDataType>,
  setData?: Function,
  tickAll: boolean,
  setTickAll: Function,
  tickone: Function;
  itemCheckedList: Array<boolean>,
  setItemCheckedList: Function
}>;


const ContentCard =
  <T extends ApiDataType>(props: {
    titlename?: string,
    tableParent?: ApiDataType,

    paginationProps?: PaginationProps,
    tableFC: TableFC,
    loaded: boolean,
    data: Array<T>,
    setData?: Function,
    itemCheckedList: Array<boolean>,
    setItemCheckedList: Function,

    tickAll: boolean,
    setTickAll: Function,
    shown?: boolean,
    setShown?: Function,

    resourceId?: number

  }): React.FC<{currentZoom: number}> => {

    const [tableParentName, setTableParentName] = useState<string | undefined>("");

    useEffect(() => {

      if (props.tableParent !== undefined) {

        switch (apiDataTypeCheck(props.tableParent)) {
          case "Spot":
            setTableParentName((props.tableParent as Spot)?.spot_name);
            break;

          case "Project":
            setTableParentName((props.tableParent as Project)?.project_name);
            break;

          case "SpotRecord":
            setTableParentName(
              (props.tableParent as SpotRecord)?.spot_record_time?.toString());
            break;

          case "Device":
            setTableParentName((() => {
              const dt = (props.tableParent as Device)?.device_type;
              const dn = (props.tableParent as Device)?.device_name;

              if (dt !== undefined && dn !== undefined) {
                return `${dn} | ${dt} `;
              }
          })());
            break;

          default:
            setTableParentName("N");
            break;
        }

      }
    }, [tableParentName, props.tableParent]);


    const titlename: string = `${props.titlename} > ${tableParentName} `;
    const env = props;

    return (props: {currentZoom: number}) => {


      // TODO
      const controlHub: ControlHub<T> = {
        titlename: titlename,
        data: env.data,
        setData: env.setData,
        shown: env.shown,
        resourceId: env.resourceId
      };

      const tickone = (index: number) => {
        env.setItemCheckedList(
          env.itemCheckedList.slice(0, index)
            .concat([
              !env.itemCheckedList[index]
            ])
            .concat(env.itemCheckedList.slice(index + 1)))
      };

      return (
        <Card background="overlay"
          paddingTop={2}
          paddingLeft={2}
          paddingRight={2}
          paddingBottom={2}
          width="100%"
          height="100%">

          {
            React.createElement(TableControlPanel, controlHub)
          }

          {
            React.createElement(env.tableFC, {
              currentZoom: props.currentZoom,
              loaded: env.loaded,
              data: env.data,
              setData: env.setData,
              tickAll: env.tickAll,
              setTickAll: env.setTickAll,
              tickone: tickone,
              itemCheckedList: env.itemCheckedList,
              setItemCheckedList: env.setItemCheckedList
            })
          }

          {
            env.paginationProps ?
              React.createElement(TablePaginationBar, env.paginationProps)
              : null
          }

        </Card>);

    };
  }



export default ContentCard;
