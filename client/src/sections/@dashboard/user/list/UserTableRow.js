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
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  useEffect(() => {
    if (message) {
      handleCloseConfirm();
      handleCloseActiveConfirm();
    }
    // eslint-disable-next-line
  }, [message]);

  const { title, first_name, last_name, email, contract_durations, is_active, phone_number } = row;

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
        {user && user.is_admin && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
              {title}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
              {first_name} {last_name}
              {user && user.is_admin && (
                <IconButton
                  sx={{ padding: '0px 0px 3px 3px' }}
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
        <TableCell align="left">
          {moment(contract_durations[0].start_date).format('YYYY-MM-DD')}
        </TableCell>
        {/* show employment_type */}
        <TableCell align="center">
          <Label
            variant="soft"
            color={
              contract_durations[contract_durations.length - 1].employment_type === 'permanent'
                ? 'info'
                : contract_durations[contract_durations.length - 1].employment_type === 'probation'
                ? 'warning'
                : contract_durations[contract_durations.length - 1].employment_type === 'internship'
                ? 'primary'
                : contract_durations[contract_durations.length - 1].employment_type === 'contract'
                ? 'secondary'
                : 'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {contract_durations[contract_durations.length - 1].employment_type}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              // eslint-disable-next-line no-nested-ternary
              is_active ? 'success' : 'error'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {
              // eslint-disable-next-line no-nested-ternary
              is_active ? 'Active' : 'Banned'
            }
          </Label>
        </TableCell>

        {user && user.is_admin && (
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
        {user && user.is_admin && (
          <MenuItem
            onClick={() => {
              if (!is_active) {
                handleOpenActiveConfirm();
              } else {
                handleOpenConfirm();
              }
              handleClosePopover();
            }}
            sx={{ color: (is_active && 'error.main') || 'primary.main' }}
          >
            <Iconify icon="mdi:person-block-outline" />
            {(is_active && 'Banned') || 'Active'}
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
