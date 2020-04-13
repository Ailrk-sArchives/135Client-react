import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
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
} from '../../Data/data';
import {PaginationProps} from '../TablePagination';
import ContentCard from '../ContentCard';
import Frame from '../../Frame';
import {useTableParent, PanelOperationTable, Operation} from '../utils/utils';

import {Tablefc} from './TableComponent';

const DeviceTable: React.FC<{}> = (props) => {

  //
  const [devices, setDevices] = useState<Array<Device>>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(5);

  const [totalElementCount, setTotalElementCount] = useState<number>(0);

  const [tickAll, setTickAll] = useState<boolean>(false);

  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);

  const [pageSize, setPageSize] = useState<number>(10);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [tableParent, setTableParent] = useState<ApiDataType | undefined>();

  let {sid} = useParams();
  useTableParent(setTableParent);

  // fetch
  const useInit =
    (paginationRequest: PaginationRequest) => useEffect(() => {
      const resposne: Promise<Array<Device> | FetchedData<Array<Device>>> =
        (sid ?
          IdempotentApis
            .Get
            .PostPayload
            .fetchDeviceBySpot(
              paginationRequest,
              (sid ? Number.parseInt(sid) : 1))
          :
          IdempotentApis
            .Get
            .PostPayload
            .fetchDevice(paginationRequest)
        );

      resposne.then(ds => {
        console.log(ds);
        if ((ds as Array<Device>).length) {
          setDevices(ds as Array<Device>);
          setItemCheckedList((ds as Array<Device>).map(() => false));
        }

        if ((ds as PagedData<Array<Device>>).data) {
          const {totalElementCount, data, currentPage, pageSize} = ds as PagedData<Array<Device>>;
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
  useInit(makePaginationRequest(1, pageSize));

  // useUpdate only happen in paged device query.
  const useUpdate = (paginationRequest: PaginationRequest) => {

    setLoaded(false);
    const resposne: Promise<Array<Device> | FetchedData<Array<Device>>> =
      (sid ?
        IdempotentApis
          .Get
          .PostPayload
          .fetchDeviceBySpot(
            paginationRequest,
            (sid ? Number.parseInt(sid) : 1))
        :
        IdempotentApis
          .Get
          .PostPayload
          .fetchDevice(paginationRequest)
      );

    resposne.then(ds => {
      if ((ds as Array<Device>).length) {
        setDevices(ds as Array<Device>);
        setItemCheckedList((ds as Array<Device>).map(() => false));
      }

      if ((ds as PagedData<Array<Device>>).data) {
        const {totalElementCount, data, currentPage, pageSize} = ds as PagedData<Array<Device>>;
        setDevices(data);
        setCurrentPage(currentPage);
        setTotalElementCount(totalElementCount);
        setTotalPage(Math.floor(totalElementCount / pageSize));
        setItemCheckedList(data.map(() => false));
      }
    })
      .catch(e => {
        setDevices([]);
        setTotalPage(0);
        setTotalElementCount(0);
      })
      .finally(() => setLoaded(true));
  };

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


export default DeviceTable;
