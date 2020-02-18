import React, {useEffect} from 'react';
import {toaster, Icon, Dialog, Pane, Heading, Stack} from 'evergreen-ui';
import {
  Operation, OPPost, OPDelete, OPUpdate, HTTPMethods, PanelOperationTable
} from './utils';


export const confirmDialogue: React.FC<{
  confirmed: React.MutableRefObject<boolean>,
  //setConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  shown: boolean,
  setShown: React.Dispatch<React.SetStateAction<boolean>>,
  message?: string
}> = (props) => {

  return (
    <Stack value={1100}>
      {
        zindex =>
          <Dialog
            isShown={props.shown}
            width={800}
            onCloseComplete={() => {
              props.setShown(false);
            }}
            hasHeader={false}
            onConfirm={close => {
              props.confirmed.current = true;
              close();
            }}>
            {
              ({close}) => (
                <Pane paddingTop={20}
                  paddingLeft={50}
                  width="100hv"
                  display="flex">

                  <Icon icon="warning-sign" color="danger" />
                  <Pane width={10} />
                  <Heading size={400}> {props.message}</Heading>
                </Pane>
              )
            }
          </Dialog>
      }
    </Stack>
  );
};

