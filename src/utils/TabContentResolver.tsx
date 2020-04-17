import React from 'react';
import {Link} from 'react-router-dom';
import {Tab, Text, Icon, IconName, Tooltip, Stack} from 'evergreen-ui';

export type TabName = string;
export type TabIcon = Icon | IconName | string;
export type TabHref = string | undefined;
export type TabTip = string | undefined;

export interface FixedLengthArray
  <T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
};
export interface TypedTriple<T extends TabName,
  U extends TabIcon,
  P extends TabHref,
  H extends TabTip>
  extends FixedLengthArray<T | U | P | H, 4> {
  0: T; 1: U; 2: P, 3: H;
};
export type TabContentTriple = TypedTriple<TabName, TabIcon, TabHref, TabTip>;

const TabContentResolver:
  React.FC<{
    contentList: TabContentTriple,
    tabwidth?: number,
    tabHeigh?: number,
    selectedTabIndex?: number,
    setSelectedTabIndex?: Function,
    index: number
  }> = props => {

    const [tabName, tabIcon, tabHref, tabTip] = props.contentList;
    const tabwidth = props.tabwidth ? props.tabwidth : 100;
    const tabHeigh = props.tabHeigh ? props.tabHeigh : 30;
    const tabSize = 600;
    const textSize = 400;

    const linkCss: React.CSSProperties = {
      textDecoration: 'none'
    };

    const ticon: React.ReactNode =
      typeof tabIcon === typeof Icon ? tabIcon as Icon
        : (<Icon icon={tabIcon as IconName} marginLeft={"5%"} />);

    const tab: React.ReactNode = (
      <Stack value={1001}>
        {
          zIndex => (
            <Tab key={props.index}
              height={tabHeigh}
              id={tabName}
              size={tabSize}
              width={tabwidth}
              isSelected={props.index === props.selectedTabIndex}
              onSelect={
                () => props.setSelectedTabIndex ?
                  props.setSelectedTabIndex(props.index)
                  : null}>
              {ticon}
              <Tooltip content={tabTip}>
                <Text size={textSize} marginLeft={6}> {tabName} </Text>
              </Tooltip>
            </Tab>)
        }
      </Stack>
    );

    const content =
      tabHref ? (
        <Link to={tabHref} style={linkCss}>
          {tab}
        </Link>)
        : (<Link to={"/Map"} style={linkCss}>
          {tab}
        </Link>);
    return content;
  };

export default TabContentResolver;
