/*
 * async call back executed after dialogues.
 */

import {
  waitClick, PanelOperationTable, Operation, OPDelete, OPUpdate, HTTPMethods,
  OPPost
} from './utils';
import {PanelDataType} from '../../Data/dataAdaptor';
import {FeedBack} from '../../Data/data';
import React, {MutableRefObject} from 'react';
import {toaster} from 'evergreen-ui';

export interface CallbackProps<T> {
  someid?: number,
  someDatas?: Array<T>,
  panelData?: PanelDataType,
  setSomeData?: Function,
  panelOperationTable: PanelOperationTable
}

const feedBackMsg = (feedback: FeedBack) => feedback.message;

function showToaster(feedback: FeedBack) {
  if (feedback.status === 0)
    toaster.success(feedBackMsg(feedback));

  else
    toaster.danger(feedBackMsg(feedback));
};


function opCallback<T>
  (props: CallbackProps<T>,
    method: HTTPMethods): ReturnType<Operation> | undefined {

  const op = props.panelOperationTable?.get(method);
  if (method === undefined || op === undefined) return undefined;

  const callop = () => {
    switch (method) {
      case "delete":
        if (props.someid !== undefined)
          return (op as OPDelete)(props.someid)
        break;

      case "put":
        if (props.panelData !== undefined && props.someid !== undefined)
          return (op as OPUpdate<PanelDataType>)(props.panelData, props.someid)
        break;

      case "post":
        if (props.panelData !== undefined)
          return (op as OPPost<PanelDataType>)(props.panelData)
        break;

      default:
        return undefined;
    };

  }

  return callop()?.then((res) => {
      showToaster(res as FeedBack);
      return res;
    });

};

// props callback can delay the creation of CallbackProps.
export type CallbackPropsCb<T> = () => CallbackProps<T>;

function waitClickAndDo<T>(
  clicked: MutableRefObject<boolean>,

  props:
  | CallbackProps<T>
  | CallbackPropsCb<T>,

  method: HTTPMethods,

  breakSig?: MutableRefObject<boolean>,

): ReturnType<Operation> | undefined {

  return waitClick(clicked,
    () => {
      if (typeof props === "function") return opCallback(props(), method);
      return opCallback(props, method);
    },
    breakSig);
}

// interface for waited operation.
type WaitInterface =
<T>(clicked: MutableRefObject<boolean>,

  props:
  | CallbackProps<T>
  | CallbackPropsCb<T>,

  breakSig?: MutableRefObject<boolean>,

) => ReturnType<Operation> | undefined;

export class Wait {
  static delete: WaitInterface =
    (clicked, props, breakSig?) => waitClickAndDo(clicked, props, "delete", breakSig);

  static post: WaitInterface =
    (clicked, props, breakSig?) => waitClickAndDo(clicked, props, "post", breakSig);

  static update: WaitInterface =
    (clicked, props, breakSig?) => waitClickAndDo(clicked, props, "put", breakSig);
}
