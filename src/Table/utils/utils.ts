import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';


export const useTableParent = (setTableParent: Function) => {
  let location = useLocation();

  useEffect(() => {
    // it could be undefined.
    const tableParent = location.state?.tableParent || {};
    setTableParent(tableParent);

  }, []);
};


