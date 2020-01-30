import React, {useState, useEffect} from 'react';
import {
  Table, Pane, Checkbox, Position, Menu, toaster, Stack, Spinner,
  Popover, Icon, Tooltip, Text
} from 'evergreen-ui';
import {Link, useParams, useLocation} from 'react-router-dom';
import {
  IdempotentApis, Device, PagedData, makePaginationRequest, PaginationRequest, Spot,
  ApiDataType
} from '../../data';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {PaginationProps} from '../TablePagination';
import ContentCard, {TableFC} from '../ContentCard';
import Frame from '../../Frame';
import {useTableParent} from '../utils/utils';

import {tableFC, PopupMenu} from './TableComponent';

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

  let {sid} = useParams();
  useTableParent(setTableParent);

  const useInit =
    (paginationRequest: PaginationRequest) => useEffect(() => {
      const resposne: Promise<Array<Device> | PagedData<Array<Device>>> =
        (sid ?
          IdempotentApis
            .Get
            .Paged
            .deviceBySpotPaged(
              paginationRequest,
              (sid ? Number.parseInt(sid) : 1))
          :
          IdempotentApis
            .Get
            .Paged
            .devicePaged(paginationRequest)
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
          setTotalPage(Math.floor(totalElementCount / pageSize) + 1);
          setItemCheckedList(data.map(() => false));
        }

        setLoaded(true);
      })
        .catch(e => console.error(e))
    }, []);
  useInit(makePaginationRequest(1, pageSize));

  // useUpdate only happen in paged device query.
  const useUpdate = (paginationRequest: PaginationRequest) => {

    setLoaded(false);
    const resposne: Promise<Array<Device> | PagedData<Array<Device>>> =
      (sid ?
        IdempotentApis
          .Get
          .Paged
          .deviceBySpotPaged(
            paginationRequest,
            (sid ? Number.parseInt(sid) : 1))
        :
        IdempotentApis
          .Get
          .Paged
          .devicePaged(paginationRequest)
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

      setLoaded(true);
    })
      .catch(e => console.error(e))

  };

  const paginationProps: PaginationProps = {
    useUpdate: useUpdate,
    useChangePageSize: setPageSize,
    totalPage: totalPage,
    pageSize: pageSize,
    currentPage: currentPage,
    totalElementCount: totalElementCount,
    pageButtonLimit: totalPage > 6 ? 6 : totalPage
  };

  return (<Frame children={
    React.createElement(
      ContentCard(
        {
          titlename: "设备信息",
          tableParent: tableParent,
          paginationProps: paginationProps,
          loaded: loaded,
          data: devices,
          setData: setDevices,
          tableFC: tableFC,
          tickAll: tickAll,
          setTickAll: setTickAll,
          itemCheckedList: itemCheckedList,
          setItemCheckedList: setItemCheckedList,
        })
    )} />);
};


export default DeviceTable;
