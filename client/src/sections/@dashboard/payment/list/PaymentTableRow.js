// import { useState, useEffect, memo, useCallback } from 'react';
import { memo } from 'react';

import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  Tooltip,
  TableCell,
  Checkbox,
  Typography,
  Box,
  // Stack,
  // IconButton,
  // Divider,
  // Grid,
  // Link,
  // Button,
} from '@mui/material';

// import Fade from '@mui/material/Fade';
// import { alpha, useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// // Moment for date
// import moment from 'moment';
// // hooks
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// // components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
// import { useSnackbar } from '../../../../components/snackbar';
// import ConfirmDialog from '../../../../components/confirm-dialog';

// // routes
// import { PATH_DASHBOARD } from '../../../../routes/paths';

// // ----------------------------------------------------------------------
// import { CustomAvatar } from '../../../../components/custom-avatar';
// ----------------------------------------------------------------------

const PaymentTableRow = ({
  // rowIndex, user,

  row,
  selected,
  //  onEditRow,
  onSelectRow,
}) => {
  const {
    id,
    // payment_reference, payment_via,
    status,
    orderDetails,
    paymentDetails,
    // processedBy
  } = row || [];

  const {
    // account,
    // account_name,
    // amount_currency,
    marketplace,
    // recipient_email,
    // recipient_id,
    // source_currency,
    // store_name,
    // symbol,
    // target_currency,
  } = paymentDetails || [];

  // const orderItemsLength = order_items_order_id.length;

  // const [isShown, setIsShown] = useState([]);

  // ******************************************

  // const [openConfirm, setOpenConfirm] = useState(false);

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

  // const handleCloseConfirm = () => {
  //   setOpenConfirm(false);
  // };

  // const { enqueueSnackbar } = useSnackbar();

  // const setOnCopy = useCallback(() => {
  //   enqueueSnackbar('Copied!');
  // }, [enqueueSnackbar]);

  return (
    <>
      <TableRow selected={selected} hover key={id}>
        <TableCell padding="checkbox">
          <Checkbox name="check" aria-label="check_box" checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">
          <Typography variant="caption" sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box fontWeight="fontWeightMedium" display="inline" sx={{ mr: 0.5 }}>
              {orderDetails && orderDetails.id}
            </Box>
            {marketplace && (
              <Tooltip title={marketplace.country}>
                <Iconify
                  width={20}
                  icon={`twemoji:flag-${marketplace.country.toLowerCase().replace(/ /g, '-')}`}
                />
              </Tooltip>
            )}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="caption">
            <Box fontWeight="fontWeightMedium" display="inline">
              {orderDetails && orderDetails.seller_order_id}
            </Box>
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption">
            <Box fontWeight="fontWeightMedium" display="inline">
              {orderDetails && orderDetails.purchase_price}

              {marketplace && marketplace.symbol}
            </Box>
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label
            color={(status === 'Paid' && 'success') || (status === 'Unpaid' && 'error')}
            variant="filled"
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>

      {/* <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Take Over"
          content="Are you sure you want to take over?"
          action={
            <Button variant="contained" color="primary" onClick={handleTakeOverButton}>
              Confirm
            </Button>
          }
        /> */}
    </>
  );
};

PaymentTableRow.propTypes = {
  // rowIndex: PropTypes.number,
  // user: PropTypes.object,

  row: PropTypes.object,
  selected: PropTypes.bool,
  // onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default memo(PaymentTableRow);
