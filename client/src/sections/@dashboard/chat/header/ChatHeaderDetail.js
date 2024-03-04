import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import {
  Stack,
  // Box, Link,
  // IconButton,
  Typography,
} from '@mui/material';
// utils
// import { fToNow } from '../../../../utils/formatTime';
// components
// import Iconify from '../../../../components/iconify';
// import BadgeStatus from '../../../../components/badge-status';
import {
  CustomAvatar,
  // CustomAvatarGroup
} from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------

// const isGroup = participants.length > 1;

// const participantInfo = participants.length ? participants[0] : null;

const ChatHeaderDetail = memo(({ participants }) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      p: (theme) => theme.spacing(2, 1, 2, 2),
    }}
  >
    {/* {isGroup ? (
        <Stack flexGrow={1}>
          <CustomAvatarGroup max={3}>
            {participants.map((participant) => (
              <CustomAvatar key={participant.id} alt={participant.name} src={participant.avatar} />
            ))}
          </CustomAvatarGroup> 

          <Link
            variant="body2"
            sx={{
              mt: 0.5,
              alignItems: 'center',
              display: 'inline-flex',
              color: 'text.secondary',
            }}
          >
            {participants.length} persons
            <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
          </Link>
        </Stack>
      ) : ( */}
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <CustomAvatar
        src={participants?.profileImage}
        alt={participants?.full_name}
        name={participants?.full_name}
        variant="rounded"
        sx={{
          width: 28,
          height: 28,
        }}
        // BadgeProps={{
        //   badgeContent: <BadgeStatus status={participantInfo?.status} />,
        // }}
      />

      <div>
        <Typography variant="subtitle2">{participants?.full_name}</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {participantInfo?.status === 'offline' ? (
              participantInfo?.lastActivity && fToNow(participantInfo?.lastActivity)
            ) : (
              <Box component="span" sx={{ textTransform: 'capitalize' }}>
                {participantInfo?.status}
              </Box>
            )}
          </Typography> */}
      </div>
    </Stack>
    {/* )} */}

    {/* <IconButton>
        <Iconify icon="eva:phone-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:video-fill" />
      </IconButton>

      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton> */}
  </Stack>
));

ChatHeaderDetail.propTypes = {
  participants: PropTypes.object,
};

export default ChatHeaderDetail;
