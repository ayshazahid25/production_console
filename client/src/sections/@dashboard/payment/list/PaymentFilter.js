import { useCallback, useRef, memo } from 'react';

import PropTypes from 'prop-types';

import { InputAdornment, TextField, IconButton, Box } from '@mui/material';
import Zoom from '@mui/material/Zoom';

import { PaymentsSort } from '../../../../components/payments';
import Iconify from '../../../../components/iconify';
// utils
import { PAYMENT_SORT_OPTIONS } from '../../../../utils/payment/PaymentTable';

// import { setFromValue, setToValue } from '../../utils/order/SetDateRangeValue';

const PaymentFilter = ({
  filterStatus,
  filterName,
  search,
  handleFilterStatus,
  handleFilterName,
  handleResetFilter,
  onApplyFilter,
}) => {
  const searchRef = useRef(null);

  const handleClick = useCallback(() => {
    search.onTrue();
    setTimeout(() => searchRef.current && searchRef.current.focus(), 100);
  }, [search]);

  const handleBlurEvent = useCallback(() => {
    if (!filterName) search.onFalse();
  }, [search, filterName]);

  return (
    <Box
      alignItems="center"
      sx={{
        ml: 2,
        display: 'flex',
        top: 0,
        height: 64,
        position: {
          md: 'absolute',
        },
      }}
    >
      <PaymentsSort
        sort={filterStatus}
        onSort={handleFilterStatus}
        sortOptions={PAYMENT_SORT_OPTIONS}
      />

      {!search.value && !filterName && (
        <IconButton onClick={handleClick}>
          <Iconify icon="eva:search-fill" />
        </IconButton>
      )}

      <Zoom in={search.value || !!filterName}>
        <Box alignItems="center">
          <TextField
            size="small"
            fullWidth
            name="FIlter Value"
            inputRef={searchRef}
            onBlur={handleBlurEvent}
            value={filterName}
            onChange={handleFilterName}
            onKeyDown={(event) => event.key === 'Enter' && onApplyFilter()}
            placeholder="Search..."
            InputProps={{
              style: { paddingRight: 0 },
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: filterName && (
                <InputAdornment position="end" sx={{ pr: 1 }}>
                  <IconButton
                    sx={{
                      p: '1px 2px 0px 2px',
                    }}
                    size="small"
                    onClick={handleResetFilter}
                  >
                    <Iconify icon="system-uicons:cross" width={18} sx={{ color: 'error.light' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Zoom>

      {/* <Box
    alignItems="center"
    sx={{
      ml: 2,

      display: 'flex',
      top: 0,
      height: 64,
      position: {
        md: 'absolute',
      },
    }}
  >
    <OrderTableFilter
      open={openFilters.value}
      onOpen={openFilters.onTrue}
      onClose={openFilters.onFalse}
      // Filter
      isFiltered={isFiltered}
      filterName={filterName}
      optionsType={TYPE_OPTIONS}
      onFilterName={handleFilterName}
      filterType={filterType}
      onFilterType={handleFilterType}
      // Filter action
      onResetFilter={handleResetFilter}
      onApplyFilter={onApplyFilter}
      // Sorting
      sortingOptions={SORTING_OPTIONS}
      onSortBy={handleSortBy}
      sortBy={sortBy}
      // Date Filter
      optionForDateRange={DATE_RANGE_OPTION}
      pickerInput={pickerInput}
      dateRange={dateRange}
      handleDateRange={handleDateRange}
      onApplyDate={onApplyDate}
      small={small}
    />
    */}
    </Box>
  );
};

PaymentFilter.propTypes = {
  filterStatus: PropTypes.object,
  filterName: PropTypes.string,
  search: PropTypes.object,
  handleFilterStatus: PropTypes.func,
  handleFilterName: PropTypes.func,
  handleResetFilter: PropTypes.func,
  onApplyFilter: PropTypes.func,
};

export default memo(PaymentFilter);
