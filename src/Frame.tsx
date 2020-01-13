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
      paddingLeft="2%" paddingRight="2%"
      marginTop={72+24} marginBottom={20} >

      { props.children }
    </Pane>
  );
};

export default Frame;
