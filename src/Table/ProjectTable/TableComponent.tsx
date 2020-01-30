import React, {useState, useEffect} from 'react';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import {
  Table, Card, Pane, Checkbox, Position, Menu, Spinner,
  Popover, Text, Button, Icon, toaster
} from 'evergreen-ui';
import {IdempotentApis, Project, ApiDataType} from '../../data';
import ContentCard, {TableFC} from '../ContentCard';
import {Link} from 'react-router-dom';


export const tableFC: TableFC = (props) => (
  <Table background="tint2">
    <Table.Head height={70} elevation={1}>

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

      <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> ID </Table.Cell>
      <Table.Cell> 项目名称 </Table.Cell>
      <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 项目地址 </Table.Cell>
      <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}> 区域 </Table.Cell>
      <Table.Cell> 负责单位 </Table.Cell>
      <Table.Cell> 竣工时间 </Table.Cell>
      <Table.Cell> 开始监测时间 </Table.Cell>
      <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}> 操作 </Table.Cell>

    </Table.Head>
    {
      props.data ?

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
          {props.data ?

            props.data.map((p, index) => (
              <Table.Row key={index} isSelectable height={80}>
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

                <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                >{grapName((p as Project).project_id)}</Table.Cell>

                <Table.Cell>{grapName((p as Project).project_name)}</Table.Cell>

                <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
                >{grapName((p as Project).location)}</Table.Cell>

                <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                  {grapName((p as Project).district)}
                </Table.Cell>

                <Table.Cell>{grapName((p as Project).project_company)}</Table.Cell>

                <Table.Cell>{grapName((p as Project).finished_time)}</Table.Cell>

                <Table.Cell>{grapName((p as Project).record_started_from)}</Table.Cell>

                <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
                >{
                    <PopupMenu projectId={(p as Project).project_id || 1}
                      projects={props.data as Array<Project>}
                      setProjects={props.setData} />
                  }</Table.Cell>
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
                largeScale: 0.45,
                normalScale: 0.66,
                smallScale: 0.75
              } as dynamicHeightProperties
            )}>
          <Spinner />
        </Pane>


    }

  </Table>
);


export const PopupMenu:
  React.FC<{
  projectId: number,
  projects: Array<Project>,
  setProjects?: Function,
  }> = (props) => {
    const [deleteMsg, setDeleteMsg] = useState<string>("");

    /* useEffect(() => { */

    /* }, [deleteMsg]); */

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
              <Link to={"/Project" + "/" + props.projectId + "/" + "Spots"} style={linkCss}>
                <Menu.Item icon="list-columns">
                  <Text> 查看测点...  </Text>
                </Menu.Item>
              </Link>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item icon="trash" intent="danger"
                onSelect={
                  () => {

                    if (props.setProjects) {
                      IdempotentApis.Delete.projectViewDelete(props.projectId)
                      .then((res) => setDeleteMsg(res))
                      .catch(e => console.log(e));

                      props.setProjects(
                        props.projects.filter(e => e.project_id != props.projectId));

                    }

                     toaster.danger('删除', {description: deleteMsg});
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
  };


