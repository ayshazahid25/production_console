import { useState, memo } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  TableRow,
  TableCell,
  Typography,
  Box,
  Link,
  Tooltip,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import Fade from '@mui/material/Fade';

// components
import Iconify from '../../../../components/iconify/Iconify';

const OrderContentTableRow = memo(
  ({ rowIndex, itemsLength, row, sales_channel, order_status, symbol, fulfillment_channel }) => {
    const {
      id,
      asin_in_order_items,
      title,
      asin,
      seller_sku,
      quantity_ordered,
      item_price,
      item_tax,
      referral_fee,
      FBA_fulfilment_fee,
      shipping_tax,
      shipping_price,
    } = row;

    // refer += Math.abs(parseFloat(orderItem.referral_fee));
    // totalVat += parseFloat(orderItem.item_tax);

    // amazonFee += Math.abs(parseFloat(orderItem.FBA_fulfilment_fee));
    // shipping_tax += parseFloat(orderItem.shipping_tax);
    // shipping_price += parseFloat(orderItem.shipping_price);

    const [isShown, setIsShown] = useState(false);
    const [showDetail, setShowDetail] = useState(true);

    const roundNumber = (number) => Math.round((number + Number.EPSILON) * 100) / 100;

    const unitPrice = roundNumber(item_price / quantity_ordered);

    const netProcessed = roundNumber(
      item_price -
        item_tax -
        Math.abs(referral_fee) -
        Math.abs(FBA_fulfilment_fee) -
        shipping_tax -
        shipping_price
    );

    return (
      <TableRow
        key={id}
        tabIndex={-1}
        sx={{
          borderBottomColor: 'rgba(145, 158, 171, 0.24)',
          borderBottomStyle: 'solid',
          borderBottomWidth: rowIndex === itemsLength ? '0px' : 'thin',
          verticalAlign: 'top',
        }}
      >
        <TableCell
          align="center"
          sx={{
            minWidth: 50,
            verticalAlign: 'middle',
            p: '16px 0px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Stack
            sx={{ position: 'relative' }}
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
          >
            <img
              alt={title}
              src={asin_in_order_items.image || '/assets/images/noimage.gif'}
              style={{
                borderRadius: '5px 5px 5px 5px',
                maxWidth: '55px',
              }}
              loading="lazy"
            />

            {isShown && (
              <img
                src={asin_in_order_items.image || '/assets/images/noimage.gif'}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  minWidth: '100px',
                  maxWidth: '200px',
                  minHeight: '150px',
                  maxHeight: '240px',
                  position: 'absolute',
                  top: '-100px',
                  left: '45%',
                  transform: 'translateX(15%)',
                  zIndex: 1,
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                }}
                alt={title}
                loading="lazy"
              />
            )}
          </Stack>
        </TableCell>

        <TableCell
          align="left"
          sx={{ minWidth: 100, maxWidth: 120, verticalAlign: 'middle', p: '16px 0px' }}
        >
          <Stack>
            <Tooltip
              title={title}
              placement="top-start"
              // arrow
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <Link
                href={`https://www.${sales_channel}/gp/product/${asin}`}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {title}
              </Link>
            </Tooltip>
            <Box>
              <Typography variant="subtitle1" display="inline">
                ASIN: &nbsp;
              </Typography>
              <Typography variant="body2" sx={{ wordWrap: 'break-word', display: 'inline' }}>
                {asin}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" display="inline">
                Seller SKU: &nbsp;
              </Typography>

              <Tooltip
                title={seller_sku}
                placement="right-end"
                // arrow
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <Typography
                  variant="body2"
                  // sx={{
                  //   wordWrap: 'break-word',
                  //   display: 'inline',
                  // }}
                >
                  {seller_sku}
                </Typography>
              </Tooltip>
            </Box>
          </Stack>
        </TableCell>

        <TableCell align="center" sx={{ minWidth: 40, verticalAlign: 'middle', p: '16px 0px' }}>
          <Typography variant="subtitle1">{quantity_ordered}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ minWidth: 210, width: 210, p: '16px 16px 16px 0px' }}>
          <Grid container rowSpacing={0} sx={{ mt: '2px' }}>
            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Item Total &nbsp;</Typography>
              <Typography variant="subtitle2" display="inline">
                <IconButton
                  sx={{ p: '0px' }}
                  onClick={() => setShowDetail((prevState) => !prevState)}
                  size="small"
                >
                  {!showDetail ? (
                    <Iconify icon="iconamoon:arrow-up-2-duotone" width={20} />
                  ) : (
                    <Iconify icon="iconamoon:arrow-down-2-duotone" width={20} />
                  )}
                </IconButton>
                {symbol}
                {item_price}
              </Typography>
            </Grid>
            {!showDetail && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    Unit Price: &nbsp;
                  </Typography>
                  <Typography variant="caption" display="inline">
                    {symbol}
                    {unitPrice}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    VAT Total: &nbsp;
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography variant="caption" display="inline">
                      {symbol}
                      {item_tax}
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
                    Refferal Fee: &nbsp;
                  </Typography>
                  <Typography variant="caption" display="inline">
                    &nbsp;
                    {symbol}
                    {Math.abs(referral_fee)}
                  </Typography>
                </Grid>
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
                    <Typography variant="caption" display="inline">
                      {symbol}
                      {Math.abs(FBA_fulfilment_fee)}
                    </Typography>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    Shipping: &nbsp;
                  </Typography>
                  <Typography variant="caption" display="inline">
                    {symbol}
                    {shipping_price}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    Shipping VAT: &nbsp;
                  </Typography>
                  <Typography variant="caption" display="inline">
                    {symbol}
                    {shipping_tax}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Divider sx={{ borderBottomWidth: '2px', mt: '4px', mb: '4px' }} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" display="inline">
                    <strong>Net Processed: &nbsp;</strong>
                  </Typography>
                  <Typography variant="caption" display="inline">
                    <strong>
                      {symbol}
                      {netProcessed}
                    </strong>
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </TableCell>
      </TableRow>
    );
  }
);

OrderContentTableRow.propTypes = {
  rowIndex: PropTypes.number,
  itemsLength: PropTypes.number,
  row: PropTypes.object,
  sales_channel: PropTypes.string,
  order_status: PropTypes.string,
  symbol: PropTypes.string,
  fulfillment_channel: PropTypes.string,
};

export default OrderContentTableRow;
