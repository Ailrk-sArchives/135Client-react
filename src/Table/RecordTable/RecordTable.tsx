import React, {useState, useEffect} from 'react';
import Frame from '../../Frame';
import {
  IdempotentApis,
  NonIdempotentApis,
  makePaginationRequest,
  SpotRecord,
  PaginationRequest,
  ApiDataType,
  HTTPMethods,
  spotRecordKeys,
  PagedData
} from '../../Data/data';
import {useParams} from 'react-router-dom';
import {PaginationProps} from '../TablePagination';
import ContentCard from '../ContentCard';
import {useTableParent, PanelOperationTable, Operation} from '../utils/utils';

import {Tablefc} from './TableComponent';

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

  let {did} = useParams();
  useTableParent(setTableParent);

  const useInit = (paginationRequest: PaginationRequest) => useEffect(() => {
    IdempotentApis
      .Get
      .PostPayload
      .fetchSpotRecord(paginationRequest, (did ? Number.parseInt(did) : 1))
      .then(srs => {
        const pageSize = (srs as PagedData<Array<SpotRecord>>).pageSize;
        const currentPage = (srs as PagedData<Array<SpotRecord>>).currentPage;
        setSpotRecords(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setTotalPage(Math.floor(srs.totalElementCount / pageSize) + 1);
        setCurrentPage(currentPage);
        setItemCheckedList(srs.data.map(() => false));

        setLoaded(true);
      })
      .catch(e => {
        setSpotRecords([]);
        setTotalPage(0);
        setTotalElementCount(0);
        console.error(e);
      })
      .finally(() => setLoaded(true));
  }, []);
  useInit(makePaginationRequest(1, pageSize));

  const useUpdate = (paginationRequest: PaginationRequest) => {
    setLoaded(false);

    IdempotentApis
      .Get
      .PostPayload
      .fetchSpotRecord(paginationRequest, (did ? Number.parseInt(did) : 1))
      .then(srs => {
        const pageSize = (srs as PagedData<Array<SpotRecord>>).pageSize;
        const currentPage = (srs as PagedData<Array<SpotRecord>>).currentPage;
        setSpotRecords(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setTotalPage(Math.floor(srs.totalElementCount / pageSize));
        setCurrentPage(currentPage);
        setItemCheckedList(srs.data.map(() => false));
      })
      .catch(e => {
        setSpotRecords([]);
        setTotalPage(0);
        setTotalElementCount(0);
        console.error(e);
      })
      .finally(() => setLoaded(true));
  };


  const paginationProps: PaginationProps = {
    useUpdate,
    useChangePageSize: setPageSize,
    totalElementCount,
    totalPage,
    pageSize,
    currentPage,
    pageButtonLimit: totalPage > 6 ? 6 : totalPage
  };

  return (<Frame children={
    React.createElement(
      ContentCard(
        {
          titlename: "测点数据",
          paginationProps: paginationProps,
          panelOperationTable: (new Map(
            [
              [
                "post" as HTTPMethods,
                NonIdempotentApis.Post.postSpotRecord as Operation
              ],

              [
                "put" as HTTPMethods,
                IdempotentApis.Put.updateSpotRecord as Operation
              ],

              [
                "delete" as HTTPMethods,
                IdempotentApis.Delete.deleteSpotRecord as Operation
              ],

            ]
          ) as PanelOperationTable),

          tableParent,
          loaded,
          data: spotRecords,
          dataTypeKeys: spotRecordKeys,
          dataTypeTag: "SpotRecord",
          setData: setSpotRecords,
          tableFC: Tablefc,
          tickAll,
          setTickAll,
          itemCheckedList,
          setItemCheckedList,
        })
    )}
  />);
};

export default RecordTable;
