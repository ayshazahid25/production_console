import { useState, useEffect, memo, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// @mui
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { WareHouseTableToolbar, WareHouseTableRow } from './list';

// Action
import {
  getWareHousesRequest,
  getWareHouseByIdRequest,
  deleteWareHouseRequest,
  clearWareHouseList,
} from '../../../actions/wareHouse';

// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'address_1', label: 'Address', align: 'left' },
  { id: 'city', label: 'City', align: 'left' },
  { id: 'country', label: 'Country', align: 'left' },
  { id: 'country_code', label: 'Country Code', align: 'center' },
  { id: 'postal_code', label: 'Postal Code', align: 'left' },
  { id: 'state_or_region', label: 'Region', align: 'left' },
  { id: 'active', label: 'Active', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

const WareHouseListPage = memo(
  ({
    WareHouse: { wareHouses, error },
    Auth: { isAuthenticated, user },
    // eslint-disable-next-line
    getWareHousesRequest,
    // eslint-disable-next-line
    getWareHouseByIdRequest,
    // eslint-disable-next-line
    deleteWareHouseRequest,
    // eslint-disable-next-line
    clearWareHouseList,
  }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(PATH_AUTH.login, { replace: true });
      }

      if (wareHouses == null) {
        getWareHousesRequest();
      } else {
        setTableData(wareHouses);
      }

      // eslint-disable-next-line
    }, [
      isAuthenticated,
      wareHouses,
      //  error
    ]);

    useEffect(
      () => () => clearWareHouseList(),
      // eslint-disable-next-line
      []
    );

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

    const applyFilter = useCallback(({ inputData, comparator, Name }) => {
      const stabilizedThis = inputData.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const ordering = comparator(a[0], b[0]);
        if (ordering !== 0) {
          return ordering;
        }
        return a[1] - b[1];
      });

      inputData = stabilizedThis.map((el) => el[0]);
      if (Name) {
        inputData = inputData.filter(
          (wareHouse) => wareHouse.name.toLowerCase().indexOf(Name.toLowerCase()) !== -1
        );
      }

      return inputData;
    }, []);

    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      Name: filterName,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterName !== '';

    const isNotFound = !dataFiltered.length && !!filterName;

    const handleOpenConfirm = useCallback(() => {
      setOpenConfirm(true);
    }, []);

    const handleCloseConfirm = useCallback(() => {
      setOpenConfirm(false);
    }, []);

    const handleActiveOpenConfirm = useCallback(() => {
      setActiveOpenConfirm(true);
    }, []);

    const handleActiveCloseConfirm = useCallback(() => {
      setActiveOpenConfirm(false);
    }, []);

    const handleFilterName = useCallback(
      (event) => {
        setPage(0);
        setFilterName(event.target.value);
      },
      [setPage]
    );

    const handleDeleteRow = useCallback(
      (id, payload) => {
        deleteWareHouseRequest({ userId: [id], status: payload.status });
        setSelected([]);

        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      },
      [dataInPage, page, setPage, setSelected, deleteWareHouseRequest]
    );

    const handleDeleteRows = useCallback(
      (selectedRows, payload) => {
        deleteWareHouseRequest({ userId: selectedRows, status: payload.status });
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
      },
      [
        dataInPage,
        tableData,
        rowsPerPage,
        dataFiltered,
        page,
        setPage,
        setSelected,
        deleteWareHouseRequest,
      ]
    );

    const handleEditRow = useCallback(
      (wareHouseId) => {
        getWareHouseByIdRequest(wareHouseId);

        navigate(PATH_DASHBOARD.wareHouse.update(wareHouseId));
      },
      [getWareHouseByIdRequest, navigate]
    );

    const handleResetFilter = useCallback(() => {
      setFilterName('');
    }, []);

    return (
      <>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Card>
            <WareHouseTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onResetFilter={handleResetFilter}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              {user && user.permission_settings.user_create_view_and_edit && (
                <TableSelectedAction
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
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
                    viewEdit={user.permission_settings.user_create_view_and_edit}
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    // rowCount={tableData.length}
                    // numSelected={selected.length}
                    onSort={onSort}
                    // onSelectAllRows={(checked) =>
                    //   onSelectAllRows(
                    //     checked,
                    //     tableData.map((row) => row.id)
                    //   )
                    // }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <WareHouseTableRow
                          user={user}
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id, { status: 'banned' })}
                          onActiveRow={() => handleDeleteRow(row.id, { status: 'active' })}
                          onEditRow={() => handleEditRow(row.id)}
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
              //
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
              Are you sure want to banned <strong> {selected.length} </strong> ware house?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRows(selected, { status: 'banned' });
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
              Are you sure want to active <strong> {selected.length} </strong> ware house?
            </>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleDeleteRows(selected, { status: 'active' });
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
);

WareHouseListPage.propTypes = {
  WareHouse: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getWareHousesRequest: PropTypes.func.isRequired,
  getWareHouseByIdRequest: PropTypes.func.isRequired,
  deleteWareHouseRequest: PropTypes.func.isRequired,
  clearWareHouseList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  WareHouse: state.WareHouse,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getWareHousesRequest,
  getWareHouseByIdRequest,
  deleteWareHouseRequest,
  clearWareHouseList,
})(WareHouseListPage);
// ----------------------------------------------------------------------
