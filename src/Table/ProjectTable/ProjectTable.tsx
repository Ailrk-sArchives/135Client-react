/*
 * Project list
 */
import React, {useState, useEffect} from 'react';
import Frame from '../../Frame';
import {IdempotentApis, NonIdempotentApis, Project, ApiDataType, projectKeys} from '../../Data/data';
import ContentCard, {TableFC} from '../ContentCard';
import {HTTPMethods, PanelOperationTable, Operation} from '../utils/utils';
import * as DataAdaptor from '../../Data/dataAdaptor';

import {tableFC} from './TableComponent';


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
          panelOperationTable: (new Map(
            [
              [
                "post" as HTTPMethods,
                NonIdempotentApis.Post.postProject as Operation
              ],

              [
                "put" as HTTPMethods,
                IdempotentApis.Put.updateProject as Operation
              ],

              [
                "delete" as HTTPMethods,
                IdempotentApis.Delete.deleteDevice as Operation
              ],
            ]
          ) as PanelOperationTable),

          data: projects,
          setData: setProjects,
          dataTypeKeys: projectKeys,
          tableFC: tableFC,
          tickAll: tickAll,
          setTickAll: setTickAll,
          itemCheckedList: itemCheckedList,
          setItemCheckedList: setItemCheckedList,
        })
    )} />);

};



export default ProjectTable;
