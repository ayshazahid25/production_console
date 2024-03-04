import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import moment from 'moment';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------
import { CustomAvatar } from '../../../../components/custom-avatar';
// ----------------------------------------------------------------------

function UserTableRow({
  Users: { message },
  user,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onActiveRow,
}) {
  useEffect(() => {
    if (message) {
      handleCloseConfirm();
      handleCloseActiveConfirm();
    }
    // eslint-disable-next-line
  }, [message]);

  const {
    // id,
    full_name,
    email,
    phone_number,
    email_verified,
    status,
    profileImage,
    //  added_by_user,
    joined_at,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openActiveConfirm, setOpenActiveConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenActiveConfirm = () => {
    setOpenActiveConfirm(true);
  };

  const handleCloseActiveConfirm = () => {
    setOpenActiveConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {user && user.permission_settings.user_create_view_and_edit && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={first_name} src={avatarUrl} /> */}
            {/* <Avatar sx={{ textTransform: 'capitalize' }} alt={full_name} src="/broken-image.jpg" /> */}

            <CustomAvatar
              src={profileImage}
              alt={full_name}
              name={full_name}
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
              }}
            />

            <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
              {full_name}
              {user && user.permission_settings.user_view_and_edit && (
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
              )}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{email}</TableCell>
        <TableCell align="left">{phone_number}</TableCell>
        <TableCell align="left">{moment(joined_at).format('YYYY-MM-DD')}</TableCell>

        {/* <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell> */}

        <TableCell align="center">
          <Iconify
            icon={email_verified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!email_verified && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              // eslint-disable-next-line no-nested-ternary
              status === 'active' ? 'success' : status === 'banned' ? 'error' : 'warning'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {
              // eslint-disable-next-line no-nested-ternary
              status === 'active' ? 'Active' : status === 'banned' ? 'Banned' : 'Leave'
            }
          </Label>
        </TableCell>

        {/* <TableCell sx={{ textTransform: 'capitalize' }} align="left">
          {
             ? 
        //  
            //  .full_name : 
            ''}
        </TableCell> */}
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
        {user && user.permission_settings.user_create_view_and_edit && (
          <MenuItem
            disabled={status === 'leave'}
            onClick={() => {
              if (status === 'banned') {
                handleOpenActiveConfirm();
              } else if (status === 'active') {
                handleOpenConfirm();
              }
              handleClosePopover();
            }}
            sx={{ color: (status === 'active' && 'error.main') || 'primary.main' }}
          >
            <Iconify icon="mdi:person-block-outline" />
            {(status === 'active' && 'Banned') || 'Active'}
          </MenuItem>
        )}
      </MenuPopover>

      <ConfirmDialog
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
      />
    </>
  );
}

UserTableRow.propTypes = {
  Users: PropTypes.object.isRequired,
  user: PropTypes.object,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onActiveRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
});

export default connect(mapStateToProps, {})(UserTableRow);
