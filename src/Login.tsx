import React, {useState} from 'react';
import {Button, Pane, toaster, TextInputField} from 'evergreen-ui';
import {loginVerify} from './Data/data';

const Login = (props: {
  setLogined: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {setLogined} = props;
  const [uname, setUname] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const vlidateForm = () => {
    return uname.length > 0 && password.length > 0;
  }

  return (
    <Pane display="flex"
      justifyContent="center"
      width="100%"
      height="100%"
      marginTop={50}>

      <Pane className="login-input-group"
        border
        padding={120}
        background="tint2">
        <TextInputField
          label="用户名"
          required
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) =>
              setUname(e.target.value)}
          placeholder="用户名" />
        <TextInputField
          label="密码"
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)}
          required
          placeholder="密码" />
        <Button onClick={
          () => {
            console.log("hi")
            loginVerify(uname, password)
              .then(res => { setLogined(res); });
          }
        }>
          Clicke me
      </Button>

      </Pane>

    </Pane>
  )
}

export default Login;
