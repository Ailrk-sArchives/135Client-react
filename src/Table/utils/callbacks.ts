import {
  waitClick, PanelOperationTable, Operation, OPDelete, OPUpdate,
  OPPost
} from './utils';
import {FeedBack} from '../../Data/data';
import React from 'react';
import {toaster} from 'evergreen-ui';

export interface CallbackProps<T> {
  someid: number,
  someData: Array<T>,
  setSomeData?: Function,
  panelOperationTable?: PanelOperationTable
}


// delete callback to delete one specific data.
export const deleteCallback =
  <T>(props: CallbackProps<T>) => {

    const op = props.panelOperationTable?.get("delete");

    if (props.setSomeData && props.panelOperationTable && op) {

      return (op as OPDelete)(props.someid)
        .then(res => {
          if ((res as FeedBack).status === 0)
            toaster.success(`${(res as FeedBack).message}`);
          else
            toaster.danger(`${(res as FeedBack).message}`);
        });
    }
  };


export const waitClickAndDelete =
  <T>(clicked: React.MutableRefObject<boolean>, props: CallbackProps<T>) =>

    waitClick(clicked,
      () => {
        deleteCallback({
          someid: props.someid,
          someData: props.someData,
          setSomeData: props.setSomeData,
          panelOperationTable: props.panelOperationTable
        })
      });

