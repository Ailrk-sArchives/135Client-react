const boolToVal = (b: boolean) => b ? 1 : 0;

export const grapName = (val: string | boolean | number | object | undefined): string | null => {  // key => val
  return ((val != null) ?
    ((typeof val === 'object') ? Object.values(val)[0]
      : ((typeof val === 'boolean') ?
        boolToVal(val)
        : val))
    : null);
}


