import PropTypes from 'prop-types';

import { noCase } from 'change-case';
import { memo } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../iconify';

const NotificationItem = memo(({ notification }) => {
  //   const { title } = renderContent(notification);
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        // ...(notification.isUnRead && {
        //   bgcolor: 'action.selected',
        // }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.createdAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
});
NotificationItem.propTypes = {
  notification: PropTypes.object,
  // notification: PropTypes.shape({
  //   id: PropTypes.string,
  //   avatar: PropTypes.node,
  //   type: PropTypes.string,
  //   title: PropTypes.string,
  //   isUnRead: PropTypes.bool,
  //   description: PropTypes.string,
  //   createdAt: PropTypes.instanceOf(Date),
  // }),
};

export default NotificationItem;
// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      CHAT
      {/* {notification.title} */}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.message_text)}
        {/* &nbsp; {noCase(notification.description)} */}
      </Typography>
    </Typography>
  );

  //   if (notification.type === 'order_placed') {
  //     return {
  //       avatar: <img alt={notification.title} src="/assets/icons/notification/ic_package.svg" />,
  //       title,
  //     };
  //   }
  //   if (notification.type === 'order_shipped') {
  //     return {
  //       avatar: <img alt={notification.title} src="/assets/icons/notification/ic_shipping.svg" />,
  //       title,
  //     };
  //   }
  //   if (notification.type === 'mail') {
  //     return {
  //       avatar: <img alt={notification.title} src="/assets/icons/notification/ic_mail.svg" />,
  //       title,
  //     };
  //   }
  //   if (notification.type === 'chat_message') {
  //     return {
  //       avatar: <img alt={notification.title} src="/assets/icons/notification/ic_chat.svg" />,
  //       title,
  //     };
  //   }
  //   return {
  // avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
  //     title,
  //   };
  return {
    avatar: <img alt={notification.title} src="/assets/icons/notification/ic_chat.svg" />,
    title,
  };
}
