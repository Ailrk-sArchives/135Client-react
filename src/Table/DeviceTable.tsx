import React, {useState, useEffect} from 'react';
import {Table, Card, Pane, Checkbox, Position, Menu, toaster, Stack,
  Popover, Icon, Tooltip, Text} from 'evergreen-ui';
import {Link, useParams} from 'react-router-dom';
import {IdempotentApis, Device, PagedData, makePaginationRequest, PaginationRequest} from '../data';
import {grapName} from '../utils/utils';
import TablePaginationBar,{PaginationProps} from './TablePagination';
import TableControlPanel from './TableControlPanel';
import Frame from '../Frame';

const PopupMenu:
  React.FC<{
    deviceId: number
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
              <Link to={"/Device" + "/" + props.deviceId + "/" + "SpotRecords"} style={linkCss}>
                <Menu.Item icon="list-columns">
                  <Text> 查看数据...</Text>
                </Menu.Item>
              </Link>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash"
                intent="danger"
                onSelect={
                  () => {
                    toaster.danger('删除设备', {description: '您已成功删除设备'});
                  }}>
                删除...
            </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Icon icon="more" />
      </Popover>
    );
  };

const DeviceTable: React.FC<{}> = (props) => {
  const [devices, setDevices] = useState<Array<Device>>([]);
  const [totalPage, setTotalPage] = useState<number>(5);
  const [totalElementCount, setTotalElementCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  let {sid} = useParams();

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
    })
      .catch(e => console.error(e))
  }, []);
  useInit(makePaginationRequest(1, pageSize));

  // useUpdate only happen in paged device query.
  const useUpdate = (paginationRequest: PaginationRequest) => {

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
    })
      .catch(e => console.error(e))

  };

  const tableFC: React.FC<{currentZoom: number}> = (props) => (
    <Table background="tint2">
      <Table.Head height={70} elevation={1}>
        <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>
          <Checkbox label="" checked={checkedAll}
            onChange={
              e => {
                setCheckedAll(e.target.checked);
                setItemCheckedList(itemCheckedList.map(() => e.target.checked))
              }
            } />
        </Table.HeaderCell>

          <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>
            ID
          </Table.HeaderCell>
          <Table.HeaderCell>
            设备名称
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0}>
            设备类型
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={200} flexShrink={0} flexGrow={0}>
            测点名称
          </Table.HeaderCell>

          <Table.HeaderCell>
            所属项目
          </Table.HeaderCell>

          <Table.HeaderCell flexBasis={100} flexShrink={0} flexGrow={0}>
            创建时间
          </Table.HeaderCell>

          <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0}>
            修改时间
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={100} flexShrink={0} flexGrow={0}>
            在线
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={100} flexShrink={0} flexGrow={0}>
            操作
          </Table.HeaderCell>
      </Table.Head>
      <Table.VirtualBody height={
        ((zoom) => {
          if (zoom >= 180) return window.innerHeight * 0.35;
          if (zoom >= 120) return window.innerHeight * 0.56;
          if (zoom >= 80) return window.innerHeight * 0.65;
          return window.innerHeight * 0.65;
        })(props.currentZoom)
        }>
        {
          devices ?
            devices.map((d, index) => (
              <Table.Row key={index} isSelectable height={80}>
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

                <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
                >{grapName(d.device_id)}</Table.Cell>

                <Table.Cell>{grapName(d.device_name)}</Table.Cell>

                <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
                >{grapName(d.device_type)}</Table.Cell>

                <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                  {grapName(d.spot_name)}
                </Table.Cell>

                <Table.Cell>{grapName(d.project_name)}</Table.Cell>

                <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                  {grapName(d.create_time)}</Table.Cell>

                <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                  {grapName(d.modify_time)}</Table.Cell>

                <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}>
                  <Tooltip content={d.online ? "online" : "offline"}>
                    {
                      d.online ?
                        <Icon icon='dot' color='success' size={20} />
                        : <Icon icon='dot' color="muted" size={20} />}
                  </Tooltip>
                </Table.Cell>

                <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                >{<PopupMenu deviceId={d.device_id ? d.device_id : 1} />}</Table.Cell>
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
    totalPage: totalPage,
    pageSize: pageSize,
    currentPage: currentPage,
    totalElementCount: totalElementCount,
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

  return <Frame children={React.createElement(contentFC)}/>;
};


export default DeviceTable;
