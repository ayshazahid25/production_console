import PropTypes from 'prop-types';
import { useState, memo, useCallback } from 'react';
// @mui
import { InputBase, IconButton, InputAdornment } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const ChatMessageInput = memo(
  ({
    // disabled,
    // conversationId,
    onSend,
    sx,
    ...other
  }) => {
    const [message, setMessage] = useState('');

    const handleClick = useCallback(() => {
      if (onSend && message) {
        onSend(message);
      }
      setMessage('');
    }, [onSend, message]);

    const handleSend = useCallback(
      (event) => {
        if (event.key === 'Enter') {
          if (onSend && message) {
            onSend(message);
          }
          setMessage('');
        }
      },
      [onSend, message]
    );

    return (
      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <IconButton size="small">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <IconButton
            // disabled={disabled}
            size="large"
            // color="primary"
            // sx={{ p: 0 }}
            onClick={handleClick}
          >
            <Iconify icon="mdi:send-circle" sx={{ width: '30px', height: '30px' }} />
          </IconButton>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />
    );
  }
);
ChatMessageInput.propTypes = {
  sx: PropTypes.object,
  onSend: PropTypes.func,
  // disabled: PropTypes.bool,
  // conversationId: PropTypes.string,
};

export default ChatMessageInput;
