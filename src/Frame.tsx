/* Frame to hold components.
*/
import React from 'react';
import { Pane, Text } from 'evergreen-ui';

const Frame: React.FC<{children: any}> = (props) => {
  return (
    <Pane height="100%" width="100%"
      paddingLeft="5%" paddingRight="5%"
      background="tint1">
      { props.children }
    </Pane>
  );
};

export default Frame;
