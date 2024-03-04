import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
// components
import Iconify from '../iconify';
import CustomPopover, { usePopover } from '../custom-popover';

// ----------------------------------------------------------------------

export default function PaymentsSort({ sort, onSort, sortOptions }) {
  const popover = usePopover();

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        Sort By:
        <Box
          component="span"
          color={sort.color}
          sx={{
            ml: 0.5,
            fontWeight: 'fontWeightBold',
            textTransform: 'capitalize',
          }}
        >
          {/* <Typography color={sort.color} variant="caption"> */}
          {sort.value}
          {/* </Typography> */}
        </Box>
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort.value}
            onClick={() => {
              popover.onClose();
              onSort(option);
            }}
          >
            <Box fontWeight="fontWeightBold" color={option.color}>
              <Typography variant="subtitle1">{option.value}</Typography>
            </Box>
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

PaymentsSort.propTypes = {
  onSort: PropTypes.func,
  sort: PropTypes.object,
  sortOptions: PropTypes.array,
};
