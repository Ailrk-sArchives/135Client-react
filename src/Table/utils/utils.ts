import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {
  ApiDataType, DataTypeKeys, Message, FeedBack, ApiDataTypeTag, ApiResponse, HTTPMethods
} from '../../Data/data';
import {PanelDataType} from '../../Data/dataAdaptor';
import {SubmitDialogueProps} from '../SubmitDialogue';
import {ConfirmDialogueProps} from '../ConfirmDialogue';
import {ShownDialogProps, DialogConfirmedProps} from './dialogStateUtils';

// control panel operations. post, update, ...
// api can be in various forms.

type _OpReturn = Promise<ApiResponse<ApiDataType> | Message | FeedBack>;

export type OPUpdate<T> = (params: T, id: number) => _OpReturn;
export type OPDelete = (id: number) => _OpReturn;
export type OPPost<T> = (params: T) => _OpReturn;

export type Operation =
  | OPUpdate<PanelDataType>
  | OPPost<PanelDataType>
  | OPDelete;

export type PanelOperationTable = Map<HTTPMethods, Operation>;


// dispatch data from cotrol panel to its sub components.
export interface ControlHub {
  data: Array<ApiDataType>,
  setData: Function,                         // useState ApiDataType
  panelOperationTable: PanelOperationTable,  // post, etc...
  dataTypeTag: ApiDataTypeTag,
  itemCheckedList?: Array<boolean>,
  dataTypeKeys?: DataTypeKeys,
  titlename: string,
  resourceId?: number,
}

export type PanelPopupMenuProps =
  & ShownDialogProps
  & Omit<SubmitDialogueProps, "shown" | "setShown">
  & Omit<ConfirmDialogueProps, "shown" | "setShown">
  & {setMessage: React.Dispatch<React.SetStateAction<string>>}
  & {
    someDatas?: Array<ApiDataType>,
    setSomeDatas?: Function,
    panelOperationTable: PanelOperationTable,
    dataTypeTag: ApiDataTypeTag
  };

// table popup handels its own shown states.
export type TablePopupMenuProps =
  Omit<PanelPopupMenuProps, keyof ShownDialogProps> & DialogConfirmedProps;

export const useTableParent = (setTableParent: Function) => {
  /*
   * Pass the parent api data from previous route.
   * The goal is to achieve the effect like pass the device
   * that owns the current spotRecords to the spotRecords table.
   */

  let location = useLocation<{tableParent: ApiDataType}>();

  useEffect(() => {
    // it could be undefined.
    const tableParent = location.state?.tableParent || {};
    setTableParent(tableParent);

  }, []);
};


// await for state change.
export const timeout =
  async (ms: number) => new Promise(res => setTimeout(res, ms));

// await until clicked is set to true.
export const waitClick =
  async (
    clicked: React.MutableRefObject<boolean>,

    callback: () => Promise<any> | undefined,

    breakSig?: React.MutableRefObject<boolean>) => {

    while (clicked.current === false && breakSig?.current !== true) {
      await timeout(100);
    }

    if (breakSig?.current === true) {
      breakSig.current = false;
      return undefined;
    }

    clicked.current = false;  // set click back.
    return callback();
  };

export function mapToObject (map: Map<string, string | undefined>): any {
  let data: {[k: string]: any} = {};
  map.forEach((v, k) => {
    data[k] = v;
  });

  return data;
}

export function apiDataArrayIsDuplicated(list?: Array<ApiDataType>,
  checkData?: ApiDataType): boolean {
  const idDispatch = (e: ApiDataType) => {
    return (
      e._kind == "Spot" ? e.spot_id
        :
        e._kind == "Device" ? e.device_id
          :
          e._kind == "Project" ? e.project_id
            :
            e._kind == "SpotRecord" ? e.spot_record_id
              : undefined);
  };

  const id = checkData ? idDispatch(checkData) : undefined;
  const ids = list?.map(e => idDispatch(e))

  if (id === undefined || ids === undefined) return true;

  return ids.includes(id);
};

