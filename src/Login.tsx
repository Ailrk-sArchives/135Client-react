import React, {useState} from 'react';
import {Button, Pane, toaster, TextInputField, Strong} from 'evergreen-ui';
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
    <Pane height={800}>
      <Pane display="flex"
        justifyContent="center"
        width="100%"
        height={400}
        marginTop={150}>
        <Pane className="login-input-group"
          border
          padding={120}
          paddingTop={80}
          paddingBottom={80}
          background="tint2">
          <Pane marginBottom={30}>
            <Strong size={600} >
              十三五长江流域建筑供暖解决方案云平台
      </Strong>

          </Pane>


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
                .then(res => {setLogined(res);});
            }
          }>
            Clicke me
      </Button>

        </Pane>

      </Pane>
    </Pane>
  )
}

export default Login;
