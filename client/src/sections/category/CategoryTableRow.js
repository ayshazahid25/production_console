import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { Button, Checkbox, TableRow, TableCell, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
import CreateEditCategoryDialog from './CreateEditCategoryDialog';
import { updateCategoryRequest, deleteCategoryRequest } from '../../actions/category';
// ----------------------------------------------------------------------

function CategoryTableRow({
  Category: { message },
  rowIndex,
  row,
  updateCategory,
  deleteCategory,
}) {
  useEffect(() => {
    if (message) {
      handleCloseConfirm();
    }
    // eslint-disable-next-line
  }, [message]);

  const { id, name } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="center">{rowIndex}</TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {name}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <CreateEditCategoryDialog isEdit currentCategory={row} handleSubmited={updateCategory} />
          <IconButton
            sx={{ ml: 1, color: 'error.main' }}
            onClick={() => {
              handleOpenConfirm();
            }}
          >
            <Iconify color="error" icon="majesticons:delete-bin-line" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete this category?"
        action={
          <Button variant="contained" color="error" onClick={() => deleteCategory(id)}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CategoryTableRow.propTypes = {
  Category: PropTypes.object.isRequired,
  rowIndex: PropTypes.number,
  row: PropTypes.object,
  updateCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Category: state.Category,
});

export default connect(mapStateToProps, {
  updateCategory: updateCategoryRequest,
  deleteCategory: deleteCategoryRequest,
})(CategoryTableRow);
