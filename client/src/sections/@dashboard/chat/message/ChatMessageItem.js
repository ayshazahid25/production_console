import PropTypes from 'prop-types';
import { memo } from 'react';
import moment from 'moment';
// import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Typography, Stack } from '@mui/material';

// components
import { CustomAvatar } from '../../../../components/custom-avatar';
// import Image from '../../../../components/image';

// ----------------------------------------------------------------------

const ChatMessageItem = memo(
  ({
    message,
    selectedConversation,
    user,
    // onOpenLightbox
  }) => {
    const sender = selectedConversation.receiver;

    const senderDetails =
      message.send_by === user.id
        ? {
            type: 'me',
          }
        : {
            profileImage: sender?.profileImage,
            name: sender?.full_name,
          };

    const currentUser = senderDetails.type === 'me';

    // const isImage = message.contentType === 'image';

    const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

    return (
      <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
        {!currentUser && (
          <CustomAvatar
            alt={senderDetails.name}
            name={senderDetails.name}
            src={senderDetails.profileImage}
            // sx={{ width: 32, height: 32, mr: 2 }}
            variant="rounded"
            sx={{
              width: 28,
              height: 28,
              mr: 2,
            }}
          />

          // <Avatar
          //   alt={senderDetails.name}
          //   src={senderDetails.avatar}
          //   sx={{ width: 32, height: 32, mr: 2 }}
          // />
        )}

        <Stack spacing={1} alignItems="flex-end">
          <Typography
            noWrap
            variant="caption"
            sx={{
              color: 'text.disabled',
              ...(!currentUser && {
                mr: 'auto',
              }),
            }}
          >
            {!currentUser && `${firstName},`} &nbsp;
            {moment(new Date(message.createdAt)).utc(true).format('DD/MM/YYYY hh:mm A')}
            {/* {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })} */}
          </Typography>

          <Stack
            sx={{
              p: 1.5,
              minWidth: 48,
              maxWidth: 320,
              borderRadius: 1,
              overflow: 'hidden',
              typography: 'body2',
              bgcolor: 'background.neutral',
              ...(currentUser && {
                color: 'grey.800',
                bgcolor: 'primary.lighter',
              }),
              // ...(isImage && {
              //   p: 0,
              // }),
            }}
          >
            {/* {isImage ? (
            <Image
              alt="attachment"
              src={message.body}
              onClick={() => onOpenLightbox(message.body)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
          ) : ( */}
            {message.message_text}
            {/* )} */}
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  selectedConversation: PropTypes.object,
  user: PropTypes.object,
  // onOpenLightbox: PropTypes.func,
};

export default ChatMessageItem;
