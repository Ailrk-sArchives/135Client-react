import React, {useState, useEffect} from 'react'
import {useParams, useRouteMatch} from 'react-router-dom'
import {
  IdempotentApis,
  NonIdempotentApis,
  Device,
  PagedData,
  makePaginationRequest,
  PaginationRequest,
  ApiDataType,
  deviceKeys,
  HTTPMethods,
  FetchedData,
} from '../../Data/data'
import {PaginationProps} from '../TablePagination'
import ContentCard from '../ContentCard'
import Frame from '../../Frame'
import {PanelOperationTable, Operation} from '../utils/utils'
import {useTableParent} from '../utils/location'

import {Tablefc} from './TableComponent'

const DeviceTable: React.FC<{}> = (props) => {

  const [devices, setDevices] = useState<Array<Device>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(5);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);
  const [tickAll, setTickAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tableParent, setTableParent] = useState<ApiDataType | undefined>();

  useTableParent(setTableParent);

  const useUpdate = (paginationRequest: PaginationRequest) => {
    const response = useResponseDispatcher(makePaginationRequest(1, pageSize))
    useEffect(() => {
      response
        .then(ds => {
          setLoaded(false);
          if ((ds as Array<Device>).length) {
            setDevices(ds as Array<Device>);
            setItemCheckedList((ds as Array<Device>).map(() => false));
          }
          if ((ds as PagedData<Array<Device>>).data) {
            const {totalElementCount, data, currentPage, pageSize} =
              ds as PagedData<Array<Device>>;
            setDevices(data);
            setCurrentPage(currentPage);
            setTotalElementCount(totalElementCount);
            setTotalPage(Math.floor(totalElementCount / pageSize) + 1);
            setItemCheckedList(data.map(() => false));
          }
        })
        .catch(e => {
          setDevices([]);
          setTotalPage(0);
          setTotalElementCount(0);
        })
        .finally(() => setLoaded(true));
    }, []);
  };
  useUpdate(makePaginationRequest(1, pageSize))

  const paginationProps: PaginationProps = {  // set pagination control.
    useUpdate,
    useChangePageSize: setPageSize,
    totalPage,
    pageSize,
    currentPage,
    totalElementCount,
    pageButtonLimit: totalPage > 6 ? 6 : totalPage
  };

  return (<Frame children={
    React.createElement(
      ContentCard(
        {
          titlename: "设备信息",
          tableParent: tableParent,
          paginationProps: paginationProps,
          panelOperationTable: (new Map(
            [
              [
                "post" as HTTPMethods,
                NonIdempotentApis.Post.postDevice as Operation
              ],

              [
                "put" as HTTPMethods,
                IdempotentApis.Put.updateDevice as Operation
              ],

              [
                "delete" as HTTPMethods,
                IdempotentApis.Delete.deleteDevice as Operation
              ]
            ]
          ) as PanelOperationTable),

          dataTypeKeys: deviceKeys,
          dataTypeTag: "Device",
          loaded,
          data: devices,
          setData: setDevices,
          tableFC: Tablefc,
          tickAll,
          setTickAll,
          itemCheckedList,
          setItemCheckedList,
        })
    )} />);
};

type APIPromise = Promise<Array<Device> | FetchedData<Array<Device>>>;
const useResponseDispatcher =
  (paginationRequest: PaginationRequest): APIPromise => {
    const deviceTableMatch = useRouteMatch('/DeviceTable')
    const spotDeviceMatch = useRouteMatch<{sid: string}>('/Spot/:sid/Devices')
    const realtimeMatch = useRouteMatch('/RealTime/Devices')

    if (deviceTableMatch) {
      return IdempotentApis.Get
        .PostPayload
        .fetchDevice(paginationRequest)
    }
    else if (spotDeviceMatch) {
      const {sid} = spotDeviceMatch.params;
      return IdempotentApis.Get
        .PostPayload
        .fetchDeviceBySpot(
          paginationRequest,
          (sid ? Number.parseInt(sid) : 1))
    }
    else if (realtimeMatch) {
      return IdempotentApis
        .Get
        .RealTime
        .getRealtimeDevice()
    }
    return new Promise(() => [])
  }

export default DeviceTable;
