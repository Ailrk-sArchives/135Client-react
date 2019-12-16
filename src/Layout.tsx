/* Reusable layout.
 */
import React, {MouseEvent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {Pane, Strong, Text, Icon, Heading, Tab, TabNavigation} from 'evergreen-ui';
import Mapp from './Mapp';
import history from './history';

const Layout: React.FC = (props) => {
  const [homerefer, setHomerefer] = useState<string | null>(null);
  const onTitleRedirect = (): void => setHomerefer('/');

  // redirect to home
  if (homerefer) history.push('/');
  return (
    <div>
      <Pane elevation={1}
        hoverElevation={2}
        activeElevation={4}>

        <Pane background="tint2"
          padding={24}
          marginBottom={16}
          display="flex"
          justifyContent="space-between"
          onClick={onTitleRedirect}>

          <Title titlename={"十三五\"长江流域建筑供暖空调解决方案和相应系统\"云平台"}/>
          <Topnav tablists={[
            ['历史数据', 'Table'],
            ['实时数据', ''] ,
            ['对比数据', '']
          ]}/>
        </Pane>

      </Pane>
    </div>
  );
};

const Title: React.FC<{titlename: string}> = (props) => {
  const titlename: string = props.titlename;
  return (
    <Strong size={500}>
      <Icon icon="cloud" marginRight={16} size={18} />
        {titlename}
    </Strong>
  );

};

const Topnav: React.FC<{tablists: Array<Array<string>>}> = (props) => {
  const tablists: Array<Array<string>> = props.tablists;

  return (
    <TabNavigation display="flex">
      {
        tablists.map((tab, index) => (
        <Tab key={tab[0]} is="a" href={tab[1]} id={tab} size={600}>
          <Text size={400}>
            {tab[0]}
          </Text>
        </Tab>
      ))}
    </TabNavigation>
  );
};

export default Layout;
