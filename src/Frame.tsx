/* Frame to hold components.
*/
import React, {useState} from 'react';
import {Pane} from 'evergreen-ui';
import getZoomRatio from './utils/winZoom';


export type FrameComponent = React.FunctionComponentElement<{currentZoom: number}>

const Frame: React.FC<{children: FrameComponent}> = (props) => {

  const [currentZoom, getCurrentZoom] = useState<number>(getZoomRatio());

  window.onresize = () => getCurrentZoom(getZoomRatio());
  document.onfullscreenchange = () => getCurrentZoom(getZoomRatio());

  return (
    <Pane
      paddingLeft="2%" paddingRight="2%"
      marginTop={72+24} marginBottom={20} >

      { React.cloneElement(props.children, {currentZoom: currentZoom}) }
    </Pane>
  );
};

export default Frame;
