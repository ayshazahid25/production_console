import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Divider,
  TableBody,
  Container,
  TableContainer,
  Grid,
} from '@mui/material';

// _mock_
import { _userList } from '../../../_mock/arrays';
// components

import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
import ContractTableRow from './list/ContractTableRow';
import RenewContract from './RenewContract';
// sections

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];
const STATUS_OPTIONS = ['all', 'permanent', 'probation', 'internship', 'contract'];

const TABLE_HEAD = [
  { id: 'employment_type', label: 'Employment Type', align: 'left' },
  { id: 'start_date', label: 'Start Date', align: 'center' },
  { id: 'end_date', label: 'End Date', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

function UserContractHistory({ Users: { user } }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      setTableData(user.contract_durations);
    }

    // eslint-disable-next-line
  }, [user]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,

    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };
  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const today = new Date();
  return (
    <>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}
        >
          {tableData.length > 0 && tableData[tableData.length - 1].end_date <= today && (
            <RenewContract lastContract={tableData[tableData.length - 1]} />
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <Helmet>
            <title> User: List | Minimal UI</title>
          </Helmet>

          <Container maxWidth={themeStretch ? false : 'lg'}>
            <Card>
              <Tabs
                value={filterStatus}
                onChange={handleFilterStatus}
                sx={{
                  px: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                {STATUS_OPTIONS.map((tab) => (
                  <Tab key={tab} label={tab} value={tab} />
                ))}
              </Tabs>

              <Divider />

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                  <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      onSort={onSort}
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <ContractTableRow key={row._id} row={row} />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
              />
            </Card>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

UserContractHistory.propTypes = {
  Users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
});

export default connect(mapStateToProps, {})(UserContractHistory);

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.employment_type === filterStatus);
  }

  return inputData;
}
