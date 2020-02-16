import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {ApiDataType, DataTypeKeys, Message} from '../../Data/data';
import { PanelDataType } from '../../Data/dataAdaptor';

// control panel operations. post, update, ...
export type Operation<T> = (params: T, id?: number) => Promise<T | Message>;

export type HTTPMethods = "post" | "delete" | "put" | "get" | undefined;
export type PanelOperationTable<T> = Map<HTTPMethods, Operation<T>>;

// dispatch data from cotrol panel to its sub components.
export interface ControlHub {
  data?: Array<ApiDataType>;
  setData?: Function;                         // useState ApiDataType
  panelOperationTable?: PanelOperationTable<ApiDataType | PanelDataType>;  // post, etc...
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


