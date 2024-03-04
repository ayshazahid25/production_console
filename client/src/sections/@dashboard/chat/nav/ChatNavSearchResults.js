import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Typography, ListItemButton, ListItemText, ListItemAvatar } from '@mui/material';
// components
import SearchNotFound from '../../../../components/search-not-found';
import { CustomAvatar } from '../../../../components/custom-avatar';
// ----------------------------------------------------------------------

const ChatNavSearchResults = memo(({ searchContacts, searchResults, onSelectContact }) => {
  const isNotFound = !searchResults.length && !!searchContacts;

  const isUnread = false;
  return (
    <>
      <Typography
        paragraph
        variant="h6"
        sx={{
          px: 2.5,
        }}
      >
        Contacts
      </Typography>

      {isNotFound ? (
        <SearchNotFound
          query={searchContacts}
          sx={{
            p: 3,
            mx: 'auto',
            width: `calc(100% - 40px)`,
            bgcolor: 'background.neutral',
          }}
        />
      ) : (
        <>
          {searchResults.map((result) => (
            <ListItemButton
              key={result.id}
              onClick={() => onSelectContact(result)}
              sx={{
                px: 2.5,
                py: 1.5,
                typography: 'subtitle2',
              }}
            >
              <ListItemAvatar>
                <CustomAvatar
                  key={result.id}
                  alt={result.receiver.full_name}
                  src={result.receiver.profileImage}
                  name={result.receiver.full_name}
                  variant="rounded"
                  sx={{ width: 48, height: 48 }}
                />
              </ListItemAvatar>

              <ListItemText
                primary={result.receiver.full_name}
                primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
                secondary={result.last_message.message_text}
                secondaryTypographyProps={{
                  noWrap: true,
                  variant: isUnread ? 'subtitle2' : 'body2',
                  color: isUnread ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItemButton>
            //   {/* <Avatar alt={result.receiver.full_name} src={null} sx={{ mr: 2 }} /> */}
          ))}
        </>
      )}
    </>
  );
});

ChatNavSearchResults.propTypes = {
  searchResults: PropTypes.array,
  onSelectContact: PropTypes.func,
  searchContacts: PropTypes.string,
};

export default ChatNavSearchResults;
