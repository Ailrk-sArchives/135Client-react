import {Dialog, Heading, Stack, Table, TextInput, toaster} from 'evergreen-ui';
import React, {useState, useEffect} from 'react';
import {ApiDataType, DataTypeKeys, FeedBack} from '../Data/data';
import {
  Operation, PanelOperationTable, HTTPMethods,
  OPPost, OPUpdate, OPDelete
} from './utils/utils';
import {DialogProps} from './utils/dialogStateUtils';
import * as DataAdaptor from '../Data/dataAdaptor';

export interface SubmitDialogueProps extends DialogProps {
  dataTypeKeys?: DataTypeKeys,
  entries: Map<string, string | undefined>,
  setEntries: React.Dispatch<React.SetStateAction<Map<string, string | undefined>>>

}

const SubmitTable =
  (props: SubmitDialogueProps) => // map from SubmitDialogue. store state of text input.
    (<Table>
      {
        props.dataTypeKeys ?
          props.dataTypeKeys.map(e =>
            <Table.Row key={e[0]} height={70}>
              <Table.Cell
                flexBasis={220}
                flexShrink={0}
                flexGrow={0}>
                <Heading size={600}>{e[1]}</Heading>
              </Table.Cell>
              <Table.Cell>
                <TextInput height={45}
                  width={"95%"}
                  name={e}
                  onChange={
                    (t: React.ChangeEvent<HTMLInputElement>) => {
                      props.setEntries(
                        props.entries.set(e[0], t.target.value)
                      );
                    }
                  }
                  placeholder={e[2]}
                />
              </Table.Cell>
            </Table.Row>)
          :
          null
      }
    </Table>);


const SubmitDialogue =
  (props: SubmitDialogueProps) => {

    // map between entry name and input text value
    const entries = props.entries;
    const setEntries = props.setEntries;

    // set empty.
    useEffect(() => {
      props.dataTypeKeys?.map(
        e => setEntries(entries.set(e[0], undefined))
      );
    }, [entries]);

    return (
      <Stack value={1100}>
        {
          zindex =>
            <Dialog
              isShown={props.shown}
              width={800}
              preventBodyScrolling
              onCloseComplete={() => props.setShown(false)}
              onConfirm={close => {
                props.confirmed.current = true;
                console.log(entries);
                close();
              }}>
              {
                ({close}) =>
                  React.createElement(SubmitTable,
                    {
                      ...props,
                      ...{
                        entriesMap: entries,
                        setEntries: setEntries,
                      }
                    })
              }
            </Dialog>
        }
      </Stack>
    );
  };


export default SubmitDialogue;
