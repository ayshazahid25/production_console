import PropTypes from 'prop-types';
import { useState, memo } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Chip, Stack, TextField, Typography, Autocomplete } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import SearchNotFound from '../../../../components/search-not-found';
import { CustomAvatar } from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------

const ChatHeaderCompose = memo(({ contacts, recipients, onAddRecipients, sx, ...other }) => {
  const [searchRecipients, setSearchRecipients] = useState('');

  const handleAddRecipients = (selectedRecipients) => {
    setSearchRecipients('');
    onAddRecipients(selectedRecipients);
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      sx={{
        py: 2,
        px: 2.5,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        To:
      </Typography>

      <Autocomplete
        sx={{ minWidth: 240 }}
        multiple
        popupIcon={null}
        noOptionsText={<SearchNotFound query={searchRecipients} />}
        onChange={(event, value) => handleAddRecipients(value)}
        onInputChange={(event, value) => setSearchRecipients(value)}
        options={contacts}
        getOptionLabel={(option) => option.full_name}
        isOptionEqualToValue={(option, v) => v && option.id === v.id}
        handleHomeEndKeys
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder={recipients.length ? '+Recipients' : ''}
          />
        )}
        renderOption={(props, recipient, { inputValue, selected }) => {
          const { id, full_name, profileImage } = recipient;
          const matches = match(full_name, inputValue);
          const parts = parse(full_name, matches);

          return (
            <Box
              component="li"
              key={id}
              sx={{
                p: '12px !important',
              }}
              {...props}
            >
              <Box
                sx={{
                  mr: 1.5,
                  width: 32,
                  height: 32,
                  overflow: 'hidden',
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <CustomAvatar
                  key={id}
                  sx={{ width: 32, height: 32 }}
                  alt={full_name}
                  name={full_name}
                  src={profileImage}
                />
                <Box
                  sx={{
                    top: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                    transition: (theme) =>
                      theme.transitions.create('opacity', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                      }),
                    ...(selected && {
                      opacity: 1,
                      color: 'primary.main',
                    }),
                  }}
                >
                  <Iconify icon="eva:checkmark-fill" />
                </Box>
              </Box>

              {parts.map((part, index) => (
                <Typography
                  key={index}
                  variant="subtitle2"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                >
                  {part.text}
                </Typography>
              ))}
            </Box>
          );
        }}
        renderTags={(selectedRecipients, getTagProps) =>
          selectedRecipients.map((recipient, index) => (
            <Chip
              {...getTagProps({ index })}
              key={recipient.id}
              size="small"
              label={recipient.full_name}
              avatar={
                <CustomAvatar
                  key={recipient.id}
                  alt={recipient.full_name}
                  name={recipient.full_name}
                  src={recipient.profileImage}
                />
              }
            />
          ))
        }
      />
    </Stack>
  );
});
ChatHeaderCompose.propTypes = {
  sx: PropTypes.object,
  contacts: PropTypes.array,
  recipients: PropTypes.array,
  onAddRecipients: PropTypes.func,
};

export default ChatHeaderCompose;
