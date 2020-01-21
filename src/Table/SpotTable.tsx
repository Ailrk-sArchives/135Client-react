import React, {useState, useEffect} from 'react';
import {Pane, Menu, Checkbox, Text, Table, Position, Icon, Popover, Card} from 'evergreen-ui';
import {IdempotentApis, Spot, makePaginationRequest, PaginationRequest} from '../data';
import Frame from '../Frame';
import {Link, useParams} from 'react-router-dom';
import {grapName} from '../utils/utils';
import TablePaginationBar, {PaginationProps}  from './TablePagination';


const PopupMenu: React.FC<{
  spotId: number
}> = (props) => {
  const linkCss: React.CSSProperties = {
    textDecoration: 'none',
  };

  return (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon="edit">修改...</Menu.Item>
            <Menu.Item icon="download">下载...</Menu.Item>
          </Menu.Group>
          <Link to={"/Spot" + "/" + props.spotId + "/" + "Devices"} style={linkCss}>
            <Menu.Item icon="list-columns"> <Text>查看设备... </Text></Menu.Item>
          </Link>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item icon="trash" intent="danger">
              删除...
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }>
        <Icon icon="more" />
    </Popover>
  );
}


const SpotTable: React.FC<{}> = (props) => {
  const [spots, setSpots] = useState<Array<Spot>>([]);
  const [totalPage, setTotalPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  let { pid } = useParams();

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
            测点名称
          </Table.HeaderCell>
          <Table.HeaderCell>
            测点类型
          </Table.HeaderCell>
          <Table.HeaderCell>
            项目名称
          </Table.HeaderCell>

          <Table.HeaderCell>
            设备数量
          </Table.HeaderCell>

          <Table.HeaderCell>
            操作
          </Table.HeaderCell>
      </Table.Head>
      <Table.VirtualBody height={
        ((zoom) => {
          if (zoom >= 180) return window.innerHeight * 0.35;
          if (zoom >= 140) return window.innerHeight * 0.45;
          if (zoom >= 80) return window.innerHeight * 0.53;
          return window.innerHeight * 0.75;
        })(props.currentZoom)
      }>
        {spots?

          spots.map((s, index) => (
            <Table.Row key={index} isSelectable height={70}>
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

              <Table.Cell>{grapName(s.spot_id)}</Table.Cell>

              <Table.Cell>{grapName(s.spot_name)}</Table.Cell>

              <Table.Cell>{grapName(s.spot_type)}</Table.Cell>

              <Table.Cell> {grapName(s.project_name)} </Table.Cell>

              <Table.Cell>{grapName(s.number_of_device)}</Table.Cell>

              <Table.Cell>{<PopupMenu spotId={s.spot_id ? s.spot_id : 1}/>}</Table.Cell>
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
  return <Frame children={React.createElement(contentFC)} />

};


export default SpotTable;
