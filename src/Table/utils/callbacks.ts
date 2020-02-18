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


export const opCallback =
  <T>(props: CallbackProps<T>, method: HTTPMethods): Promise<void> | undefined => {
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
            .then(res => showToaster((res as FeedBack)));
        break;

      case "put":
        if (props.panelData !== undefined && props.someid !== undefined)
          return (op as OPUpdate<PanelDataType>)(props.panelData, props.someid)
            .then(res => showToaster((res as FeedBack)));
        break;

      case "post":
        if (props.panelData !== undefined)
          return (op as OPPost<PanelDataType>)(props.panelData)
            .then(res => showToaster((res as FeedBack)));
        break;

      default:
        return undefined;
    }

  };

export const waitClickAndDelete =
  <T>(clicked: React.MutableRefObject<boolean>,
    props: CallbackProps<T>) =>
    waitClick(clicked, () => opCallback(props, "delete"));

export const waitClickAndUpdate =
  <T>(clicked: React.MutableRefObject<boolean>,
    props: CallbackProps<T>) =>
    waitClick(clicked, () => opCallback(props, "put"));

export const waitClickAndPost =
  <T>(clicked: React.MutableRefObject<boolean>,
    props: CallbackProps<T>) =>
    waitClick(clicked, () => opCallback(props, "post"));





