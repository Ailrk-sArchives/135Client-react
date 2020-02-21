/*
 * async call back executed after dialogues.
 */

import {
  waitClick, PanelOperationTable, Operation, OPDelete, OPUpdate, HTTPMethods,
  OPPost
} from './utils';
import {PanelDataType} from '../../Data/dataAdaptor';
import {FeedBack} from '../../Data/data';
import React, {FormEvent, Props} from 'react';
import {toaster} from 'evergreen-ui';

export interface CallbackProps<T> {
  someid?: number,
  someDatas?: Array<T>,
  panelData?: PanelDataType,
  setSomeData?: Function,
  panelOperationTable?: PanelOperationTable
}


const feedBackMsg = (feedback: FeedBack) => feedback.message;

function opCallback<T>
  (props: CallbackProps<T>,
    method: HTTPMethods): ReturnType<Operation> | undefined {

    const op = props.panelOperationTable?.get(method);
    if (method === undefined || op === undefined) return undefined;

    const showToaster = (feedback: FeedBack) => {
      if (feedback.status === 0)
        toaster.success(feedBackMsg(feedback));
      else
        toaster.danger(feedBackMsg(feedback));
    };

    switch (method) {
      case "delete":
        if (props.someid !== undefined)
          return (op as OPDelete)(props.someid)
            .then(res => {
              showToaster((res as FeedBack));
              return res;
            });
        break;

      case "put":
        if (props.panelData !== undefined && props.someid !== undefined)
          return (op as OPUpdate<PanelDataType>)(props.panelData, props.someid)
            .then(res => {
              showToaster((res as FeedBack));
              return res;
            });
        break;

      case "post":
        if (props.panelData !== undefined)
          return (op as OPPost<PanelDataType>)(props.panelData)
            .then(res => {
              showToaster((res as FeedBack));
              return res;
            });
        break;

      default:
        return undefined;
    }
  };

// props callback can delay the creation of CallbackProps.
export type CallbackPropsCb<T> = () => CallbackProps<T>;
function waitClickAndDo<T>(
  clicked: React.MutableRefObject<boolean>,
  props: CallbackProps<T> | CallbackPropsCb<T>,
  method: HTTPMethods
): ReturnType<Operation> | undefined {

  return waitClick(clicked, () => {
    if (typeof props === "function") return opCallback(props(), method);
    return opCallback(props, method);
  });
}

export class Wait {
  static delete<T>(
    clicked: React.MutableRefObject<boolean>,
    props: CallbackProps<T> | CallbackPropsCb<T>
  ): ReturnType<Operation> | undefined {
    return waitClickAndDo(clicked, props, "delete");
  }

  static post<T>
    (clicked: React.MutableRefObject<boolean>,
      props: CallbackProps<T> | CallbackPropsCb<T>
    ): ReturnType<Operation> | undefined {
    return waitClickAndDo(clicked, props, "post");
  }

  static update<T>(
    clicked: React.MutableRefObject<boolean>,
    props: CallbackProps<T> | CallbackPropsCb<T>
  ): ReturnType<Operation> | undefined {
    return waitClickAndDo(clicked, props, "put");
  }
}


