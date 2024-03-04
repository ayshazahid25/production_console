import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { InputAdornment, ClickAwayListener } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { CustomTextField } from '../../../../components/custom-input';

// ----------------------------------------------------------------------

const ChatNavSearch = memo(({ value, onChange, handleFocus, onClickAway }) => (
  <ClickAwayListener onClickAway={onClickAway}>
    <CustomTextField
      fullWidth
      size="small"
      value={value}
      onFocus={handleFocus}
      onChange={onChange}
      placeholder="Search contacts..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ mt: 2.5 }}
    />
  </ClickAwayListener>
));

ChatNavSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  handleFocus: PropTypes.func,
  onClickAway: PropTypes.func,
};

export default ChatNavSearch;
