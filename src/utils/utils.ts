import {Table} from 'evergreen-ui';

const boolToVal = (b: boolean) => b ? 1 : 0;

export const grapName = (val: string | boolean | number | object | undefined): string | null => {  // key => val
  /*
   * feting value from json receivced from api.
   * Map from key to value.
   */

  return ((val != null) ?
    ((typeof val === 'object') ? Object.values(val)[0]
      : ((typeof val === 'boolean') ?
        boolToVal(val)
        : val))
    : null);
}


export interface dynamicHeightProperties {
  smallScale: number;
  normalScale: number;
  largeScale: number;
};


export const dynamicHeight = (zoom: number, dynprop: dynamicHeightProperties) => {
  /*
   * alter the window height dynamically based on current
   * zoom in level
   */
  if (zoom >= 180) return window.innerHeight * dynprop.largeScale;
  if (zoom >= 120) return window.innerHeight * dynprop.normalScale;
  if (zoom >= 80) return window.innerHeight * dynprop.smallScale;
  return window.innerHeight * dynprop.smallScale;
};

  /* if (zoom >= 180) return window.innerHeight * 0.35; */
  /* if (zoom >= 120) return window.innerHeight * 0.56; */
  /* if (zoom >= 80) return window.innerHeight * 0.65; */
  /* return window.innerHeight * 0.65; */

