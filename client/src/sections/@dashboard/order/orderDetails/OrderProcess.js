import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { memo, useEffect, useState, useMemo, useCallback } from 'react';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Grid, Stack, LinearProgress } from '@mui/material';

import {
  OrderInfoCard,
  OrderHeaderCard,
  SalesProceedCard,
  OrderProcessCard,
  ShippingAddressCard,
  OrderContentCard,
  OrderShipmentCard,
  ViewOrderShipmentCard,
  OrderCommentCard,
  OrderCancelRequestAlert,
} from '../../../../components/order';

const OrderProcess = memo(
  ({
    isEdit = false,
    currentOrder,
    defaultVal,
    handleSubmited,
    assignOrder,
    loading,
    // eslint-disable-next-line
    getOrderHistory,
    orderHistory,
    clearOrderHistory,
    handleAssign,
    wareHouseList,
    carrierCodeList,
    handleServicesRequest,
    servicesList,
    handleDispatchData,
    confirmShipment,
    setConfirmShipment,
    clearServicesList,
    commentList,
    handleComment,
    cancelReason,
    cancelOrder,
    user,
    leaveOrder,
    cancelReasonList,
  }) => {
    const sellerOrderIdSchema = Yup.object().shape({
      seller_order_id: Yup.string().required('First name is required'),
      purchase_price: Yup.number()
        .typeError('Purchase price must be a number')
        .required('Purchase price is required'),
    });

    const defaultValues = useMemo(
      () => ({
        seller_order_id: currentOrder?.seller_order_id || '',
        purchase_price: currentOrder?.purchase_price || '',
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentOrder]
    );

    const {
      id,
      buyer_info_order_id,
      marketplace_id_in_orders,
      order_status,
      order_total,
      sales_channel,
      purchase_date,
      earliest_delivery_date,
      earliest_ship_date,
      latest_Ship_date,
      latest_delivery_date,
      user_processed_order,
      seller_order_id,
      purchase_price,
      fulfillment_channel,
      order_items_order_id,
      user_assign_order,
    } = currentOrder || {};

    const [itemsLength, setItemsLength] = useState(0);
    const [isTrackingEdit, setIsTrackingEdit] = useState(false);
    const [orderTracking, setOrderTracking] = useState(null);

    const methods = useForm({
      resolver: yupResolver(sellerOrderIdSchema),
      defaultValues,
    });

    const { reset, setValue } = methods;

    const [isDisable, setIsDisable] = useState({ purchasePrice: false, sellerOrderId: false });
    const [vat, setVat] = useState(0);
    const [amazonFulfilmentFee, setAmazonFulfilmentFee] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [referFee, setReferFee] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [shippingTax, setShippingTax] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [grossProfit, setGrossProfit] = useState(0);
    const [margin, setMargin] = useState(0);
    const [orderItemsDetail, setOrderItemsDetail] = useState(null);
    const [isOrderDispatchable, setIsOrderDispatchable] = useState(true);
    const [isMerchantFulfilment, setIsMerchantFulfilment] = useState(false);
    const [assignToCurrentUser, setAssignToCurrentUser] = useState(false);
    const [autoScroll, setAutoScroll] = useState(null);

    // const [purchasePrice, setPurchasePrice] = useState(null);

    const roundNumber = useCallback(
      (number) => Math.round((number + Number.EPSILON) * 100) / 100,
      []
    );

    const roundMargin = useCallback(
      (grossProceed) => {
        const marginValue = (grossProceed / order_total) * 100;
        setMargin(roundNumber(marginValue));
      },
      [order_total, roundNumber]
    );
    const roundGrossProfit = useCallback(
      (netProceed = null, purchasePrice = null, onChangeAction = false) => {
        // profit formula = netProceed - purchase_price
        let grossProceed;
        if (onChangeAction) {
          if (purchasePrice) {
            grossProceed = netProfit - purchasePrice;
          } else {
            grossProceed = 0;
          }
        } else {
          grossProceed = purchase_price ? netProceed - parseInt(purchase_price, 10) : 0;
        }

        setGrossProfit(roundNumber(grossProceed));
        roundMargin(grossProceed);
      },
      [netProfit, purchase_price, roundMargin, roundNumber]
    );

    const roundNetProceed = useCallback(
      (refer, item_tax, amazonFee) => {
        // netProceed formula = order_total - all_referralFee - all_item_tax - all_amazonFee
        let netProceed = order_total - refer - item_tax - amazonFee;
        netProceed = roundNumber(netProceed);

        roundGrossProfit(netProceed);

        setNetProfit(netProceed);
      },
      [order_total, roundGrossProfit, roundNumber]
    );

    const calculateItemTaxAndReferFee = useCallback(
      (orderItems) => {
        let refer = 0;
        let totalVat = 0;
        let item_tax = 0;
        let amazonFee = 0;
        let shipping_tax = 0;
        let shipping_price = 0;
        let itemsQuantity = 0;
        orderItems.map((orderItem) => {
          refer += Math.abs(parseFloat(orderItem.referral_fee));
          totalVat += parseFloat(orderItem.item_tax);
          item_tax += parseFloat(orderItem.item_tax) + parseFloat(orderItem.shipping_tax);
          amazonFee += Math.abs(parseFloat(orderItem.FBA_fulfilment_fee));
          shipping_tax += parseFloat(orderItem.shipping_tax);
          shipping_price += parseFloat(orderItem.shipping_price);
          itemsQuantity += parseInt(orderItem.quantity_ordered, 10);

          return '';
        });

        roundNetProceed(refer, item_tax, amazonFee);

        setReferFee(roundNumber(refer));
        setVat(roundNumber(totalVat));
        setAmazonFulfilmentFee(roundNumber(amazonFee));
        setTotalItems(roundNumber(itemsQuantity));
        setShippingPrice(roundNumber(shipping_price));
        setShippingTax(roundNumber(shipping_tax));
      },
      [roundNetProceed, roundNumber]
    );

    useEffect(() => {
      if (isEdit && currentOrder) {
        setItemsLength(currentOrder.order_items_order_id.length);
        reset(defaultValues);
        setOrderItemsDetail(currentOrder.order_items_order_id);
        calculateItemTaxAndReferFee(currentOrder.order_items_order_id);
      }
      if (!isEdit) {
        reset(defaultValues);
      }

      if (currentOrder) {
        setIsMerchantFulfilment(fulfillment_channel === 'MFN');

        setOrderTracking(currentOrder.order_tracking_to_order);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentOrder]);

    useEffect(() => {
      if (orderTracking) {
        setIsTrackingEdit(true);

        if (orderTracking.carrier_code_has_tracking) {
          handleServicesRequest(
            orderTracking.carrier_code_has_tracking.id,
            orderTracking.ware_house_has_tracking.marketplace
          );
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderTracking]);

    useEffect(() => {
      if (order_status === 'Canceled' || order_status === 'Pending') setIsOrderDispatchable(false);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_status]);

    useEffect(() => {
      if (user_assign_order) {
        setAssignToCurrentUser(user_assign_order.id === user.id);
      } else {
        setAssignToCurrentUser(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_assign_order]);

    const handlePurchasePrice = useCallback(
      (event) => {
        setValue('purchase_price', event.target.value);
        roundGrossProfit(null, event.target.value, true);
      },
      [roundGrossProfit, setValue]
    );

    const onSubmit = useCallback(
      async (data) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const orderData = {
            seller_order_id: data.seller_order_id ? data.seller_order_id : null,
            purchase_price: data.purchase_price ? data.purchase_price : null,
            net_proceed: netProfit,
            gross_profit: grossProfit,
            margin,
          };

          handleSubmited(orderData, id);

          setIsDisable({ purchasePrice: false, sellerOrderId: false });
        } catch (error) {
          console.error(error);
        }
      },
      [grossProfit, handleSubmited, id, margin, netProfit]
    );

    const handleHistory = useCallback(
      (key) => {
        getOrderHistory({ key }, id);
      },
      [getOrderHistory, id]
    );

    const onConfirmShipment = useCallback(
      (value) => {
        setConfirmShipment(value);
        setAutoScroll(true);
      },
      [setConfirmShipment]
    );

    const handleLeaveOrder = useCallback(() => {
      leaveOrder({ orderId: id });
    }, [leaveOrder, id]);

    return (
      <>
        {loading ? (
          <Grid container spacing={3} rowSpacing={2}>
            <Grid item xs={12} md={12}>
              <Stack alignItems="center" sx={{ my: 15 }}>
                <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3} rowSpacing={2}>
            {order_items_order_id &&
              order_items_order_id[0]?.is_buyer_requested_cancel &&
              order_status !== 'Canceled' && (
                <Grid item xs={12} md={12}>
                  <OrderCancelRequestAlert
                    cancelRequest={
                      order_items_order_id
                        ? order_items_order_id[0]?.is_buyer_requested_cancel &&
                          order_status !== 'Canceled'
                        : false
                    }
                  />
                </Grid>
              )}
            <Grid item xs={12} md={12}>
              <OrderHeaderCard
                id={id}
                fulfillment_channel={fulfillment_channel}
                sales_channel={sales_channel}
                marketplace_id_in_orders={marketplace_id_in_orders}
              />
            </Grid>

            {isOrderDispatchable && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <SalesProceedCard
                    symbol={(marketplace_id_in_orders && marketplace_id_in_orders.symbol) || ''}
                    order_total={order_total}
                    vat={vat}
                    shippingPrice={shippingPrice}
                    shippingTax={shippingTax}
                    referFee={referFee}
                    netProfit={netProfit}
                    amazonFulfilmentFee={amazonFulfilmentFee}
                    grossProfit={grossProfit}
                    margin={margin}
                    fulfillment_channel={fulfillment_channel}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <OrderInfoCard
                    seller_order_id={seller_order_id}
                    purchase_price={purchase_price ? +purchase_price : 0}
                    handlePurchasePrice={handlePurchasePrice}
                    assignOrder={assignOrder}
                    orderHistory={orderHistory}
                    clearOrderHistory={clearOrderHistory}
                    handleHistory={handleHistory}
                    isDisable={isDisable}
                    setIsDisable={setIsDisable}
                    methods={methods}
                    onSubmit={onSubmit}
                    handleAssign={handleAssign}
                    isMerchantFulfilment={isMerchantFulfilment}
                    assignToCurrentUser={assignToCurrentUser}
                    user_assign_order={user_assign_order}
                    handleLeaveOrder={handleLeaveOrder}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={(isOrderDispatchable && 3) || 6}>
              <OrderProcessCard
                user_processed_order={user_processed_order}
                order_status={order_status}
                earliest_ship_date={earliest_ship_date}
                latest_Ship_date={latest_Ship_date}
                earliest_delivery_date={earliest_delivery_date}
                latest_delivery_date={latest_delivery_date}
                purchase_date={purchase_date}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={(isOrderDispatchable && 3) || 6}>
              <ShippingAddressCard buyer_info_order_id={buyer_info_order_id} />
            </Grid>

            {/* <Grid item xs={12} md={6} lg={7} xl={8}> */}
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2} rowSpacing={2}>
                <Grid item xs={12} sm={8}>
                  <OrderContentCard
                    totalItems={totalItems}
                    itemsLength={itemsLength}
                    fulfillment_channel={fulfillment_channel}
                    orderItemsDetail={orderItemsDetail}
                    sales_channel={sales_channel}
                    order_status={order_status}
                    symbol={(marketplace_id_in_orders && marketplace_id_in_orders.symbol) || ''}
                    confirmShipment={confirmShipment}
                    onConfirmShipment={() => onConfirmShipment(true)}
                    isEdit={isTrackingEdit}
                    isOrderDispatchable={isOrderDispatchable}
                    isMerchantFulfilment={isMerchantFulfilment}
                    cancelOrder={cancelOrder}
                    cancelReason={cancelReason}
                    cancelReasonList={cancelReasonList}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}

                  // md={6} lg={5} xl={4}
                >
                  <OrderCommentCard commentList={commentList} handleComment={handleComment} />
                </Grid>
              </Grid>
            </Grid>

            {isOrderDispatchable && isTrackingEdit && !confirmShipment && (
              <Grid item xs={12} sm={12}>
                <ViewOrderShipmentCard
                  currentOrderTracking={orderTracking}
                  confirmShipment={confirmShipment}
                  onConfirmShipment={() => onConfirmShipment(true)}
                  orderHistory={orderHistory}
                  clearOrderHistory={clearOrderHistory}
                  handleHistory={handleHistory}
                  isMerchantFulfilment={isMerchantFulfilment}
                />
              </Grid>
            )}

            {isOrderDispatchable && confirmShipment && (
              <Grid item xs={12} sm={12}>
                <OrderShipmentCard
                  isEdit={isTrackingEdit}
                  currentOrderTracking={orderTracking}
                  methods={methods}
                  onSubmit={onSubmit}
                  purchase_date={purchase_date}
                  wareHouseList={wareHouseList}
                  marketplace_id_in_orders={marketplace_id_in_orders}
                  carrierCodeList={carrierCodeList}
                  handleServicesRequest={handleServicesRequest}
                  servicesList={servicesList}
                  handleDispatchData={handleDispatchData}
                  onConfirmShipment={() => onConfirmShipment(false)}
                  clearServicesList={clearServicesList}
                  defaultVal={defaultVal}
                  autoScroll={autoScroll}
                  setAutoScroll={setAutoScroll}
                />
              </Grid>
            )}
          </Grid>
        )}
      </>
    );
  }
);

OrderProcess.propTypes = {
  isEdit: PropTypes.bool,
  currentOrder: PropTypes.object,
  defaultVal: PropTypes.object,
  handleSubmited: PropTypes.func,
  assignOrder: PropTypes.bool,
  loading: PropTypes.bool,
  getOrderHistory: PropTypes.func,
  clearOrderHistory: PropTypes.func,
  orderHistory: PropTypes.arrayOf(PropTypes.object),
  handleAssign: PropTypes.func,
  wareHouseList: PropTypes.arrayOf(PropTypes.object),
  carrierCodeList: PropTypes.arrayOf(PropTypes.object),
  handleServicesRequest: PropTypes.func,
  servicesList: PropTypes.arrayOf(PropTypes.object),
  handleDispatchData: PropTypes.func,
  confirmShipment: PropTypes.bool,
  setConfirmShipment: PropTypes.func,
  clearServicesList: PropTypes.func,
  commentList: PropTypes.arrayOf(PropTypes.object),
  handleComment: PropTypes.func,
  cancelOrder: PropTypes.func,
  cancelReason: PropTypes.func,
  user: PropTypes.object,
  leaveOrder: PropTypes.func,
  cancelReasonList: PropTypes.array,
};

export default OrderProcess;
