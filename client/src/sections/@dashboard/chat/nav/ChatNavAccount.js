import PropTypes from 'prop-types';
import { memo, useState } from 'react';
// @mui
import {
  // List,
  Stack,
  // Select,
  // Divider,
  // Tooltip,
  // MenuItem,
  Typography,
  Box,
  // IconButton,
} from '@mui/material';
// auth

// components
// import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import BadgeStatus from '../../../../components/badge-status';

// ----------------------------------------------------------------------

// const STATUS = ['online', 'invisible', 'away'];

const ChatNavAccount = memo(({ user }) => {
  // const [status, setStatus] = useState('online');

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <CustomAvatar
        src={user?.user_has_profile_pic?.file_data}
        alt={user?.first_name}
        name={user?.first_name}
        variant="rounded"
        sx={{
          cursor: 'pointer',
          // width: 28,
          // height: 28,
        }}
        BadgeProps={{
          badgeContent: (
            <BadgeStatus
              status="online"
              // status={status}
            />
          ),
        }}
        onClick={handleOpenPopover}
        // sx={{ cursor: 'pointer', width: 48, height: 48 }}
      />

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="top-left" sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, pr: 1, pl: 2.5 }}>
          <div>
            <Typography noWrap variant="subtitle2">
              {user?.first_name}
            </Typography>

            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </div>

          {/* <Tooltip title="Log out">
            <IconButton color="error">
              <Iconify icon="ic:round-power-settings-new" />
            </IconButton>
          </Tooltip> */}
        </Stack>

        {/* <Divider />

        <List sx={{ px: 1 }}>
          <MenuItem>
            <BadgeStatus size="large" status={status} sx={{ m: 0.5, flexShrink: 0 }} />

            <Select
              native
              fullWidth
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  p: 0,
                  pl: 2,
                  typography: 'body2',
                  textTransform: 'capitalize',
                },
                '& .MuiNativeSelect-icon': {
                  right: -16,
                  top: 'unset',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  display: 'none',
                },
              }}
            >
              {STATUS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </MenuItem> */}

        {/* <MenuItem>
            <Iconify icon="ic:round-account-box" />
            Profile
          </MenuItem>

          <MenuItem>
            <Iconify icon="eva:settings-2-fill" />
            Settings
          </MenuItem> */}
        {/* </List> */}
      </MenuPopover>
      <Box sx={{ flexGrow: 1 }} />
    </>
  );
});

ChatNavAccount.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ChatNavAccount;
