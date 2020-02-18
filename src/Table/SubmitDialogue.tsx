import {Dialog, Heading, Stack, Table, TextInput, toaster} from 'evergreen-ui';
import React, {useState, useEffect} from 'react';
import {ApiDataType, DataTypeKeys, FeedBack} from '../Data/data';
import {
  Operation, PanelOperationTable, HTTPMethods,
  OPPost, OPUpdate, OPDelete
} from './utils/utils';
import * as DataAdaptor from '../Data/dataAdaptor';

export interface SubmitDialogueProps {
  panelOperationTable?: PanelOperationTable;
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

const submitRequest = (
  props: {
    paneldata?: DataAdaptor.PanelDataType,
    panelOperationTable: PanelOperationTable,
    method: HTTPMethods,
    someid?: number
  }
)
  : ReturnType<Operation> | undefined => {

  const op = props.panelOperationTable.get(props.method);
  if (!op) return undefined;

  if (props.method === "post" && props.paneldata)
    return (op as OPPost<DataAdaptor.PanelDataType>)(props.paneldata);

  if (props.method === "put" && props.paneldata && props.someid)
    return (op as OPUpdate<DataAdaptor.PanelDataType>)(props.paneldata, props.someid);

  if (props.method === "delete" && props.someid)
    return (op as OPDelete)(props.someid);

};

const SubmitDialogue =
  (props: SubmitDialogueProps) => {

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
                    {
                      paneldata: mapToObject(entries),
                      panelOperationTable: props.panelOperationTable,
                      method: props.httpMethod,
                      someid: props.someid
                    }
                  ) as Promise<FeedBack>)
                    ?.then(response => {
                      console.log(response);
                      if (response.status === 0) toaster.success(`${response.message}`);
                      else toaster.warning(`${response.message}`);
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
