/*
 * Project list
 */
import React, {useState, useEffect} from 'react';
import {Table, Card, Pane, Checkbox, Position, Menu,
  Popover, Text, Button, Icon} from 'evergreen-ui';
import Frame from '../Frame';
import {IdempotentApis, Project} from '../data';
import getZoomRatio from '../utils/winZoom';
import {grapName} from '../utils/utils';
import {Link} from 'react-router-dom';


const PopupMenu:
  React.FC<{
    projectId: number
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
              <Link to={"/Project" + "/" + props.projectId + "/" + "Spots"} style={linkCss}>
                <Menu.Item icon="list-columns">
                  <Text> 查看测点...  </Text>
                </Menu.Item>
              </Link>
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
        <Pane paddingLeft={"10%"} paddingTop={"40%"} height={"100%"} width={"100%"}>
          <Icon icon="more" />
        </Pane>
      </Popover>
    );
  };


const ProjectTable: React.FC<{}> = (props) => {
  const [projects, setProjects] = useState<Array<Project>>([]);

  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);

  useEffect(() => {
    IdempotentApis.Get.projectViewGet()
      .then(ps => {
        setProjects(ps);
        setItemCheckedList(ps.map(() => false));
      })
      .catch(e => console.error(e))
  }, []);

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
            }/>
          </Table.HeaderCell>

          <Table.HeaderCell flexBasis={100} flexShrink={0} flexGrow={0}>
            ID
          </Table.HeaderCell>
          <Table.HeaderCell>
            项目名称
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0}>
            项目地址
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0}>
            区域
          </Table.HeaderCell>
          <Table.HeaderCell>
            负责单位
          </Table.HeaderCell>
          <Table.HeaderCell>
            竣工时间
          </Table.HeaderCell>
          <Table.HeaderCell>
            开始监测时间
          </Table.HeaderCell>
          <Table.HeaderCell flexBasis={100} flexShrink={0} flexGrow={0}>
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
        {projects ?

          projects.map((p, index) => (
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

              <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
              >{grapName(p.project_id)}</Table.Cell>

              <Table.Cell>{grapName(p.project_name)}</Table.Cell>

              <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}
              >{grapName(p.location)}</Table.Cell>

              <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0}>
                {grapName(p.district)}
              </Table.Cell>

              <Table.Cell>{grapName(p.project_company)}</Table.Cell>


              <Table.Cell>{grapName(p.finished_time)}</Table.Cell>

              <Table.Cell>{grapName(p.record_started_from)}</Table.Cell>

              <Table.Cell flexBasis={100} flexShrink={0} flexGrow={0}
              >{<PopupMenu projectId={p.project_id ? p.project_id : 1}/>}</Table.Cell>
            </Table.Row>
          ))
          : <Pane display="flex" alignItems="center" justifyContent="center"> 暂无数据 </Pane>
        }
      </Table.VirtualBody>
    </Table>
  );

  const contentFC: React.FC<{currentZoom: number}> = (props) => (
    <Card background="overlay"
      paddingTop={2}
      paddingLeft={2}
      paddingRight={2}
      paddingBottom={2}
      width="100%"
      height="100%">
      {React.createElement(tableFC)}
    </Card>
  );
  return <Frame children={React.createElement(contentFC)} />
};


export default ProjectTable;
