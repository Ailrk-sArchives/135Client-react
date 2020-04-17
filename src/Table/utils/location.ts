import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { ApiDataType } from '../../Data/data';

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


