import {Dialog, Heading, Stack, Table, TextInput, toaster} from 'evergreen-ui';
import React, {useState, useEffect} from 'react';
import {ApiDataType, DataTypeKeys, Message} from '../Data/data';
import {Operation, PanelOperationTable, HTTPMethods} from './utils/utils';
import * as DataAdaptor from '../Data/dataAdaptor';

export interface SubmitDialogueProps {
  panelOperationTable?: PanelOperationTable<ApiDataType>;
  someid?: number;  // api id if it presents.
  dataTypeKeys?: DataTypeKeys;
  shown: boolean;
  setShown: Function;
  httpMethod?: HTTPMethods;
}

const SubmitTable =
  (props:
    SubmitDialogueProps &
    {
      entriesMap: Map<string, string | undefined>,
      setEntries: React.Dispatch<React.SetStateAction<Map<string, string | undefined>>>
    },
    // map from SubmitDialogue. store state of text input.
  ) =>
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
                        props.entriesMap.set(e[0], t.target.value)
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

const mapToObject = (map: Map<string, string | undefined>): any => {
  let data: {[k: string]: any} = {};
  map.forEach((v, k) => {
    data[k] = v;
  });

  return data;
};

const submitRequest = (data: DataAdaptor.PanelDataType,
  panelOperationTable: PanelOperationTable<ApiDataType>,
  method: HTTPMethods,
  someid?: number): ReturnType<Operation<ApiDataType>> | undefined => {

  const op = panelOperationTable.get(method);
  if (!op) return undefined;

  if (someid) return op(data, someid);
  else return op(data);
};

const SubmitDialogue =
  (props: SubmitDialogueProps) => {
    /*
     * TODO call Operations.
     * @param submitTable: will be generated for each specific T
     */

    // map between entry name and input text value
    const [entries, setEntries] =
      useState<Map<string, string | undefined>>(new Map());

    useEffect(() => {
      props.dataTypeKeys?.map(
        e => setEntries(entries.set(e[0], undefined))
      );
      console.log(entries);
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
                console.log(entries)

                // operation will be passed from Table components all the way to here.
                if (props.panelOperationTable && props.httpMethod) {
                  (submitRequest(
                    mapToObject(entries),
                    props.panelOperationTable,
                    props.httpMethod,
                    props.someid) as Promise<Message>  // apis that are not get will return a message
                  )
                    ?.then(response => {
                      console.log(response)
                      // toaster.success("post successed");
                      // toaster.warning(`post failed: ${e}`);
                    })
                    .catch(e => console.error(`${e}`));
                }
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
