import PropTypes from 'prop-types';
import { useEffect, useState, memo, useCallback } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Drawer, IconButton } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import ChatNavHeader from '../../../../components/chat/ChatNavHeader';

//
import ChatNavList from './ChatNavList';
import ChatNavSearch from './ChatNavSearch';
import ChatNavSearchResults from './ChatNavSearchResults';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => <IconButton disableRipple {...props} />)(
  ({ theme }) => ({
    left: 0,
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    top: theme.spacing(13),
    borderRadius: `0 12px 12px 0`,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.customShadows.primary,
    '&:hover': {
      backgroundColor: theme.palette.primary.darker,
    },
  })
);

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

const ChatNav = memo(
  ({
    conversations,
    activeConversationId,
    user,
    searchContacts,
    setSearchContacts,
    handleSelectContact,
    handleNewChat,
    liveUsers,
  }) => {
    const theme = useTheme();

    const isDesktop = useResponsive('up', 'md');

    const [openNav, setOpenNav] = useState(false);

    const [searchResults, setSearchResults] = useState([]);

    const [focusIn, setFocusIn] = useState(false);

    const isCollapse = isDesktop && !openNav;

    useEffect(() => {
      if (!isDesktop) {
        handleCloseNav();
      } else {
        handleOpenNav();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDesktop]);

    const handleToggleNav = useCallback(() => {
      setOpenNav(!openNav);
    }, [openNav]);

    const handleOpenNav = useCallback(() => {
      setOpenNav(true);
    }, []);

    const handleCloseNav = useCallback(() => {
      setOpenNav(false);
    }, []);

    const applyFilter = useCallback(
      (filterName) => {
        // convert the "byId" object into array and than use .filter function
        const filterData = Object.values(conversations.byId).filter(
          (conversationData) =>
            conversationData.receiver.full_name.toLowerCase().indexOf(filterName.toLowerCase()) !==
            -1
        );

        return filterData;
      },
      [conversations]
    );

    const handleChangeSearch = useCallback(
      async (event) => {
        try {
          const { value } = event.target;

          setSearchContacts(value);

          if (value) {
            setSearchResults(applyFilter(value));
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error(error);
        }
      },
      [applyFilter, setSearchContacts]
    );

    const selected = useCallback(
      (conversationId) => activeConversationId === conversationId,
      [activeConversationId]
    );

    const handleClickAway = useCallback(() => {
      if (focusIn) {
        setFocusIn(false);
        setSearchContacts('');
      }
    }, [focusIn, setSearchContacts]);

    const handleFocus = useCallback(() => setFocusIn(true), []);

    const renderContent = (
      <>
        <Box sx={{ p: 2.5 }}>
          <ChatNavHeader
            user={user}
            isCollapse={isCollapse}
            openNav={openNav}
            handleToggleNav={handleToggleNav}
            handleNewChat={handleNewChat}
          />

          {!isCollapse && (
            <ChatNavSearch
              value={searchContacts}
              onChange={handleChangeSearch}
              handleFocus={handleFocus}
              onClickAway={handleClickAway}
            />
          )}
        </Box>

        <Scrollbar>
          {!searchContacts ? (
            <ChatNavList
              openNav={openNav}
              onCloseNav={handleCloseNav}
              conversations={conversations}
              selected={selected}
              onSelectContact={handleSelectContact}
              liveUsers={liveUsers}
            />
          ) : (
            <ChatNavSearchResults
              searchContacts={searchContacts}
              searchResults={searchResults}
              onSelectContact={handleSelectContact}
            />
          )}
        </Scrollbar>
      </>
    );

    return (
      <>
        {!isDesktop && (
          <StyledToggleButton onClick={handleToggleNav}>
            <Iconify width={16} icon="eva:people-fill" />
          </StyledToggleButton>
        )}

        {isDesktop ? (
          <Drawer
            open={openNav}
            variant="persistent"
            PaperProps={{
              sx: {
                pb: 1,
                width: 1,
                position: 'static',
                ...(isCollapse && {
                  transform: 'none !important',
                  visibility: 'visible !important',
                }),
              },
            }}
            sx={{
              width: NAV_WIDTH,
              transition: theme.transitions.create('width'),
              ...(isCollapse && {
                width: NAV_COLLAPSE_WIDTH,
              }),
            }}
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={handleCloseNav}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                pb: 1,
                width: NAV_WIDTH,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </>
    );
  }
);

ChatNav.propTypes = {
  conversations: PropTypes.object,
  user: PropTypes.object.isRequired,
  activeConversationId: PropTypes.string,
  searchContacts: PropTypes.string,
  setSearchContacts: PropTypes.func,
  handleSelectContact: PropTypes.func,
  handleNewChat: PropTypes.func,
  liveUsers: PropTypes.object,
};

export default ChatNav;
