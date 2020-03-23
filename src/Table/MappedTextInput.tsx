/*
 * Reander real time input.
 */
import React, {useState, useCallback, useEffect} from 'react';
import {TextInput} from 'evergreen-ui';


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
