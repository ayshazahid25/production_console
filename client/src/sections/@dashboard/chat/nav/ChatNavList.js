import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { List } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import { SkeletonConversationItem } from '../../../../components/skeleton';
//
import ChatNavItem from './ChatNavItem';

// ----------------------------------------------------------------------

const ChatNavList = memo(
  ({ conversations, openNav, onCloseNav, selected, onSelectContact, liveUsers, sx, ...other }) => {
    const isDesktop = useResponsive('up', 'md');

    const loading = !conversations.allIds.length;

    return (
      <List disablePadding sx={sx} {...other}>
        {(loading ? [...Array(12)] : conversations.allIds).map((conversation, index) =>
          conversation ? (
            <ChatNavItem
              key={conversation}
              openNav={openNav}
              conversation={conversations.byId[conversation]}
              isSelected={selected(conversation)}
              onSelect={() => {
                if (!isDesktop) {
                  onCloseNav();
                }
                onSelectContact(conversations.byId[conversation]);
              }}
              liveUsers={liveUsers}
            />
          ) : (
            <SkeletonConversationItem key={index} />
          )
        )}
      </List>
    );
  }
);

ChatNavList.propTypes = {
  sx: PropTypes.object,
  openNav: PropTypes.bool,
  selected: PropTypes.func,
  onSelectContact: PropTypes.func,
  onCloseNav: PropTypes.func,
  conversations: PropTypes.object,
  liveUsers: PropTypes.object,
};

export default ChatNavList;
