import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import DateRangePicker from '../../../../components/date-range-picker';

// ----------------------------------------------------------------------

const OrderTableFilter = ({
  open,
  onOpen,
  onClose,

  // Filter
  isFiltered,
  filterName,
  optionsType,
  onFilterName,
  filterType,
  onFilterType,
  // Filter action
  onResetFilter,
  onApplyFilter,
  // Marketplace
  activeMarketplaces,
  handleMarketplace,
  marketplace,
  // Sorting
  sortingOptions,
  onSortBy,
  sortBy,
  // Date Filter
  optionForDateRange,
  pickerInput,
  dateRange,
  handleDateRange,
  onApplyDate,
  small,
}) => {
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderMarketplace = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        MarketPlace
      </Typography>
      <Autocomplete
        fullWidth
        sx={{
          textTransform: 'capitalize',
        }}
        value={marketplace}
        options={activeMarketplaces || []}
        getOptionLabel={(option) => option.country}
        isOptionEqualToValue={(option, v) => option.id === v.id}
        onChange={(event, newValue) => {
          handleMarketplace(newValue);
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <Iconify
              sx={{ mr: 1 }}
              key={option.country}
              icon={`twemoji:flag-${option.country.toLowerCase().replace(/ /g, '-')}`}
            />

            {option.country}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            id="marketplaces"
            label="Marketplaces"
            placeholder="Marketplace"
            InputProps={
              marketplace
                ? {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          key={params.inputProps.value}
                          icon={`twemoji:flag-${params.inputProps.value
                            .toLowerCase()
                            .replace(/ /g, '-')}`}
                        />
                      </InputAdornment>
                    ),
                  }
                : { ...params.InputProps }
            }
          />
        )}
      />
    </Stack>
  );
  const renderSortBy = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        OrderBY
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="Order By"
        placeholder="Order By"
        select
        value={(sortBy && JSON.stringify(sortBy)) || ''}
        onChange={onSortBy}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 230,
              },
            },
          },
        }}
        sx={{
          textTransform: 'capitalize',
        }}
      >
        {sortingOptions.map((option) => (
          <MenuItem
            key={option.id}
            value={JSON.stringify(option.value)}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );

  const renderSearchFilter = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Search
      </Typography>
      <TextField
        fullWidth
        size="small"
        select
        name="Filter Type"
        value={filterType}
        onChange={onFilterType}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 230,
              },
            },
          },
        }}
        sx={{
          textTransform: 'capitalize',
        }}
      >
        {optionsType.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        fullWidth
        name="FIlter Value"
        sx={{ mt: 1 }}
        value={filterName}
        onChange={onFilterName}
        onKeyDown={(event) => event.key === 'Enter' && onApplyFilter()}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <Stack
        direction="row"
        justifyContent={(isFiltered && 'space-between') || 'right'}
        sx={{ mt: 1.5 }}
      >
        <Button
          color="secondary"
          sx={{
            flexShrink: 0,
            p: '5px 12px',
          }}
          onClick={onApplyFilter}
          variant="soft"
          startIcon={<Iconify icon="eva:search-fill" />}
        >
          Search
        </Button>
        {isFiltered && (
          <Button
            color="error"
            sx={{
              flexShrink: 0,
              p: '5px 12px',
            }}
            onClick={onResetFilter}
            variant="soft"
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );

  const renderDateFilter = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Date
      </Typography>

      <TextField
        fullWidth
        select
        name="DateTime"
        value={dateRange}
        onChange={handleDateRange}
        size="small"
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: (small && 240) || 'auto',
          textTransform: 'capitalize',
          mb: 1,
        }}
      >
        {optionForDateRange.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {dateRange === 'custom' && (
        <DateRangePicker
          open={pickerInput.open}
          startDate={pickerInput.startDate}
          endDate={pickerInput.endDate}
          onChangeStartDate={pickerInput.onChangeStartDate}
          onChangeEndDate={pickerInput.onChangeEndDate}
          onClose={pickerInput.onClose}
          onApply={() => onApplyDate()}
          isError={pickerInput.isError}
        />
      )}
    </Stack>
  );

  return (
    <>
      <Button
        size="small"
        disableRipple
        color="inherit"
        endIcon={
          // <Badge color="error" variant="dot"
          // invisible={!canReset}
          // >
          <Iconify icon="ic:round-filter-list" />
          // </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderMarketplace}
            {renderSortBy}
            {renderSearchFilter}
            {renderDateFilter}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
};

OrderTableFilter.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool,
  //   Filter
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterType: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterType: PropTypes.func,
  //   Filte Action
  onResetFilter: PropTypes.func,
  onApplyFilter: PropTypes.func,
  optionsType: PropTypes.arrayOf(PropTypes.object),
  //   Sorting
  sortingOptions: PropTypes.arrayOf(PropTypes.object),
  activeMarketplaces: PropTypes.arrayOf(PropTypes.object),
  onSortBy: PropTypes.func,
  sortBy: PropTypes.object,
  // Marketplace
  handleMarketplace: PropTypes.func,
  marketplace: PropTypes.object,
  //   Date Filter
  handleDateRange: PropTypes.func,
  dateRange: PropTypes.string,
  onApplyDate: PropTypes.func,
  pickerInput: PropTypes.object,
  optionForDateRange: PropTypes.arrayOf(PropTypes.object),
  small: PropTypes.bool,
};

export default memo(OrderTableFilter);
// ----------------------------------------------------------------------
