import React, {useState, useEffect} from 'react';
import {Menu, Spinner, Text, Table, Position, Icon, Popover, Card, Tab} from 'evergreen-ui';
import {
  IdempotentApis, NonIdempotentApis, Spot, makePaginationRequest, PaginationRequest, ApiDataType, spotKeys
} from '../../Data/data';
import Frame from '../../Frame';
import {useParams} from 'react-router-dom';
import ContentCard from '../ContentCard';
import TablePaginationBar, {PaginationProps} from '../TablePagination';
import {tableFC} from './TableComponent';
import {useTableParent, HTTPMethods, PanelOperationTable, Operation} from '../utils/utils';
import * as DataAdaptor from '../../Data/dataAdaptor';


const SpotTable: React.FC<{}> = (props) => {
  const [spots, setSpots] = useState<Array<Spot>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(5);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);

  const [tickAll, setTickAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);

  const [pageSize, setPageSize] = useState<number>(20);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tableParent, setTableParent] = useState<ApiDataType | undefined>();

  let { pid } = useParams();
  useTableParent(setTableParent);

  const useInit = (paginationRequest: PaginationRequest) => useEffect(() => {
    IdempotentApis
    .Get
    .Paged
    .spotByProjectPaged(paginationRequest, (pid ? Number.parseInt(pid) : 1))
      .then(srs => {
        setSpots(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setCurrentPage(srs.currentPage);
        setTotalPage(Math.floor(srs.totalElementCount / srs.pageSize) + 1);
        setItemCheckedList(srs.data.map(() => false));

        setLoaded(true);
      })
      .catch(e => console.error(e))
  }, []);

  useInit(makePaginationRequest(1, pageSize));

  const useUpdate = (paginationRequest: PaginationRequest) => useEffect(() => {
    IdempotentApis
    .Get
    .Paged
    .spotByProjectPaged(paginationRequest, (pid ? Number.parseInt(pid) : 1))
      .then(srs => {
        setSpots(srs.data);
        setTotalElementCount(srs.totalElementCount);
        setCurrentPage(srs.currentPage);
        setTotalPage(Math.floor(srs.totalElementCount / srs.pageSize));
        setItemCheckedList(srs.data.map(() => false));
      })
      .catch(e => console.error(e))
  });

  const useChangePageSize = (pageSize: number) => {
    setTotalPage(pageSize);
  };

  const paginationProps: PaginationProps = {
    useUpdate: useUpdate,
    useChangePageSize: setPageSize,
    pageSize: pageSize,
    totalElementCount: totalElementCount,
    totalPage: totalPage,
    currentPage: currentPage,
    pageButtonLimit: totalPage > 6 ? 6 : totalPage
  };

  const contentFC: React.FC<{currentZoom: number}> = (props) => (
    <Card background="overlay"
      paddingTop={2}
      paddingLeft={2}
      paddingRight={2}
      paddingBottom={2}
      width="100%"
      height="100%">
      {React.createElement(tableFC)}
      {React.createElement(TablePaginationBar, paginationProps)}
    </Card>
  );

  return (<Frame children={
    React.createElement(
      ContentCard(
        {
          titlename: "测点信息",
          paginationProps: paginationProps,
          panelOperationTable: (new Map(
            [
              [
                "post" as HTTPMethods,
                NonIdempotentApis.Post.postSpot as Operation
              ],

              [
                "put" as HTTPMethods,
                IdempotentApis.Put.updateSpot as Operation
              ],

              [
                "delete" as HTTPMethods,
                IdempotentApis.Delete.deleteSpot as Operation
              ],

            ]
          ) as PanelOperationTable),
          tableParent: tableParent,
          loaded: loaded,
          dataTypeKeys: spotKeys,
          data: spots,
          setData: setSpots,
          tableFC: tableFC,
          tickAll: tickAll,
          setTickAll: setTickAll,
          itemCheckedList: itemCheckedList,
          setItemCheckedList: setItemCheckedList,
        })
    )} />);
};


export default SpotTable;
