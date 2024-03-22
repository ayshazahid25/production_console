import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

// @mui
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';

// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import { useSnackbar } from '../../components/snackbar';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';

// Action
import {
  getAllUsersRequest,
  getUserByIdRequest,
  deleteUserRequest,
  clearUserList,
} from '../../actions/user';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const TABLE_HEAD = [
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'full_name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone_number', label: 'Phone Number', align: 'left' },
  { id: 'joined_at', label: 'Joining Date', align: 'left' },
  { id: 'employment_type', label: 'Employment Type', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

function UserListPage({
  Users: { users, error, message },
  Auth: { isAuthenticated, user },
  // eslint-disable-next-line
  getAllUsersRequest,
  // eslint-disable-next-line
  getUserByIdRequest,
  // eslint-disable-next-line
  deleteUserRequest,
  // eslint-disable-next-line
  clearUserList,
}) {
  const [tableData, setTableData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (users == null) {
      getAllUsersRequest();
    } else {
      setTableData(users);
    }

    // eslint-disable-next-line
  }, [
    isAuthenticated,
    users,
    //  error
  ]);

  useEffect(
    () => () => clearUserList(),
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message);
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }

    // eslint-disable-next-line
  }, [message, error]);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [activeOpenConfirm, setActiveOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('active');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleActiveOpenConfirm = () => {
    setActiveOpenConfirm(true);
  };

  const handleActiveCloseConfirm = () => {
    setActiveOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id, payload) => {
    deleteUserRequest({ userId: [id], is_active: payload.status });
    setSelected([]);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows, payload) => {
    deleteUserRequest({ userId: selectedRows, is_active: payload.status });
    setSelected([]);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (userId) => {
    getUserByIdRequest(userId);
    navigate(PATH_DASHBOARD.user.account(userId));
  };
  const handleResetFilter = () => {
    setFilterName('');

    setFilterStatus('active');
  };

  return (
    <>
      <Helmet>
        <title> User: List | Buggaz Ltd</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Users' }]}
          action={
            user &&
            user.is_admin && (
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.user.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New User
              </Button>
            )
          }
        />

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

          <UserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {user && user.is_admin && (
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
                action={
                  <>
                    <Tooltip title="Active">
                      <IconButton color="primary" onClick={handleActiveOpenConfirm}>
                        <Iconify icon="mdi:account-check-outline" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Banned">
                      <IconButton color="error" onClick={handleOpenConfirm}>
                        <Iconify icon="mdi:person-block-outline" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            )}
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  viewEdit={user.is_admin}
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        user={user}
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row.id, { status: false })}
                        onActiveRow={() => handleDeleteRow(row.id, { status: true })}
                        onEditRow={() => handleEditRow(row._id)}
                      />
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
            rowsPerPageOptions={[25, 50, 100]}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Banned"
        content={
          <>
            Are you sure want to banned <strong> {selected.length} </strong> user?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected, { status: false });
              handleCloseConfirm();
            }}
          >
            Banned
          </Button>
        }
      />
      <ConfirmDialog
        open={activeOpenConfirm}
        onClose={handleActiveCloseConfirm}
        title="Active"
        content={
          <>
            Are you sure want to active <strong> {selected.length} </strong> user?
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDeleteRows(selected, { status: true });
              handleActiveCloseConfirm();
            }}
          >
            Active
          </Button>
        }
      />
    </>
  );
}

UserListPage.propTypes = {
  Users: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getAllUsersRequest: PropTypes.func.isRequired,
  getUserByIdRequest: PropTypes.func.isRequired,
  deleteUserRequest: PropTypes.func.isRequired,
  clearUserList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getAllUsersRequest,
  getUserByIdRequest,
  deleteUserRequest,
  clearUserList,
})(UserListPage);
// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const status = filterStatus;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (user) => user.first_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => (user.is_active ? 'active' : 'banned') === status);
  }

  return inputData;
}
