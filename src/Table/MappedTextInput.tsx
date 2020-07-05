/*
 * Reander real time input.
 */
import React, {useState, useCallback, useEffect} from 'react';
import {TextInput} from 'evergreen-ui';


const normget = (e: any): string => {
  // handle nested entry
  let res: string;
  if (typeof e == 'object' && Object.keys(e).length == 1) {
    const k = Object.keys(e)[0];
    res = e[k];
  } else {
    res = e as string;
  }

  console.log(res);
  return res;
}


const MappedTextInput: React.FC<{

  entries: Map<string, string | undefined>,

  setEntries: React.Dispatch<React.SetStateAction<Map<string, string | undefined>>>

  name: string,

  placeholder: string,

}> = props => {

  const {
    setEntries,
    entries,
    name,
    placeholder,
  } = props;

  const [value, setValue] = useState<string | undefined>(entries.get(name));

  const renderValue = useCallback(
    (t: React.ChangeEvent<HTMLInputElement>) => setValue(t.target.value),
    [value]);

  useEffect(() => {  // flush the most recent value into entries.
    setEntries(entries.set(name, value));
  }, [value]);

  console.log(entries);


  return (
    <TextInput height={45}
      width={"95%"}
      name={name}
      onChange={ (t: React.ChangeEvent<HTMLInputElement>) => renderValue(t) }
      value={value}
      placeholder={entries.get(name) ?? placeholder}
    />);
}

export default MappedTextInput;
