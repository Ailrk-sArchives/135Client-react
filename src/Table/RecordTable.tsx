import React, {useState, useEffect} from 'react';
import {Pane, Card, Table, Checkbox, Position, Popover, Menu, Icon, Tooltip} from 'evergreen-ui';
import Frame from '../Frame';
import {IdempotentApis, makePaginationRequest, SpotRecord, PaginationRequest} from '../data';
import {useParams} from 'react-router-dom';
import TablePaginationBar,{PaginationProps} from './TablePagination';
import TableControlPanel from './TableControlPanel';
import {grapName} from '../utils/utils';


const PopupMenu: React.FC<{}> = (props) => {

  return (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon="edit">修改...</Menu.Item>
            <Menu.Item icon="download">下载...</Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item icon="trash" intent="danger">
              删除...
        </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Icon icon="more"/>
    </Popover>
  );
}

const RecordTable: React.FC<{}> = (props) => {
  const [spotRecords, setSpotRecords] = useState<Array<SpotRecord>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);
  const [pageSize, setPageSize] = useState<number>(50);
  let { did } = useParams();

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
      })
      .catch(e => console.error(e))
  }, []);
  useInit(makePaginationRequest(1, pageSize));

  const useUpdate = (paginationRequest: PaginationRequest) => {
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
      })
      .catch(e => console.error(e))
  };


  const tableFC: React.FC<{currentZoom: number}> = (props) => (
    <Table background="tint2">
      <Table.Head height={40} elevation={1}>
          <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>
            <Checkbox label="" checked={checkedAll}
            onChange={
              e => {
                setCheckedAll(e.target.checked);
                setItemCheckedList(itemCheckedList.map(() => e.target.checked))
              }
            }/>
          </Table.HeaderCell>

          <Table.HeaderCell>
            ID
          </Table.HeaderCell>
          <Table.HeaderCell>
            CO2
          </Table.HeaderCell>
          <Table.HeaderCell>
            PM 2.5
          </Table.HeaderCell>
          <Table.HeaderCell>
            温度
          </Table.HeaderCell>
          <Table.HeaderCell>
            湿度
          </Table.HeaderCell>

          <Table.HeaderCell>
            空调功耗
          </Table.HeaderCell>

          <Table.HeaderCell>
            窗磁开关
          </Table.HeaderCell>

          <Table.HeaderCell flexBasis={200} flexShrink={0} flexGrow={0}>
            记录时间
          </Table.HeaderCell>

          <Table.HeaderCell>
            设备ID
          </Table.HeaderCell>
          <Table.HeaderCell>
            操作
          </Table.HeaderCell>
      </Table.Head>
      <Table.VirtualBody height={
        ((zoom) => {
          if (zoom >= 180) return window.innerHeight * 0.35;
          if (zoom >= 140) return window.innerHeight * 0.56;
          if (zoom >= 80) return window.innerHeight * 0.65;
          return window.innerHeight * 0.65;
        })(props.currentZoom)
      }>
        {spotRecords?

          spotRecords.map((r, index) => (
            <Table.Row key={index} isSelectable height={40}>
              <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}>
                <Checkbox label=""
                  checked={
                    itemCheckedList[index]
                  }
                  onChange={
                    e =>
                      setItemCheckedList(
                        itemCheckedList.slice(0, index)
                          .concat([e.target.checked])
                          .concat(itemCheckedList.slice(index + 1)))
                  } />

              </Table.Cell>

              <Table.Cell>{grapName(r.spot_record_id)}</Table.Cell>

              <Table.Cell>{grapName(r.co2)}</Table.Cell>

              <Table.Cell>{grapName(r.pm25)}</Table.Cell>

              <Table.Cell> {grapName(r.temperature)} </Table.Cell>

              <Table.Cell>{grapName(r.humidity)}</Table.Cell>


              <Table.Cell>{grapName(r.ac_power)}</Table.Cell>

              <Table.Cell>
                <Tooltip content={r.window_opened ? "on" : "off"}>
                  {
                    r.window_opened?
                      <Icon icon='dot' color='success' size={20} />
                      : <Icon icon='dot' color="muted" size={20} />}
                </Tooltip>
              </Table.Cell>

              <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                {grapName(r.spot_record_time)}</Table.Cell>

              <Table.Cell>{grapName(r.device_id)}</Table.Cell>

              <Table.Cell>{<PopupMenu />}</Table.Cell>
            </Table.Row>
          ))
          : <Pane display="flex" alignItems="center" justifyContent="center"> 暂无数据 </Pane>
        }
      </Table.VirtualBody>
    </Table>
  );

  const paginationProps: PaginationProps = {
    useUpdate: useUpdate,
    useChangePageSize: setPageSize,
    totalElementCount: totalElementCount,
    totalPage: totalPage,
    pageSize: pageSize,
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
      {React.createElement(TableControlPanel)}
      {React.createElement(tableFC)}
      {React.createElement(TablePaginationBar, paginationProps)}
    </Card>
  );
  return <Frame children={React.createElement(contentFC)} />
};


export default RecordTable;
