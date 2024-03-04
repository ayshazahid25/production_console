import { useState, useEffect, memo, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { Stack, TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
// import ConfirmDialog from '../../../../components/confirm-dialog';
// ----------------------------------------------------------------------
import { CustomAvatar } from '../../../../components/custom-avatar';
// ----------------------------------------------------------------------

const WareHouseTableRow = memo(
  ({
    WareHouse: { message },
    user,
    row,
    selected,
    onEditRow,
    // onSelectRow,
    // onDeleteRow,
    // onActiveRow,
  }) => {
    useEffect(() => {
      if (message) {
        // handleCloseConfirm();
        // handleCloseActiveConfirm();
      }
      // eslint-disable-next-line
    }, [message]);

    const { name, address_1, city, country, country_code, postal_code, state_or_region, active } =
      row;

    // const [openConfirm, setOpenConfirm] = useState(false);
    // const [openActiveConfirm, setOpenActiveConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    // const handleOpenConfirm = useCallback(() => {
    //   setOpenConfirm(true);
    // }, []);

    // const handleCloseConfirm = useCallback(() => {
    //   setOpenConfirm(false);
    // }, []);

    // const handleOpenActiveConfirm = useCallback(() => {
    //   setOpenActiveConfirm(true);
    // }, []);

    // const handleCloseActiveConfirm = useCallback(() => {
    //   setOpenActiveConfirm(false);
    // }, []);

    const handleOpenPopover = useCallback((event) => {
      setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
      setOpenPopover(null);
    }, []);

    return (
      <>
        <TableRow hover selected={selected}>
          {/* {user && user.permission_settings.user_create_view_and_edit && (
            <TableCell padding="checkbox">
              <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>
          )} */}
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* <Avatar alt={first_name} src={avatarUrl} /> */}
              {/* <Avatar sx={{ textTransform: 'capitalize' }} alt={full_name} src="/broken-image.jpg" /> */}

              <CustomAvatar src="/broken-image.jpg" alt={name} name={name} />

              <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
                {name}
                <IconButton
                  sx={{ padding: '0px 0px 3px 3px' }}
                  // color="primary"
                  onClick={() => {
                    onEditRow();
                    handleClosePopover();
                  }}
                >
                  <Iconify icon="material-symbols:edit-square-outline" />
                </IconButton>
              </Typography>
            </Stack>
          </TableCell>

          <TableCell align="left">{address_1}</TableCell>
          <TableCell align="left">{city}</TableCell>
          <TableCell align="left">{country}</TableCell>
          <TableCell align="left">{country_code}</TableCell>
          <TableCell align="left">{postal_code}</TableCell>
          <TableCell align="left">{state_or_region}</TableCell>
          <TableCell align="center">
            <Iconify
              icon={active ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
              sx={{
                width: 20,
                height: 20,
                color: 'success.main',
                ...(!active && { color: 'warning.main' }),
              }}
            />
          </TableCell>

          {user && user.permission_settings.user_view_and_edit && (
            <TableCell align="right">
              <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </TableCell>
          )}
        </TableRow>

        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            {/* eva:edit-fill */}
            <Iconify icon="material-symbols:edit-square-outline" />
            Edit
          </MenuItem>
          {/* {user && user.permission_settings.user_create_view_and_edit && (
            <MenuItem
              disabled={active === 'leave'}
              onClick={() => {
                if (active === 'banned') {
                  handleOpenActiveConfirm();
                } else if (active === 'active') {
                  handleOpenConfirm();
                }
                handleClosePopover();
              }}
              sx={{ color: (active === 'active' && 'error.main') || 'primary.main' }}
            >
              <Iconify icon="mdi:person-block-outline" />
              {(active === 'active' && 'Banned') || 'Active'}
            </MenuItem>
          )} */}
        </MenuPopover>

        {/* <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Banned"
          content="Are you sure want to banned this user?"
          action={
            <Button variant="contained" color="error" onClick={onDeleteRow}>
              Banned
            </Button>
          }
        />

        <ConfirmDialog
          open={openActiveConfirm}
          onClose={handleCloseActiveConfirm}
          title="Active"
          content="Are you sure want to active this user?"
          action={
            <Button variant="contained" color="primary" onClick={onActiveRow}>
              Active
            </Button>
          }
        /> */}
      </>
    );
  }
);

WareHouseTableRow.propTypes = {
  WareHouse: PropTypes.object.isRequired,
  user: PropTypes.object,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  // onDeleteRow: PropTypes.func,
  // onActiveRow: PropTypes.func,
  // onSelectRow: PropTypes.func,
};

const mapStateToProps = (state) => ({
  WareHouse: state.WareHouse,
});

export default connect(mapStateToProps, {})(WareHouseTableRow);
