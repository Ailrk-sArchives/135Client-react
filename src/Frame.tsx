/* Frame to hold components.
*/
import React from 'react';
import { Pane, Text } from 'evergreen-ui';

const Frame: React.FC<{children: any}> = (props) => {
  const style: React.CSSProperties = {
    bottom: 0,
  };

  return (
    <Pane
      style={style}
      paddingLeft="2%" paddingRight="2%"
      marginTop={72+24} marginBottom={36} >

      { props.children }
    </Pane>
  );
};

export default Frame;
