import { useState, useEffect, memo, useCallback } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  TableRow,
  Tooltip,
  TableCell,
  IconButton,
  Typography,
  Divider,
  Box,
  Grid,
  Link,
  Button,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Moment for date
import moment from 'moment';
// hooks
import { CopyToClipboard } from 'react-copy-to-clipboard';
// // components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import ConfirmDialog from '../../../../components/confirm-dialog';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import OrderHistory from '../orderDetails/OrderHistory';
// actions
import { getOrderHistoryRequest, takeOverRequest } from '../../../../actions/order';
import { getCommentsRequest, clearCommentListRequest } from '../../../../actions/comment';
// ----------------------------------------------------------------------
import { CustomAvatar } from '../../../../components/custom-avatar';
// ----------------------------------------------------------------------

const OrderTableRow = memo(
  ({
    Users: { message },
    Auth: { user },
    Comment: { comments },
    // Order: {
    //  orderHistory ,
    // assigmentOrderData,
    // },
    rowIndex,
    key,
    row,
    selected,
    onEditRow,
    // onSelectRow,
    // clearOrderHistory,
    getOrderHistory,
    getComments,
    clearCommentList,
    takeOver,
    setTakeOverId,
  }) => {
    const {
      id,
      earliest_delivery_date,
      earliest_ship_date,
      sales_channel,
      order_status,
      fulfillment_channel,
      number_of_items_unshipped,
      latest_Ship_date,
      latest_delivery_date,
      purchase_date,
      seller_order_id,
      is_business_order,
      order_total,
      // shipment_service_level_category,
      order_items_order_id,
      marketplace_id_in_orders,
      purchase_price,
      gross_profit,
      margin,
      user_processed_order,
      net_proceed,
      order_tracking_to_order,
      order_comments_order_id,
      user_assign_order,
    } = row || [];
    const orderItemsLength = order_items_order_id.length;

    const [isShown, setIsShown] = useState([]);

    const purcahseDate = moment(moment(new Date(purchase_date)), 'YYYYMMDDHHmm')
      .utc(false)
      .fromNow();

    // ******************************************

    const [vat, setVat] = useState(0);
    const [referFee, setReferFee] = useState(0);
    const [amazonFulfilmentFee, setAmazonFulfilmentFee] = useState(0);
    const [shippingTax, setShippingTax] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [buyerCancellationRequest, setBuyerCancellationRequest] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpenConfirm = () => {
      setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
      setOpenConfirm(false);
    };
    // const [totalItems, setTotalItems] = useState(0);

    // const [purchasePrice, setPurchasePrice] = useState(null);

    const roundNumber = (number) => Math.round((number + Number.EPSILON) * 100) / 100;

    const roundNetProceed = useCallback(
      (refer, item_tax, amazonFee) => {
        // netProceed formula = order_total - all_referralFee - all_item_tax - all_amazonFee
        let netProceed = order_total - refer - item_tax - amazonFee;
        netProceed = roundNumber(netProceed);

        setNetProfit(netProceed);
      },
      [order_total]
    );

    const calculateItemTaxAndReferFee = useCallback(() => {
      let show = [];
      let refer = 0;
      let totalVat = 0;
      let item_tax = 0;
      let amazonFee = 0;
      let shipping_tax = 0;
      let shipping_price = 0;
      let cancelRequest = false;
      // let itemsQuantity = 0;
      order_items_order_id.map((orderItem) => {
        show = [...show, { show: false }];
        refer += Math.abs(parseFloat(orderItem.referral_fee));
        totalVat += parseFloat(orderItem.item_tax);
        item_tax += parseFloat(orderItem.item_tax) + parseFloat(orderItem.shipping_tax);
        amazonFee += Math.abs(parseFloat(orderItem.FBA_fulfilment_fee));
        shipping_tax += parseFloat(orderItem.shipping_tax);
        shipping_price += parseFloat(orderItem.shipping_price);
        cancelRequest = orderItem.is_buyer_requested_cancel || cancelRequest;
        // itemsQuantity += parseInt(orderItem.quantity_ordered, 10);

        return '';
      });

      roundNetProceed(refer, item_tax, amazonFee);

      setIsShown(show);
      setReferFee(roundNumber(refer));
      setVat(roundNumber(totalVat));
      setAmazonFulfilmentFee(roundNumber(amazonFee));
      setShippingPrice(roundNumber(shipping_price));
      setShippingTax(roundNumber(shipping_tax));
      setBuyerCancellationRequest(cancelRequest);
      // setTotalItems(itemsQuantity);
    }, [order_items_order_id, roundNetProceed]);

    const handleColorForNegative = useCallback((value) => {
      if (value > 0) {
        return '#00AB55';
      }
      if (value < 0) {
        return '#FF5630';
      }
      return 'default';
    }, []);

    // *************************

    useEffect(() => {
      calculateItemTaxAndReferFee();

      // eslint-disable-next-line
    }, [message]);

    const today = new Date().toISOString().substring(0, 10);

    const getCharAtName = useCallback((name) => name && name.charAt(0).toUpperCase(), []);

    const getColorByProcessedBy = useCallback(
      (name) => {
        if (['A', 'N', 'H', 'L', 'Q'].includes(getCharAtName(name))) return 'primary';
        if (['F', 'G', 'T', 'I', 'J'].includes(getCharAtName(name))) return 'info';
        if (['K', 'D', 'Y', 'B', 'O'].includes(getCharAtName(name))) return 'success';
        if (['P', 'E', 'R', 'S', 'U'].includes(getCharAtName(name))) return 'warning';
        if (['V', 'W', 'X', 'M', 'Z'].includes(getCharAtName(name))) return 'error';
        return 'default';
      },
      [getCharAtName]
    );

    const { enqueueSnackbar } = useSnackbar();

    const setOnCopy = useCallback(() => {
      enqueueSnackbar('Copied!');
    }, [enqueueSnackbar]);

    const handleHistory = useCallback(
      (k = null) => {
        if (k) {
          getOrderHistory({ key: k }, id);
        } else {
          getComments(id);
        }
      },
      [getOrderHistory, getComments, id]
    );

    const [isSaleInfoHide, setIsSaleInfoHide] = useState(true);
    // const [selectVariant, setSelectVariant] = useState('fadeOutDown');
    // const [vairant, setVariant] = useState(getVariant('fadeOutDown'));
    // useEffect(() => {
    //   setVariant(getVariant(selectVariant));

    //   // eslint-disable-next-line
    // }, [selectVariant]);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.up('1450'));

    const handleTakeOverButton = () => {
      takeOver({
        orderId: id,
        assignUserId: user_assign_order.id,
      });
      setTakeOverId(id);
    };

    return (
      <>
        {buyerCancellationRequest && (
          <TableRow
            // hover
            tabIndex={-1}
            sx={{
              backgroundColor: buyerCancellationRequest ? '#ffd6664d' : '',
            }}
            key={key}
          >
            <TableCell sx={{ p: '5px 16px', lineHeight: 0.5 }} colSpan="7">
              <Typography variant="caption" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Iconify
                  width={20}
                  sx={{ color: 'warning.main' }}
                  inline
                  icon="bi:exclamation-triangle-fill"
                />
                &nbsp; The buyer has requested that this order be cancelled. Cancelling this order
                will not affect your cancellation rate metric.
              </Typography>

              {/* <Divider sx={{ mt: 1 }} /> */}
            </TableCell>
          </TableRow>
        )}
        <TableRow
          selected={selected}
          hover
          tabIndex={-1}
          sx={{
            verticalAlign: 'top',

            // '&:last-child td, &:last-child th': { border: 0 },
            backgroundColor: buyerCancellationRequest ? '#ffd6664d' : '',
          }}
          key={key}
        >
          <TableCell
            sx={{
              minWidth: 105,
              p: '5px 10px 5px 16px',
            }}
          >
            <Stack direction="column" alignItems="left">
              <Typography variant="subtitle2">{purcahseDate}</Typography>
              <Typography variant="caption">
                {moment(new Date(purchase_date)).utc(false).format('DD/MM/YYYY')}
              </Typography>
              <Typography variant="caption">
                {moment(purchase_date).utc(false).format('hh:mm A')}{' '}
              </Typography>

              {/* <CustomAvatar
                      src={user_assign_order.profileImage}
                      alt={user_assign_order.full_name}
                      name={user_assign_order.full_name}
                      variant="rounded"
                      'circular' | 'rounded' | 'square',

                      size="samll"
                      sx={{
                        mt: 0.5,

                        width: 28,
                        height: 28,
                      }}
                    /> */}
            </Stack>
          </TableCell>

          <TableCell
            align="left"
            sx={{
              minWidth: 250,
              maxWidth: 265,
              p: '5px 10px',
            }}
          >
            <Stack direction="column" alignItems="left">
              <Typography variant="subtitle2" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                {user && user.permission_settings.manage_orders_view_and_edit ? (
                  <Link
                    variant="subtitle2"
                    underline="hover"
                    onClick={(e) => {
                      if (user_assign_order && user_assign_order.id !== user.id) {
                        handleOpenConfirm();
                      } else {
                        onEditRow(e);
                      }
                    }}
                    href={`${!user_assign_order ? PATH_DASHBOARD.orders.details(id) : '#'}`}
                  >
                    {id}
                  </Link>
                ) : (
                  id
                )}

                <CopyToClipboard text={id} onCopy={() => setOnCopy()}>
                  <IconButton
                    sx={{
                      p: '1px 2px 0px 2px',
                    }}
                    size="small"
                  >
                    <Tooltip title="Copy">
                      <Iconify icon="fluent:copy-16-regular" width={20} />
                    </Tooltip>
                  </IconButton>
                </CopyToClipboard>
                <Tooltip title={sales_channel}>
                  <Iconify
                    width={20}
                    // inline
                    sx={{
                      pr: '2px',
                    }}
                    icon={`twemoji:flag-${marketplace_id_in_orders.country
                      .toLowerCase()
                      .replace(/ /g, '-')}`}
                  />
                </Tooltip>

                {user_assign_order && user_assign_order.full_name && (
                  <Tooltip title={user_assign_order.full_name}>
                    <Iconify
                      icon="circum:lock"
                      sx={{
                        color: 'error.dark',
                      }}
                      width={20}
                    />
                  </Tooltip>
                )}
              </Typography>
              {/* <Typography variant="caption">
                Fulfillment Channel: {fulfillment_channel === 'MFN' ? 'Seller' : 'Amazon'}
              </Typography> */}
              {/* <Typography variant="caption" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                Sales Channel: &nbsp;
                {sales_channel} &nbsp;
                <Tooltip title={sales_channel}>
                  <Iconify
                    width={20}
                    inline
                    icon={`twemoji:flag-${marketplace_id_in_orders.country
                      .toLowerCase()
                      .replace(/ /g, '-')}`}
                  />
                </Tooltip>
              </Typography> */}
              <Typography variant="caption">Seller Order ID: {seller_order_id}</Typography>
              <Typography variant="caption">
                Processed By:{' '}
                {user_processed_order && user_processed_order.full_name && (
                  <Label
                    variant="soft"
                    color={getColorByProcessedBy(user_processed_order.full_name)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {user_processed_order.full_name}
                  </Label>
                )}
              </Typography>
              <Box>
                <Typography variant="caption" display="inline">
                  Tracking Number:&nbsp;
                  {order_tracking_to_order && (
                    <Box
                      fontWeight="fontWeightMedium"
                      display="inline"
                      color={(order_tracking_to_order.fake_tracking && '#FF5630') || 'default'}
                    >
                      {order_tracking_to_order.tracking_number}
                    </Box>
                  )}
                </Typography>
                {/* {order_tracking_to_order && (
                  <OrderHistory
                    list={orderHistory}
                    handleHistory={handleHistory}
                    value="tracking_id"
                    clearList={clearOrderHistory}
                  />
                )} */}
              </Box>

              {is_business_order && (
                <Typography variant="subtitle2" sx={{ mt: '2px' }}>
                  <Label color="default" variant="filled">
                    Business customer
                  </Label>
                </Typography>
              )}
            </Stack>
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: 250,
              maxWidth: !small ? 265 : 375,
              p: '5px 10px',
            }}
          >
            {order_items_order_id.map((orderItems, index) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={2}>
                  <Stack
                    sx={{ position: 'relative' }}
                    onMouseEnter={() =>
                      setIsShown((prevState) => {
                        prevState[index].show = true;
                        return [...prevState];
                      })
                    }
                    onMouseLeave={() =>
                      setIsShown((prevState) => {
                        prevState[index].show = false;
                        return [...prevState];
                      })
                    }
                  >
                    <img
                      alt={orderItems.title}
                      // src={`https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${orderItems.asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=AC_SL500`}
                      src={orderItems.asin_in_order_items.image || '/assets/images/noimage.gif'}
                      style={{
                        borderRadius: '5px 5px 5px 5px',
                        maxWidth: '55px',
                      }}
                      loading="lazy"
                    />
                    {/* <Image
                  disabledEffect
                  alt={orderItems.title}
                  src={orderItems.asin_in_order_items.image || '/assets/images/noimage.gif'}
                  // src={`https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${orderItems.asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=AC_SL500`}
                  sx={{
                    borderRadius: '6%',
                    width: '55px',
                  }}
                  /> */}
                    {isShown && isShown[index] && isShown[index].show && (
                      <img
                        // src={`https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${orderItems.asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=AC_SL500`}
                        src={orderItems.asin_in_order_items.image || '/assets/images/noimage.gif'}
                        style={{
                          borderRadius: '5px 5px 5px 5px',
                          minWidth: '100px',
                          maxWidth: '250px',
                          minHeight: '200px',
                          maxHeight: '340px',
                          position: 'absolute',
                          top: (rowIndex === 0 && '-40px') || '-80px',
                          left: '42%',
                          transform: 'translateX(15%)',
                          zIndex: 1,
                          boxShadow:
                            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}
                        alt={orderItems.title}
                        loading="lazy"
                      />
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={10}>
                  <Stack direction="column" alignItems="left" sx={{ pl: 1 }}>
                    <Tooltip
                      title={orderItems.title}
                      placement="right-start"
                      // arrow
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <Link
                        href={`https://www.${sales_channel}/gp/product/${orderItems.asin}`}
                        target="_blank"
                        rel="noreferrer"
                        variant="subtitle2"
                        underline="hover"
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {orderItems.title}
                      </Link>
                    </Tooltip>
                    <Typography variant="caption">
                      ASIN: &nbsp;
                      <CopyToClipboard text={orderItems.asin} onCopy={() => setOnCopy()}>
                        <Box
                          fontWeight="fontWeightMedium"
                          display="inline"
                          sx={{ cursor: 'pointer' }}
                        >
                          {orderItems.asin}
                        </Box>
                      </CopyToClipboard>
                    </Typography>
                    {/* <Typography variant="caption">
                      ASIN:{' '}
                      <Box fontWeight="fontWeightMedium" display="inline">
                        {orderItems.asin}{' '}
                        <CopyToClipboard text={orderItems.asin} onCopy={() => setOnCopy()}>
                          <IconButton sx={{ pb: 0, pt: '1px' }} size="small">
                            <Tooltip title="Copy">
                              <Iconify icon="fluent:copy-16-regular" width={24} />
                            </Tooltip>
                          </IconButton>
                        </CopyToClipboard>
                      </Box>                  
                  </Typography> */}
                    <Typography variant="caption">
                      SKU: &nbsp;
                      <CopyToClipboard text={orderItems.seller_sku} onCopy={() => setOnCopy()}>
                        <Box
                          fontWeight="fontWeightMedium"
                          display="inline"
                          sx={{ cursor: 'pointer' }}
                        >
                          {orderItems.seller_sku}
                        </Box>
                      </CopyToClipboard>
                    </Typography>
                    {/* <Typography variant="caption">
                      SKU: {orderItems.seller_sku}{' '}
                      <CopyToClipboard text={orderItems.seller_sku} onCopy={() => setOnCopy()}>
                        <IconButton sx={{ pb: 0, pt: '1px' }} size="small">
                          <Tooltip title="Copy">
                            <Iconify icon="fluent:copy-16-regular" width={24} />
                          </Tooltip>
                        </IconButton>
                      </CopyToClipboard>
                    </Typography> */}
                    <Typography variant="caption">
                      Quantity:{' '}
                      <Box fontWeight="fontWeightMedium" display="inline">
                        {orderItems.quantity_ordered}
                      </Box>
                    </Typography>
                    <Typography variant="caption">
                      Item subtotal: {marketplace_id_in_orders.symbol}
                      {orderItems.item_price}
                    </Typography>
                  </Stack>
                </Grid>
                {orderItemsLength - 1 !== index && (
                  <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                    <Divider />
                  </Grid>
                )}
              </Grid>
            ))}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: 210,
              width: 210,
              p: '5px 10px',
            }}
          >
            <Grid container rowSpacing={0} sx={{ mt: '2px' }}>
              {/* <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton
                  sx={{ pb: 0, pt: '1px' }}
                  // onClick={() =>
                  //   setSelectVariant((prevState) =>
                  //     prevState === 'slideInUp' ? 'fadeOutDown' : 'slideInUp'
                  //   )
                  // }
                  onClick={() => setIsSaleInfoHide((prevState) => !prevState)}
                  size="small"
                >
                  {!isSaleInfoHide ? (
                    <Iconify icon="iconamoon:arrow-up-2-duotone" width={24} />
                  ) : (
                    <Iconify icon="iconamoon:arrow-down-2-duotone" width={24} />
                  )}
                </IconButton>
              </Grid> */}
              <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" display="inline">
                  Order Total: &nbsp;
                </Typography>
                <Typography variant="subtitle2" display="inline">
                  <IconButton
                    sx={{ p: '0px' }}
                    onClick={() => setIsSaleInfoHide((prevState) => !prevState)}
                    size="small"
                  >
                    {!isSaleInfoHide ? (
                      <Iconify icon="iconamoon:arrow-up-2-duotone" width={20} />
                    ) : (
                      <Iconify icon="iconamoon:arrow-down-2-duotone" width={20} />
                    )}
                  </IconButton>
                  {marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                  {order_total}
                </Typography>
              </Grid>
              {purchase_price && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    Purchase Price: &nbsp;
                  </Typography>
                  <Typography variant="caption" display="inline">
                    {marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                    {purchase_price}
                  </Typography>
                </Grid>
              )}

              {!isSaleInfoHide && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" display="inline">
                      Sales Vat: &nbsp;
                    </Typography>
                    <Stack direction="row" alignItems="center">
                      <Box fontWeight="fontWeightBold" sx={{ color: '#FF5630' }} display="inline">
                        -
                      </Box>
                      <Typography variant="caption" display="inline">
                        &nbsp;{marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                        {vat}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {/* <MotionContainer
                      // component={m.caption}
                      sx={{
                        // typography: 'caption',
                        display: 'inline',
                        // overflow: 'hidden'
                      }}
                    >
                      {'Shipping Price:'.split('').map((letter, index) => (
                        <m.span key={index} variants={vairant}>
                          {letter}
                        </m.span>
                      ))}
                    </MotionContainer> */}
                    <Typography variant="caption" display="inline">
                      Shipping Price: &nbsp;
                    </Typography>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="caption" display="inline">
                        &nbsp;{marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                        {shippingPrice}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" display="inline">
                      Shipping Tax: &nbsp;
                    </Typography>
                    <Stack direction="row" alignItems="center">
                      <Box fontWeight="fontWeightBold" sx={{ color: '#FF5630' }} display="inline">
                        -
                      </Box>
                      <Typography variant="caption" display="inline">
                        &nbsp;
                        {marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                        {shippingTax}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" display="inline">
                      Refer Fee: &nbsp;
                    </Typography>

                    <Stack direction="row" alignItems="center">
                      <Box fontWeight="fontWeightBold" sx={{ color: '#FF5630' }} display="inline">
                        -
                      </Box>
                      <Typography variant="caption" display="inline">
                        &nbsp;{marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                        {referFee}
                      </Typography>
                    </Stack>
                  </Grid>
                </>
              )}
              {fulfillment_channel === 'AFN' && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    Fulfilment Fee: &nbsp;
                  </Typography>

                  <Stack direction="row" alignItems="center">
                    <Box fontWeight="fontWeightBold" sx={{ color: '#FF5630' }} display="inline">
                      -
                    </Box>
                    <Typography variant="caption" display="inline">
                      &nbsp;{marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                      {amazonFulfilmentFee}
                    </Typography>
                  </Stack>
                </Grid>
              )}
              {(purchase_price || !isSaleInfoHide) && (
                <Grid item xs={12} sm={12}>
                  <Divider sx={{ borderBottomWidth: '2px', mt: '8px' }} />
                </Grid>
              )}
              {!isSaleInfoHide && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ mt: '5px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="subtitle2" display="inline">
                    Net Proceed: &nbsp;
                  </Typography>
                  <Typography variant="subtitle2" display="inline">
                    {marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                    {net_proceed || netProfit}
                  </Typography>
                </Grid>
              )}
              {purchase_price && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ mt: '2px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="subtitle2" display="inline">
                      Gross Profit: &nbsp;
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      color={handleColorForNegative(gross_profit)}
                    >
                      {gross_profit < 0 && (
                        <Box fontWeight="fontWeightBold" display="inline">
                          -
                        </Box>
                      )}

                      <Typography variant="subtitle2" display="inline">
                        &nbsp;{marketplace_id_in_orders && marketplace_id_in_orders.symbol}
                        {Math.abs(gross_profit)}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ mt: '2px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="subtitle2" display="inline">
                      Margin: &nbsp;
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      color={handleColorForNegative(gross_profit)}
                    >
                      {margin < 0 && (
                        <Box fontWeight="fontWeightBold" display="inline">
                          -
                        </Box>
                      )}

                      <Typography
                        variant="subtitle2"
                        color={handleColorForNegative(margin)}
                        display="inline"
                      >
                        &nbsp;
                        {Math.abs(margin)}%
                      </Typography>
                    </Stack>
                  </Grid>
                </>
              )}
            </Grid>
          </TableCell>

          <TableCell
            align="left"
            sx={{
              minWidth: 135,
              p: '5px 10px',
            }}
          >
            <Stack direction="column">
              {/* <Typography variant="subtitle2">{shipment_service_level_category}</Typography> */}
              {fulfillment_channel === 'MFN' && (
                <>
                  <Typography variant="caption">Ship by date:</Typography>
                  <Typography variant="caption">
                    {earliest_ship_date &&
                      `${
                        (!moment(
                          new Date(moment(earliest_ship_date).utc(false).format('DD MMM YY'))
                        ).isSame(
                          new Date(moment(latest_Ship_date).utc(false).format('DD MMM YY')),
                          'day'
                        ) &&
                          `${moment(earliest_ship_date).utc(false).format('DD MMM YY')} - `) ||
                        ''
                      }`}
                    <b>{moment(latest_Ship_date).utc(false).format('DD MMM YY')}</b>
                  </Typography>

                  <Typography variant="caption">Deliver by date: </Typography>
                  <Typography variant="caption">
                    {earliest_delivery_date &&
                      `${
                        (!moment(
                          new Date(moment(earliest_delivery_date).utc(false).format('DD MMM YY'))
                        ).isSame(
                          new Date(moment(latest_delivery_date).utc(false).format('DD MMM YY')),
                          'day'
                        ) &&
                          `${moment(earliest_delivery_date).utc(false).format('DD MMM YY')} - `) ||
                        ''
                      }`}
                    <b>{moment(latest_delivery_date).utc(false).format('DD MMM YY')}</b>
                  </Typography>
                </>
              )}
            </Stack>
          </TableCell>
          <TableCell
            align="left"
            sx={{
              p: '5px 0px',
            }}
          >
            {order_comments_order_id && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.spacing(1, 1),
                  borderRadius: '12px',
                  backgroundColor: alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Stack direction="column">
                  <Stack direction="row">
                    <Tooltip title={order_comments_order_id.full_name}>
                      <CustomAvatar
                        src={order_comments_order_id.profileImage}
                        alt={order_comments_order_id.full_name}
                        name={order_comments_order_id.full_name}
                        variant="rounded"
                        sx={{
                          width: 28,
                          height: 28,
                        }}
                      />
                    </Tooltip>
                    <Stack direction="column" sx={{ ml: 1 }}>
                      <Tooltip title={order_comments_order_id.content}>
                        <Typography
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: 120,
                          }}
                          variant="caption"
                        >
                          {order_comments_order_id.content}
                        </Typography>
                      </Tooltip>
                      {/* <Typography variant="subtitle2" noWrap>
                        {order_comments_order_id.full_name}
                      </Typography>
                      <Typography variant="caption" noWrap>
                        {moment(order_comments_order_id.added_at).format(
                          'ddd, DD MMM YYYY, hh:mm A'
                        )}
                      </Typography> */}
                      <Typography variant="caption">
                        <OrderHistory
                          list={comments}
                          handleHistory={handleHistory}
                          clearList={clearCommentList}
                          isComment
                        />
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* <Typography variant="body1">{order_comments_order_id.content}</Typography> */}
                </Stack>
              </Box>
            )}
          </TableCell>
          <TableCell
            align="center"
            sx={{
              minWidth: 140,
              maxWidth: 175,
              p: '5px 16px 5px 10px',
            }}
          >
            <Stack direction="column" spacing={0.6} alignItems="center" sx={{ mt: '1px' }}>
              <Label
                color={
                  (order_status === 'Pending' && 'warning') ||
                  (order_status === 'Unshipped' && 'error') ||
                  (order_status === 'Unprocessed' && 'error') ||
                  (order_status === 'PartiallyShipped' && 'info') ||
                  (order_status === 'Shipped' && 'success') ||
                  (order_status === 'Canceled' && 'default')
                }
                variant="filled"
              >
                {order_status === 'Unprocessed' ? 'Unshipped' : order_status}
                {order_status === 'Unshipped' && `(${number_of_items_unshipped})`}
              </Label>

              {order_status === 'Unprocessed' && (
                <Typography variant="caption">{order_status}</Typography>
              )}

              {(order_status === 'Unshipped' || order_status === 'Unprocessed') &&
                today === new Date(latest_Ship_date).toISOString().substring(0, 10) && (
                  <Typography variant="caption">{`Confirm as shipped by ${moment(latest_Ship_date)
                    .utc(false)
                    .format('DD/MM/YYYY')} to avoid late shipment`}</Typography>
                )}

              {buyerCancellationRequest && (
                <>
                  <Typography variant="caption">
                    <Box fontWeight="fontWeightMedium" display="inline">
                      <Iconify
                        width={15}
                        sx={{ color: 'warning.main' }}
                        inline
                        icon="bi:exclamation-triangle-fill"
                      />
                      &nbsp; Buyer cancellation
                    </Box>
                  </Typography>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                    Cancellation reason: &nbsp;
                    {order_items_order_id[0].buyer_cancel_reason
                      ? order_items_order_id[0].buyer_cancel_reason
                          .replace(/_/g, ' ')
                          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
                            index !== 0 ? word.toLowerCase() : word.toUpperCase()
                          )
                      : ''}
                  </Typography>
                </>
              )}
            </Stack>
          </TableCell>

          {/* <TableCell align="left" sx={{ minWidth: 150 }}>
            {user_processed_order && user_processed_order.full_name && (
              <Label
                variant="soft"
                color={getColorByProcessedBy(user_processed_order.full_name)}
                sx={{ textTransform: 'capitalize' }}
              >
                {user_processed_order.full_name}
              </Label>
            )}
          </TableCell> */}
        </TableRow>

        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Take Over"
          content="Are you sure you want to take over?"
          action={
            <Button variant="contained" color="primary" onClick={handleTakeOverButton}>
              Confirm
            </Button>
          }
        />
      </>
    );
  }
);

