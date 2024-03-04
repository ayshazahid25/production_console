import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import {
  Badge,
  Stack,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from '@mui/material';
// components
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';
import BadgeStatus from '../../../../components/badge-status';

// ----------------------------------------------------------------------

const ChatNavItem = memo(({ conversation, openNav, isSelected, onSelect, liveUsers }) => {
  const getDetails = useCallback(
    (conver) => {
      const otherParticipants = conver.receiver;
      const displayNames = otherParticipants.full_name;
      const currentUserId = conver.sender.user_id;
      const lastMessage = conver.last_message;
      const unReadMessage = conver.unreadMessageCount;
      const status = liveUsers.byId?.[otherParticipants.user_id]?.is_online ? 'online' : 'offline';
      let displayText = '';

      if (lastMessage) {
        const sender = lastMessage.send_by === currentUserId ? 'You: ' : '';

        const message = lastMessage.message_text;

        displayText = `${sender}${message}`;
      }
      return { otherParticipants, displayNames, displayText, unReadMessage, status };
      // const otherParticipants = conversation.participants.filter(
      //   (participant) => participant.id !== currentUserId
      // );
      // const displayNames = otherParticipants.map((participant) => participant.name).join(', ');

      // let displayText = '';

      // const lastMessage = conversation.messages[conversation.messages.length - 1];
      // if (lastMessage) {
      //   const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';

      //   const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

      //   displayText = `${sender}${message}`;
      // }
      // return { otherParticipants, displayNames, displayText };
    },
    [liveUsers]
  );

  const details = getDetails(conversation);

  const lastActivity = conversation.last_message.createdAt;

  const isGroup = false;
  const isUnread = !(details.unReadMessage === 0);

  const hasOnlineInGroup = isGroup;

  return (
    <ListItemButton
      disableGutters
      onClick={onSelect}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        {isGroup ? (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={hasOnlineInGroup && <BadgeStatus status="online" />}
          >
            <CustomAvatarGroup compact sx={{ width: 48, height: 48 }}>
              {details.otherParticipants.slice(0, 2).map((participant) => (
                <CustomAvatar
                  key={participant.id}
                  alt={participant.name}
                  src={participant.profileImage}
                  variant="rounded"
                />
              ))}
            </CustomAvatarGroup>
          </Badge>
        ) : (
          <CustomAvatar
            key={details.otherParticipants.id}
            alt={details.otherParticipants.full_name}
            src={details.otherParticipants.profileImage}
            name={details.otherParticipants.full_name}
            BadgeProps={{
              badgeContent: <BadgeStatus status={details.status} />,
            }}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          />
        )}
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
            primary={details.displayNames}
            primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
            secondary={details.displayText}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {formatDistanceToNowStrict(new Date(lastActivity), {
                addSuffix: false,
              })}
            </Typography>
            {isUnread && (
              <Badge sx={{ mr: 1 }} badgeContent={details.unReadMessage} max={100} color="info" />
            )}
            {/* // <BadgeStatus status="unread" size="small" />} */}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
});
ChatNavItem.propTypes = {
  openNav: PropTypes.bool,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  conversation: PropTypes.object,
  liveUsers: PropTypes.object,
};

export default ChatNavItem;

// ----------------------------------------------------------------------
