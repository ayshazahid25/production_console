import PropTypes from 'prop-types';
import { useEffect, useRef, memo } from 'react';
//
import Scrollbar from '../../../../components/scrollbar';
// import Lightbox from '../../../../components/lightbox';
//
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

const ChatMessageList = memo(({ messageList, user, selectedConversation }) => {
  const scrollRef = useRef(null);

  // const [selectedImage, setSelectedImage] = useState(-1);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    // eslint-disable-next-line
  }, [messageList]);

  // const imagesLightbox = conversation.messageList  //   .filter((messages) => messages.contentType === 'image')
  //   .map((messages) => ({ src: messages.body }));

  // const handleOpenLightbox = (imageUrl) => {
  //   const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
  //   setSelectedImage(imageIndex);
  // };

  // const handleCloseLightbox = () => {
  //   setSelectedImage(-1);
  // };

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{
          ref: scrollRef,
        }}
        sx={{ p: 3, height: 1 }}
      >
        {messageList.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            selectedConversation={selectedConversation}
            user={user}
            // conversation={conversation}
            // onOpenLightbox={() => handleOpenLightbox(message.body)}
          />
        ))}
      </Scrollbar>

      {/* <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
      /> */}
    </>
  );
});

ChatMessageList.propTypes = {
  messageList: PropTypes.arrayOf(PropTypes.object),
  selectedConversation: PropTypes.object,
  user: PropTypes.object,
};

export default ChatMessageList;