/* <Label
                  variant="soft"
                  color={getColorByProcessedBy(
                    order_comments_order_id.user_added_comments.full_name
                  )}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {order_comments_order_id.user_added_comments.full_name}
                </Label> */
/* <CustomAvatar
                  src=""
                  // src={
                  //   order_comments_order_id
                  //     ? order_comments_order_id.asin_in_order_comments.image
                  //     : ''
                  // }
                  alt={order_comments_order_id.user_added_comments.full_name}
                  name={order_comments_order_id.user_added_comments.full_name}
                  sx={{
                    display: 'inline',
                  }}
                /> */
/* <Typography
                  variant="body2"
                  sx={{
                    // color: 'text.secondary',
                    display: 'block',
                  }}
                >
                  <OrderHistory
                    list={comments}
                    handleHistory={handleHistory}
                    clearList={clearCommentList}
                    isComment

                  />
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    // color: 'text.secondary',
                    display: 'flex',
                  }}
                  justifyContent="end"
                >
                  {moment(order_comments_order_id.added_at).format('DD MMM YYYY, hh:mm A')}
                </Typography> */

OrderTableRow.propTypes = {
  Users: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  // Order: PropTypes.object.isRequired,
  Comment: PropTypes.object.isRequired,
  rowIndex: PropTypes.number,
  key: PropTypes.string,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,

  // onSelectRow: PropTypes.func,
  getOrderHistory: PropTypes.func,
  // clearOrderHistory: PropTypes.func,
  getComments: PropTypes.func,
  clearCommentList: PropTypes.func,
  takeOver: PropTypes.func,
  setTakeOverId: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
  // Order: state.Order,
  Auth: state.Auth,
  Comment: state.Comment,
});

export default connect(mapStateToProps, {
  getOrderHistory: getOrderHistoryRequest,
  // clearOrderHistory: clearOrderHistoryRequest,
  getComments: getCommentsRequest,
  clearCommentList: clearCommentListRequest,
  takeOver: takeOverRequest,
})(OrderTableRow);
