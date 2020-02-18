import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {ApiDataType, DataTypeKeys, Message, FeedBack} from '../../Data/data';
import {PanelDataType} from '../../Data/dataAdaptor';

// control panel operations. post, update, ...
// api can be in various forms.

type _OpReturn<T> = Promise<T | Message | FeedBack>;

export type OPUpdate<T> = (params: T, id: number) => _OpReturn<T>;
export type OPDelete = (id: number) => Promise<Message | FeedBack>;
export type OPPost<T> = (params: T) => _OpReturn<T>;

export type Operation =
  | OPUpdate<PanelDataType>
  | OPPost<PanelDataType>
  | OPDelete;

export type HTTPMethods = "post" | "delete" | "put" | "get" | undefined;
export type PanelOperationTable = Map<HTTPMethods, Operation>;


// dispatch data from cotrol panel to its sub components.
export interface ControlHub {
  data?: Array<ApiDataType>;
  setData?: Function;                         // useState ApiDataType
  panelOperationTable?: PanelOperationTable;  // post, etc...
  itemCheckedList?: Array<boolean>;
  dataTypeKeys?: DataTypeKeys;
  titlename: string;
  resourceId?: number;
};

export const useTableParent = (setTableParent: Function) => {
  /*
   * Pass the parent api data from previous route.
   * The goal is to achieve the effect like pass the device
   * that owns the current spotRecords to the spotRecords table.
   */

  let location = useLocation();

  useEffect(() => {
    // it could be undefined.
    const tableParent = location.state?.tableParent || {};
    setTableParent(tableParent);

  }, []);
};


// await for state change.
export const timeout = async (ms: number) => new Promise(res => setTimeout(res, ms));
export const waitClick =
  async (clicked: React.MutableRefObject<boolean>, callback: Function) => {
    while (clicked.current === false) {
      await timeout(50);
    }
    callback();
  };



