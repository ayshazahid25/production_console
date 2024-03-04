import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { Button, Checkbox, TableRow, TableCell, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
import CreateEditCarDialog from './CreateEditCarDialog';
import { updateCarRequest, deleteCarRequest } from '../../actions/car';
// ----------------------------------------------------------------------

function CarTableRow({ Car: { message }, rowIndex, row, updateCar, deleteCar }) {
  useEffect(() => {
    if (message) {
      handleCloseConfirm();
    }
    // eslint-disable-next-line
  }, [message]);

  const { id, name, reg_no, model, color, car_category } = row || {};

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
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {reg_no}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {model}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {color}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {car_category && car_category.name}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <CreateEditCarDialog isEdit currentCar={row} handleSubmited={updateCar} />
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
        content="Are you sure want to delete this car?"
        action={
          <Button variant="contained" color="error" onClick={() => deleteCar(id)}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CarTableRow.propTypes = {
  Car: PropTypes.object.isRequired,
  rowIndex: PropTypes.number,
  row: PropTypes.object,
  updateCar: PropTypes.func.isRequired,
  deleteCar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Car: state.Car,
});

export default connect(mapStateToProps, {
  updateCar: updateCarRequest,
  deleteCar: deleteCarRequest,
})(CarTableRow);
