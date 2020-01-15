import React from 'react';
import {Pane} from 'evergreen-ui';
import Frame from '../Frame';

const ProjectDetail: React.FC<{}> = (props) => {

  const content = (
    <Pane>
    </Pane>
  );

  return <Frame children={content}></Frame>;
};


export default ProjectDetail;
