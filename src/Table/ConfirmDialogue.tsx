import React, {useEffect} from 'react';
import {toaster, Icon, Dialog, Pane, Heading, Stack} from 'evergreen-ui';
import {DialogProps} from './utils/dialogStateUtils';

export interface ConfirmDialogueProps extends DialogProps {
  message: string,
};

const ConfirmDialogue: React.FC<ConfirmDialogueProps> = props => {

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

export default ConfirmDialogue;
