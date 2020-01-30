import React, {useState, useEffect} from 'react';
import {Pane, Card, Table, Checkbox, Position, Popover, Menu, Icon,
  Tooltip, Spinner} from 'evergreen-ui';
import Frame from '../../Frame';
import {IdempotentApis, makePaginationRequest, SpotRecord, PaginationRequest, ApiDataType} from '../../data';
import {useParams} from 'react-router-dom';
import {PaginationProps} from '../TablePagination';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import ContentCard, {TableFC} from '../ContentCard';
import {useTableParent} from '../utils/utils';

import {tableFC, PopupMenu} from './TableComponent';

const RecordTable: React.FC<{}> = (props) => {
  const [spotRecords, setSpotRecords] = useState<Array<SpotRecord>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);

  const [tickAll, setTickAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);

  const [pageSize, setPageSize] = useState<number>(50);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [tableParent, setTableParent] = useState<ApiDataType | undefined>();

  let { did } = useParams();
  useTableParent(setTableParent);

  const useInit = (paginationRequest: PaginationRequest) => useEffect(() => {
    IdempotentApis
    .Get
    .Paged
    .spotRecordPaged(paginationRequest, (did ? Number.parseInt(did) : 1))
      .then(srs => {
        setSpotRecords(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setTotalPage(Math.floor(srs.totalElementCount/ srs.pageSize) + 1);
        setCurrentPage(srs.currentPage);
        setItemCheckedList(srs.data.map(() => false));

        setLoaded(true);
      })
      .catch(e => console.error(e))
  }, []);
  useInit(makePaginationRequest(1, pageSize));

  const useUpdate = (paginationRequest: PaginationRequest) => {
    setLoaded(false);

    IdempotentApis
    .Get
    .Paged
    .spotRecordPaged(paginationRequest, (did ? Number.parseInt(did) : 1))
      .then(srs => {
        setSpotRecords(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setTotalPage(Math.floor(srs.totalElementCount/ srs.pageSize));
        setCurrentPage(srs.currentPage);
        setItemCheckedList(srs.data.map(() => false));

        setLoaded(true);
      })
      .catch(e => console.error(e))
  };


  const paginationProps: PaginationProps = {
    useUpdate: useUpdate,
    useChangePageSize: setPageSize,
    totalElementCount: totalElementCount,
    totalPage: totalPage,
    pageSize: pageSize,
    currentPage: currentPage,
    pageButtonLimit: totalPage > 6 ? 6 : totalPage
  };

  return (<Frame children={
    React.createElement(
      ContentCard(
      {
        titlename: "测点数据",
        paginationProps: paginationProps,
        tableParent: tableParent,
        loaded: loaded,
        data: spotRecords,
        setData: setSpotRecords,
        tableFC: tableFC,
        tickAll: tickAll,
        setTickAll: setTickAll,
        itemCheckedList: itemCheckedList,
        setItemCheckedList: setItemCheckedList,
      })
    ) } />);
};

export default RecordTable;
