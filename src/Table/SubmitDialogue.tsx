import {
  Dialog, Heading, Stack, Table, TextInput, toaster, Autocomplete
} from 'evergreen-ui';
import React, {useRef, useEffect} from 'react';
import {DataTypeKeys} from '../Data/data';
import {DialogProps} from './utils/dialogStateUtils';
import MappedTextInput from './MappedTextInput';

export interface SubmitDialogueProps extends DialogProps {
  dataTypeKeys?: DataTypeKeys,
  entries: Map<string, string | undefined>,
  setEntries: React.Dispatch<React.SetStateAction<Map<string, string | undefined>>>
}

// map from SubmitDialogue. store state of text input.
const SubmitTable =
  (props: SubmitDialogueProps) => {
    const {
      setEntries,
      entries,
      dataTypeKeys,
    } = props;
    const entriesSlice = new Map(entries); // old entries slice.

    return (<Table>
      {
        dataTypeKeys ?
          dataTypeKeys.map(e =>
            <Table.Row key={e[0]} height={70}>
              <Table.Cell
                flexBasis={220}
                flexShrink={0}
                flexGrow={0}>
                <Heading size={600}>{e[1]}</Heading>
              </Table.Cell>
              <Table.Cell>
                <MappedTextInput
                  entries={entries}
                  setEntries={setEntries}
                  name={e[0]}
                  placeholder={e[2]}
                />
              </Table.Cell>
            </Table.Row>)
          :
          null
      }
    </Table>);
  };


const SubmitDialogue =
  (props: SubmitDialogueProps) => {
    // map between entry name and input text value
    const {
      entries,
      setEntries,
      dataTypeKeys,
      shown,
      setShown,
      confirmed,
      breakSig,
    } = props;

    // set empty.
    useEffect(() => {
      dataTypeKeys?.map(
        e => setEntries(entries.set(e[0], undefined))
      );
    }, []);

    return (
      <Stack value={1100}>
        {
          zindex =>
            <Dialog
              isShown={shown}
              width={800}
              preventBodyScrolling
              onCloseComplete={() => {
                setShown(false);
                if (breakSig !== undefined) breakSig.current = false;
                confirmed.current = false;
              }}
              onCancel={close => {
                if (breakSig !== undefined) breakSig.current = true;
                close();
              }}
              onConfirm={close => {
                confirmed.current = true;
                close();
              }}
            >
              {
                ({close}) =>
                  React.createElement(SubmitTable,
                    {
                      ...props,
                      ...{
                        entriesMap: entries,
                        setEntries: setEntries,
                      },
                    })
              }
            </Dialog>
        }
      </Stack>
    );
  };


export default SubmitDialogue;
