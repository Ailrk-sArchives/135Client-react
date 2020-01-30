import React, {useState} from 'react';
import {Pane, SideSheet, Table} from 'evergreen-ui';
import {ApiDataType} from '../data';


const SubmitSlide: React.FC<{
  apiAction: (params: ApiDataType, id?: number) => Promise<ApiDataType>,
  shown: boolean
}> = (props) => {

  const [shown, setShown] = useState<boolean>(false);

  // make table for keys of ApiDataType.

  return (
    <React.Fragment>
      <SideSheet isShown={shown} onCloseComplete={() => setShown(false)}>


      </SideSheet>
    </React.Fragment>
  );

};


export default SubmitSlide;
