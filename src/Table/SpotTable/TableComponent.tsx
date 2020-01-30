import React, {useState, useEffect} from 'react';
import {Pane, Menu, Spinner, Text, Table, Position, Icon, Popover, Card, Tab} from 'evergreen-ui';
import {IdempotentApis, Spot, makePaginationRequest, PaginationRequest, ApiDataType} from '../../data';
import Frame from '../../Frame';
import {Link, useParams} from 'react-router-dom';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import ContentCard, {TableFC} from '../ContentCard';
import TablePaginationBar, {PaginationProps}  from '../TablePagination';


export const PopupMenu: React.FC<{
  spot: Spot,
  spots: Array<Spot>,
  setSpots?: Function
}> = (props) => {
  const [deleteMsg, setDeleteMsg] = useState<string>("");
  const spotId = props.spot.spot_id || 1;

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
          <Link to={
            {
              pathname: "/Spot" + "/" + spotId + "/" + "Devices",
              state: { tableParent: props.spot }
            }
          } style={linkCss}>
            <Menu.Item icon="list-columns"> <Text>查看设备... </Text></Menu.Item>
          </Link>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item icon="trash" intent="danger"
              onSelect={
                () => {

                    if (props.setSpots) {
                      IdempotentApis.Delete.spotViewDelete(spotId)
                        .then((res) => setDeleteMsg(res))
                        .catch(e => console.log(e));

                      props.setSpots(
                        props.spots.filter(e => e.spot_id != spotId));
                    }
                  }
                }>
                删除...
            </Menu.Item>
            </Menu.Group>
          </Menu>
        }>
        <Icon icon="more" />
      </Popover>
    );
  }


export const tableFC: TableFC = (props) => (
    <Table background="tint2">
      <Table.Head height={40} elevation={1}>

        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
          onClick={
            () => {
              props.setItemCheckedList(
                props.itemCheckedList.map(() => !props.tickAll))
              props.setTickAll(!props.tickAll);
            }
          }>

          <Pane>
            {props.tickAll ?
              <Icon icon="tick" />
              : <Icon icon="square" />}
          </Pane>
        </Table.Cell>

        <Table.Cell> ID </Table.Cell>
        <Table.Cell> 测点名称 </Table.Cell>
        <Table.Cell> 测点类型 </Table.Cell>
        <Table.Cell> 项目名称 </Table.Cell>
        <Table.Cell> 设备数量 </Table.Cell>
        <Table.Cell> 操作 </Table.Cell>

      </Table.Head>
      {
        props.loaded ?
          <Table.VirtualBody height={
            dynamicHeight(
              props.currentZoom,
              {
                largeScale: 0.35,
                normalScale: 0.56,
                smallScale: 0.65
              } as dynamicHeightProperties
            )
          }>
            {props.data.length > 0 ?

              props.data.map((s, index) => (
                <Table.Row key={index} isSelectable height={70}>

                  <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0}
                    onClick={() => props.tickone(index)} >
                    <Pane>
                      {!props.itemCheckedList[index] ?
                        <Icon icon="square" />
                        :
                        <Icon icon="tick" />
                      }
                    </Pane>
                  </Table.Cell>

                  <Table.Cell>{grapName((s as Spot).spot_id)}</Table.Cell>

                  <Table.Cell>{grapName((s as Spot).spot_name)}</Table.Cell>

                  <Table.Cell>{grapName((s as Spot).spot_type)}</Table.Cell>

                  <Table.Cell> {grapName((s as Spot).project_name)} </Table.Cell>

                  <Table.Cell>{grapName((s as Spot).number_of_device)}</Table.Cell>

                    <Table.Cell>{<PopupMenu spot={s as Spot}
                      spots={props.data as Array<Spot>}
                      setSpots={props.setData}/>}</Table.Cell>
                </Table.Row>
              ))
              : <Pane display="flex" alignItems="center" justifyContent="center"> 暂无数据 </Pane>
            }
          </Table.VirtualBody>


          :
          <Pane display="flex" alignItems="center" justifyContent="center"
            height={
              dynamicHeight(
                props.currentZoom,
                {
                  largeScale: 0.35,
                  normalScale: 0.56,
                  smallScale: 0.65
                } as dynamicHeightProperties
              )}>
            <Spinner />
          </Pane>

      }

    </Table>
  );



