import React, {useState, useEffect} from 'react';
import {Pane, Card, Table, Checkbox, Position, Popover, Menu, Icon,
  Tooltip, Spinner} from 'evergreen-ui';
import Frame from '../../Frame';
import {IdempotentApis, makePaginationRequest, SpotRecord, PaginationRequest, ApiDataType} from '../../data';
import {useParams} from 'react-router-dom';
import {PaginationProps} from '../TablePagination';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import ContentCard, {TableFC} from '../ContentCard';


export const PopupMenu: React.FC<{
  spotRecordId: number,
  spotRecords: Array<SpotRecord>,
  setSpotRecords?: Function

}> = (props) => {

  const [deleteMsg, setDeleteMsg] = useState<string>("");

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
            <Menu.Item icon="trash" intent="danger"
              onSelect={

                () => {

                  if (props.setSpotRecords) {
                    IdempotentApis.Delete.spotViewDelete(props.spotRecordId)
                      .then((res) => setDeleteMsg(res))
                      .catch(e => console.log(e));

                    props.setSpotRecords(
                      props.spotRecords
                        .filter(e => e.spot_record_id != props.spotRecordId));
                  }
                }

              }>
              删除...
        </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
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
        <Table.Cell> CO2 </Table.Cell>
        <Table.Cell> PM 2.5 </Table.Cell>
        <Table.Cell> 温度 </Table.Cell>
        <Table.Cell> 湿度 </Table.Cell>
        <Table.Cell> 空调功耗 </Table.Cell>
        <Table.Cell> 窗磁开关 </Table.Cell>
        <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
          记录时间
        </Table.Cell>

        <Table.Cell> 设备ID </Table.Cell>
        <Table.Cell> 操作 </Table.Cell>

      </Table.Head>

      {
        props.loaded ?

          <Table.VirtualBody
            height=
            {
              dynamicHeight(
                props.currentZoom,
                {
                  largeScale: 0.35,
                  normalScale: 0.56,
                  smallScale: 0.65
                } as dynamicHeightProperties
              )}
          >
            {
              props.data.length > 0 ?

                props.data.map((r, index) => (
                  <Table.Row key={index} isSelectable height={40} >

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

                    <Table.Cell>{grapName((r as SpotRecord).spot_record_id)}</Table.Cell>

                    <Table.Cell>{grapName((r as SpotRecord).co2)}</Table.Cell>

                    <Table.Cell>{grapName((r as SpotRecord).pm25)}</Table.Cell>

                    <Table.Cell> {grapName((r as SpotRecord).temperature)} </Table.Cell>

                    <Table.Cell>{grapName((r as SpotRecord).humidity)}</Table.Cell>


                    <Table.Cell>{grapName((r as SpotRecord).ac_power)}</Table.Cell>

                    <Table.Cell>
                      <Tooltip content={(r as SpotRecord).window_opened ? "on" : "off"}>
                        {
                          (r as SpotRecord).window_opened ?
                            <Icon icon='dot' color='success' size={20} />
                            : <Icon icon='dot' color="muted" size={20} />}
                      </Tooltip>
                    </Table.Cell>

                    <Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
                      {grapName((r as SpotRecord).spot_record_time)}</Table.Cell>

                    <Table.Cell>{grapName((r as SpotRecord).device_id)}</Table.Cell>

                    <Table.Cell>{
                      <PopupMenu spotRecordId={(r as SpotRecord).spot_record_id || 1}
                      spotRecords={props.data as Array<SpotRecord>}
                      setSpotRecords={props.setData} />
                    }</Table.Cell>
                  </Table.Row>
                ))
                : <Pane display="flex" alignItems="center"
                  justifyContent="center"> 暂无数据 </Pane>
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


