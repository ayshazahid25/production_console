import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
// import { paramCase } from 'change-case';
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

// _mock_
// import { _userList, _dbuserList } from '../../_mock/arrays';
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
// sections

import {
  CategoryTableToolbar,
  CategoryTableRow,
  CreateEditCategoryDialog,
} from '../../sections/category';

import {
  getCategoryRequest,
  createCategoryRequest,
  clearCategoryList,
} from '../../actions/category';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

function CategoryListPage({
  Category: { categoryList },
  Auth: { isAuthenticated },
  getCategory,
  clrCategoryList,
  createCategory,
}) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (categoryList == null) {
      getCategory();
    } else {
      setTableData(categoryList);
    }

    // eslint-disable-next-line
  }, [
    isAuthenticated,
    categoryList,
    //  error
  ]);

  useEffect(
    () => () => clrCategoryList(),
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
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !dataFiltered.length && !!filterName;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <>
      <Helmet>
        <title> Category: List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'md'}>
        <CustomBreadcrumbs
          heading="Category List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Category' }]}
          action={<CreateEditCategoryDialog handleSubmited={createCategory} />}
        />

        <Card>
          <CategoryTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 300 }}>
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
                    .map((row, index) => (
                      <CategoryTableRow key={row.id} rowIndex={index + 1} row={row} />
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
    </>
  );
}

CategoryListPage.propTypes = {
  Category: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getCategory: PropTypes.func.isRequired,
  clrCategoryList: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Category: state.Category,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getCategory: getCategoryRequest,
  clrCategoryList: clearCategoryList,
  createCategory: createCategoryRequest,
})(CategoryListPage);
// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
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
      (data) => data.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
