import React, {useEffect, useState} from 'react';
import {Pane, Text, Elevation, Combobox} from 'evergreen-ui';
import {PaginationRequest, makePaginationRequest} from '../Data/data';


export interface PaginationProps {
  useUpdate: (paginationRequest: PaginationRequest) => void;
  useChangePageSize: (pageSize: number) => void;
  totalElementCount: number;
  totalPage: number;
  pageSize: number;
  currentPage: number;
  pageButtonLimit: number;
};

const TablePaginationButton: React.FC<{
  name:
  | string
  | number,
  useUpdate: (paginationRequest: PaginationRequest) => void,
  pageNum: number,
  pageSize: number,
  elevation: Elevation,
  [moreProps: string]: any
}> = (props) => {

  const {
    name,
    pageSize,
    pageNum,
    elevation,
    ...rest
  } = props;

  return (
    <Pane {...rest}
      onClick={
        () => {
          props.useUpdate(
            makePaginationRequest(pageNum, pageSize));
        }
      }
      borderTop={"default"}
      borderBottom={"default"}
      borderRight={"muted"}
      paddingX={13}
      paddingY={7}
      background={"tin2"}
      elevation={props.elevation}
      activeElevation={2}
      cursor={"pointer"}
      hoverElevation={2}>
      <Text size={500}>{name}</Text>
    </Pane>
  );
};

const TablePaginationBar = (props: PaginationProps) => {
  const {
    pageSize,
    useUpdate,
    currentPage,
    totalPage,
    pageButtonLimit,
  } = props;

  const inHead =
    (currentPage: number, limit: number): boolean =>
      currentPage < limit;

  const inTail =
    (currentPage: number, totalPage: number, limit: number): boolean =>
      currentPage > totalPage - limit;

  const BasicButton = (name: number | string, pageNum: number) =>
    <TablePaginationButton name={name}
      pageNum={pageNum}
      pageSize={pageSize}
      elevation={1}
      useUpdate={useUpdate} />;

  const goLeftButton =
    BasicButton("<", (currentPage === 1) ?
      1
      : currentPage - 1);

  const goRightButton =
    BasicButton(">", (currentPage > totalPage) ?
      1
      : currentPage + 1);

  const elipsisButtonLeft =
    BasicButton("...", Math.floor((currentPage - 1) / 2));

  const elipsisButtonRight =
    BasicButton("...",
      Math.floor((totalPage + currentPage - 1) / 2));

  const lastPageButton = BasicButton(totalPage, totalPage);
  const firstPageButton = BasicButton(1, 1);

  const numberList: Array<JSX.Element> =
    [
      ...Array.from(Array(pageButtonLimit).keys())
        .map(e => inHead(currentPage, pageButtonLimit) ?
          e + 1

          : inTail(currentPage, totalPage, pageButtonLimit) ?
            e + 1 + totalPage - pageButtonLimit

            : e + currentPage - Math.floor(pageButtonLimit / 2))

    ].map(index =>
      <TablePaginationButton
        elevation={index === currentPage ? 3 : 1}
        key={index}
        name={index}
        pageNum={index}
        useUpdate={useUpdate}
        pageSize={pageSize} />);

  const pagingList =
    inHead(currentPage, pageButtonLimit) ||
      inTail(currentPage, totalPage, pageButtonLimit) ?
      [goLeftButton].concat(numberList).concat([goRightButton])
      :
      [goLeftButton]
        .concat(firstPageButton)
        .concat(elipsisButtonLeft)
        .concat(numberList)
        .concat(elipsisButtonRight)
        .concat(lastPageButton)
        .concat([goRightButton]);

  return (
    <Pane background="tint2"
      paddingTop={10}
      paddingBottom={10}
      paddingRight={20}
      paddingLeft={20}
      borderTop={"default"}
      display="flex"
      width="100hv"
      justifyContent="space-between" >
      <Pane display="flex"
        width="60hv">
        <Text paddingTop={10}
          width={600}>
          显示第{props.currentPage}页数据，
        共计{props.totalPage}页,
        {props.totalElementCount}条记录。每页显示
      </Text>
        <Combobox paddingRight={10}
          marginLeft={-35}
          paddingTop={5}
          items={[5, 10, 20, 50, 100]}
          onChange={e => {
            props.useChangePageSize(e);
            props.useUpdate(makePaginationRequest(1, e));
          }}
          placeholder={props.pageSize.toString()}
          width={100}
        />
        <Text paddingTop={10}
          marginLeft={-270}
          width={150}> 条记录 </Text>
      </Pane>

      <Pane display="flex">
        {pagingList}
      </Pane>
    </Pane>
  );
};

export default TablePaginationBar;
