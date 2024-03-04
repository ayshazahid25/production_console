import PropTypes from 'prop-types';

import { useState, memo, useCallback } from 'react';

//
import { Box, Grid, Stack, Typography, IconButton, CircularProgress, Link } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// Moment for date
import moment from 'moment';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const OrderHistory = memo(({ list, handleHistory, value = null, clearList, isComment = false }) => {
  const [click, setCLick] = useState(null);

  const arrow = 'bottom-center';

  const [historyIndex, setHistoryIndex] = useState(0);

  const handleClose = useCallback(() => {
    setHistoryIndex(0);
    clearList();
    setCLick(null);
  }, [clearList]);

  const moveBackward = useCallback(() => {
    setHistoryIndex((prevState) => prevState - 1);
  }, []);

  const moveForward = useCallback(() => {
    setHistoryIndex((prevState) => prevState + 1);
  }, []);

  const StyledRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
  }));

  const handleClick = useCallback(
    (event) => {
      if (value) {
        handleHistory(value);
      } else {
        handleHistory();
      }
      setCLick(event.currentTarget);
    },
    [handleHistory, value]
  );

  return (
    <>
      {isComment ? (
        <>
          {/* <IconButton onClick={handleClick} color="default" size="small">
            <Iconify icon="mdi-light:comment-text" />
          </IconButton> */}
          <Link component="button" variant="subtitle2" underline="hover" onClick={handleClick}>
            view all
          </Link>

          <MenuPopover open={click} onClose={handleClose} arrow={arrow}>
            {list ? (
              (list.length !== 0 && (
                <>
                  <Box sx={{ p: 1, pb: 0.5, maxWidth: 280, minWidth: 250 }}>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="subtitle1">Comment</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        display="flex"
                        sx={{ flexDirection: 'row-reverse' }}
                        alignItems="center"
                      >
                        <IconButton
                          size="small"
                          disabled={!historyIndex}
                          onClick={moveBackward}
                          variant="soft"
                        >
                          <Iconify icon="ic:round-keyboard-arrow-right" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={moveForward}
                          disabled={list.length - 1 === historyIndex}
                          variant="soft"
                        >
                          <Iconify icon="ic:round-keyboard-arrow-left" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ pt: 0.5, pb: 0.5, maxWidth: 290, minWidth: 250 }}>
                    <StyledRoot>
                      <Stack direction="column">
                        <Stack direction="row">
                          <CustomAvatar
                            src={list[historyIndex].profileImage}
                            // src={
                            //   order_items_order_id
                            //     ? order_items_order_id[0].asin_in_order_items.image
                            //     : ''
                            // }
                            variant="rounded"
                            alt={list[historyIndex].full_name}
                            name={list[historyIndex].full_name}
                          />
                          <Stack
                            direction="column"
                            display="inline-block"
                            sx={{ ml: 1, minWidth: 0 }}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {list[historyIndex].full_name}
                            </Typography>
                            <Typography variant="caption" noWrap>
                              {moment(list[historyIndex].added_at).format(
                                'ddd, DD MMM YYYY, hh:mm A'
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography variant="body1">{list[historyIndex].content}</Typography>
                      </Stack>
                    </StyledRoot>
                  </Box>

                  {/* <Box sx={{ p: 1, pt: 0.5, maxWidth: 280, minWidth: 250 }}>
                      <Typography variant="body1" display="inline">
                        {`"${list[historyIndex].content}"`}
                      </Typography>
                    </Box> */}
                </>
              )) || (
                <Box sx={{ maxWidth: 280, minWidth: 250 }}>
                  <Stack alignItems="center" direction="row" justifyContent="center" sx={{ my: 1 }}>
                    <Iconify icon="fluent:history-dismiss-48-filled" />
                    <Typography variant="subtitle2">No Comment</Typography>
                  </Stack>
                </Box>
              )
            ) : (
              <Box sx={{ maxWidth: 280, minWidth: 250 }}>
                <Stack alignItems="center" sx={{ my: 1 }}>
                  <CircularProgress color="primary" />
                </Stack>
              </Box>
            )}
          </MenuPopover>
        </>
      ) : (
        <>
          {/* <IconButton color="default" size="small">
              //{' '}
            </IconButton> */}

          <IconButton onClick={handleClick} color="default" size="small">
            <Iconify icon="tabler:history-toggle" />
          </IconButton>
          <MenuPopover open={click} onClose={handleClose} arrow={arrow}>
            {list ? (
              (list.length !== 0 && (
                <>
                  <Box sx={{ p: 1, pb: 0.5, maxWidth: 280, minWidth: 250 }}>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="subtitle1">Edit History</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        display="flex"
                        sx={{ flexDirection: 'row-reverse' }}
                        alignItems="center"
                      >
                        <IconButton
                          size="small"
                          disabled={!historyIndex}
                          onClick={moveBackward}
                          variant="soft"
                        >
                          <Iconify icon="ic:round-keyboard-arrow-right" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={moveForward}
                          disabled={list.length - 1 === historyIndex}
                          variant="soft"
                        >
                          <Iconify icon="ic:round-keyboard-arrow-left" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ pt: 0.5, pb: 0.5, maxWidth: 280, minWidth: 250 }}>
                    <StyledRoot>
                      <CustomAvatar
                        src={list[historyIndex].profileImage}
                        // src={
                        //   order_items_order_id
                        //     ? order_items_order_id[0].asin_in_order_items.image
                        //     : ''
                        // }
                        variant="rounded"
                        alt={list[historyIndex].full_name}
                        name={list[historyIndex].full_name}
                      />

                      <Stack direction="column" sx={{ ml: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          {list[historyIndex].full_name}
                          {/* {`${user_processed_order}`} */}
                        </Typography>
                        <Typography variant="caption" noWrap>
                          {moment(list[historyIndex].added_at).format('ddd, DD MMM YYYY, hh:mm A')}
                        </Typography>
                      </Stack>
                    </StyledRoot>
                  </Box>
                  {list.length - 1 === historyIndex ? (
                    <Box sx={{ p: 1, pt: 0.5, maxWidth: 280, minWidth: 250 }}>
                      <Typography variant="subtitle1" display="inline">
                        Added: &nbsp;
                      </Typography>
                      <Typography variant="body1" display="inline">
                        {`"${list[historyIndex].value}"`}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ p: 1, pt: 0.5, maxWidth: 280, minWidth: 250 }}>
                      <Typography variant="subtitle1" display="inline">
                        Replaced: &nbsp;
                      </Typography>
                      <Typography variant="body1" display="inline">
                        {`"${list[historyIndex + 1].value}"`} &nbsp;
                      </Typography>
                      <Typography variant="subtitle1" display="inline">
                        with &nbsp;
                      </Typography>
                      <Typography variant="body1" display="inline">
                        {`"${list[historyIndex].value}"`}
                      </Typography>
                    </Box>
                  )}
                </>
              )) || (
                <Box sx={{ maxWidth: 280, minWidth: 250 }}>
                  <Stack alignItems="center" direction="row" justifyContent="center" sx={{ my: 1 }}>
                    <Iconify icon="fluent:history-dismiss-48-filled" />
                    <Typography variant="subtitle2">No History</Typography>
                  </Stack>
                </Box>
              )
            ) : (
              <Box sx={{ maxWidth: 280, minWidth: 250 }}>
                <Stack alignItems="center" sx={{ my: 1 }}>
                  <CircularProgress color="primary" />
                </Stack>
              </Box>
            )}
          </MenuPopover>
        </>
      )}
    </>
  );
});

OrderHistory.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  handleHistory: PropTypes.func,
  clearList: PropTypes.func,
  value: PropTypes.string,
  isComment: PropTypes.bool,
};

export default OrderHistory;
