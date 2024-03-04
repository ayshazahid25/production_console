import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useEffect, useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Stack } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSnackbar } from '../../../components/snackbar';
// sections
import ChatNav from './nav/ChatNav';
import ChatRoom from './room/ChatRoom';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';
import ChatHeaderDetail from './header/ChatHeaderDetail';
import ChatHeaderCompose from './header/ChatHeaderCompose';

// actions
import {
  getConversationsRequest,
  sendMessageByIdRequest,
  getMessageByIdRequest,
  clearMessageList,
  clearSelectedConversation,
  sendComposeMessageRequest,
  clearConversationList,
  clearError,
  clearMessage,
} from '../../../actions/chat';
import { getActiveUsersRequest } from '../../../actions/users';

// ----------------------------------------------------------------------

const Chat = memo(
  ({
    Chat: { conversations, messageList, selectedConversation, error, message },
    Auth: { user, isAuthenticated },
    Users: { activeUsers, liveUsers },
    // eslint-disable-next-line
    getConversationsRequest,
    // eslint-disable-next-line
    sendMessageByIdRequest,
    getActiveUsers,
    // eslint-disable-next-line
    getMessageByIdRequest,
    // eslint-disable-next-line
    clearMessageList,
    // eslint-disable-next-line
    clearSelectedConversation,
    // eslint-disable-next-line
    sendComposeMessageRequest,
    // eslint-disable-next-line
    clearConversationList,
    // eslint-disable-next-line
    clearError,
    // eslint-disable-next-line
    clearMessage,
  }) => {
    const { themeStretch } = useSettingsContext();

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const [messageText, setMessageText] = useState(null);

    const [recipients, setRecipients] = useState([]);

    // ChatNav Argument
    const [conversation, setConversation] = useState(null);
    const [searchContacts, setSearchContacts] = useState('');

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(PATH_AUTH.login, { replace: true });
      }
      if (message) {
        enqueueSnackbar(message);
        // clearMessage
        clearMessage();
      }
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
      // eslint-disable-next-line
    }, [isAuthenticated, message, error]);

    useEffect(() => {
      if (conversation) {
        getMessageByIdRequest(conversation);
      }
      // eslint-disable-next-line
    }, [conversation]);

    useEffect(() => {
      getConversationsRequest();
      getActiveUsers();
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (messageText) {
        if (selectedConversation && recipients.length === 0) {
          sendMessageByIdRequest(
            messageText,
            selectedConversation.id,
            selectedConversation.receiver.user_id,
            selectedConversation.sender.full_name
          );
        } else if (recipients.length > 0) {
          sendComposeMessageRequest(messageText, recipients);
        }
      }
      // eslint-disable-next-line
    }, [messageText]);

    useEffect(
      () => () => {
        clearMessageList();
        clearSelectedConversation();
        clearConversationList();
        clearError();
      },
      // eslint-disable-next-line
      []
    );

    const handleAddRecipients = useCallback((selectedRecipients) => {
      setRecipients(selectedRecipients);
    }, []);

    const handleSendMessage = useCallback((value) => {
      setMessageText(value);
    }, []);

    const handleSelectContact = useCallback((value) => {
      setRecipients([]);
      setSearchContacts('');
      setConversation(value);
    }, []);

    const handleNewChat = useCallback(() => {
      clearMessageList();
      clearSelectedConversation();
      setSearchContacts('');
      setConversation(null);
    }, [clearSelectedConversation, clearMessageList]);

    return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Chat"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Chat' },
          ]}
        />

        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatNav
            conversations={conversations}
            activeConversationId={selectedConversation?.id}
            user={user}
            conversation={conversation}
            setConversation={setConversation}
            searchContacts={searchContacts}
            setSearchContacts={setSearchContacts}
            handleSelectContact={handleSelectContact}
            handleNewChat={handleNewChat}
            liveUsers={liveUsers}
          />

          <Stack flexGrow={1}>
            {!selectedConversation ? (
              <ChatHeaderCompose
                recipients={recipients}
                contacts={activeUsers || []}
                onAddRecipients={handleAddRecipients}
              />
            ) : (
              <ChatHeaderDetail participants={selectedConversation?.receiver} />
            )}

            <Stack
              direction="row"
              flexGrow={1}
              sx={{
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Stack flexGrow={1}>
                <ChatMessageList
                  messageList={messageList}
                  user={user}
                  selectedConversation={selectedConversation}
                />

                <ChatMessageInput
                  // conversationId={selectedConversation?.id}
                  onSend={handleSendMessage}
                  // disabled={
                  //   pathname === PATH_DASHBOARD.chat.root || pathname === PATH_DASHBOARD.chat.new
                  // }
                />
              </Stack>

              {selectedConversation && <ChatRoom participants={selectedConversation.receiver} />}
            </Stack>
          </Stack>
        </Card>
      </Container>
    );
  }
);

Chat.propTypes = {
  Chat: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  Users: PropTypes.object.isRequired,
  getConversationsRequest: PropTypes.func.isRequired,
  sendMessageByIdRequest: PropTypes.func.isRequired,
  getActiveUsers: PropTypes.func.isRequired,
  getMessageByIdRequest: PropTypes.func.isRequired,
  clearMessageList: PropTypes.func.isRequired,
  clearSelectedConversation: PropTypes.func.isRequired,
  sendComposeMessageRequest: PropTypes.func.isRequired,
  clearConversationList: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Chat: state.Chat,
  Auth: state.Auth,
  Users: state.Users,
});

export default connect(mapStateToProps, {
  getConversationsRequest,
  sendMessageByIdRequest,
  getActiveUsers: getActiveUsersRequest,
  getMessageByIdRequest,
  clearMessageList,
  clearSelectedConversation,
  sendComposeMessageRequest,
  clearConversationList,
  clearError,
  clearMessage,
})(Chat);
