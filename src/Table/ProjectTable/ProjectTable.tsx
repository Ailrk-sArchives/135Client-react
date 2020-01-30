/*
 * Project list
 */
import React, {useState, useEffect} from 'react';
import {
  Table, Card, Pane, Checkbox, Position, Menu, Spinner,
  Popover, Text, Button, Icon, toaster
} from 'evergreen-ui';
import Frame from '../../Frame';
import {IdempotentApis, Project, ApiDataType} from '../../data';
import {grapName, dynamicHeightProperties, dynamicHeight} from '../../utils/utils';
import ContentCard, {TableFC} from '../ContentCard';
import SubmitSlide from '../SubmitSlide';

import {tableFC, PopupMenu} from './TableComponent';


const ProjectTable: React.FC<{}> = (props) => {
  const [projects, setProjects] = useState<Array<Project>>([]);

  const [tickAll, setTickAll] = useState<boolean>(false);
  const [itemCheckedList, setItemCheckedList] = useState<Array<boolean>>([]);

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    IdempotentApis.Get.projectViewGet()
      .then(ps => {
        setProjects(ps);
        setItemCheckedList(ps.map(() => false));
      })
      .catch(e => console.error(e))
  }, []);

  return (<Frame children={
    React.createElement(
      ContentCard(
        {
          titlename: "示范工程项目信息",
          loaded: loaded,
          data: projects,
          setData: setProjects,
          tableFC: tableFC,
          tickAll: tickAll,
          setTickAll: setTickAll,
          itemCheckedList: itemCheckedList,
          setItemCheckedList: setItemCheckedList,
        })
    )} />);

};



export default ProjectTable;
