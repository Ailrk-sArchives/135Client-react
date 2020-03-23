/*
 * Project list
 */
import React, {useState, useEffect} from 'react';
import Frame from '../../Frame';
import {
  IdempotentApis,
  NonIdempotentApis,
  Project,
  projectKeys,
  HTTPMethods,
} from '../../Data/data';
import ContentCard from '../ContentCard';
import {PanelOperationTable, Operation} from '../utils/utils';
import {Tablefc} from './TableComponent';


const ProjectTable: React.FC<{}> = () => {

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
          loaded,
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
                IdempotentApis.Delete.deleteProject as Operation
              ],
            ]
          ) as PanelOperationTable),

          data: projects,
          setData: setProjects,
          dataTypeKeys: projectKeys,
          dataTypeTag: "Project",
          tableFC: Tablefc,
          tickAll,
          setTickAll,
          itemCheckedList,
          setItemCheckedList,
        })
    )} />);

};



export default ProjectTable;
