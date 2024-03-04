import PropTypes from 'prop-types';

import { memo } from 'react';
// @mui
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// components
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------

const OrderTableToolbar = memo(
  ({
    isFiltered,
    filterName,
    filterType,
    optionsType,
    onFilterName,
    onFilterType,
    onResetFilter,
    onApplyFilter,
    activeMarketplaces,
    handleMarketplace,
    marketplace,
    sortingOptions,
    onSortBy,
    sortBy,
  }) => {
    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.up('660'));

    return (
      <Grid container spacing={1} alignItems="center" sx={{ px: 2.5, py: 3 }}>
        <Grid item md={2} sm={small ? 6 : null} xs={12}>
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
        </Grid>

        <Grid item md={isFiltered ? 2 : 3} sm={small ? 6 : null} xs={12}>
          <TextField
            fullWidth
            size="small"
            name="Order By"
            id="orderBy"
            label="Order By"
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
        </Grid>

        <Grid item md={2} sm={small ? (isFiltered && 4) || 5 : null} xs={12}>
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
        </Grid>
        <Grid item md={3} sm={small ? (isFiltered && 4) || 5 : null} xs={12}>
          <TextField
            size="small"
            fullWidth
            name="FIlter Value"
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
        </Grid>
        <Grid item md={isFiltered ? 3 : 2} sm={small ? (isFiltered && 4) || 2 : null} xs={12}>
          <Stack direction="row-reverse" alignItems="right" spacing={small ? 0 : 1}>
            {isFiltered && (
              <Button
                color="error"
                sx={{
                  flexShrink: 0,
                  p: '5px 12px',
                  m: (small && 'auto') || '',
                }}
                onClick={onResetFilter}
                variant="soft"
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Clear
              </Button>
            )}
            <Button
              color="secondary"
              sx={{
                flexShrink: 0,
                p: '5px 12px',
                m: (small && 'auto') || '',
              }}
              onClick={onApplyFilter}
              variant="soft"
              startIcon={<Iconify icon="eva:search-fill" />}
            >
              Search
            </Button>
          </Stack>
        </Grid>
      </Grid>
    );
  }
);

OrderTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterType: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterType: PropTypes.func,
  onResetFilter: PropTypes.func,
  onApplyFilter: PropTypes.func,
  optionsType: PropTypes.arrayOf(PropTypes.object),
  sortingOptions: PropTypes.arrayOf(PropTypes.object),
  activeMarketplaces: PropTypes.arrayOf(PropTypes.object),
  handleMarketplace: PropTypes.func,
  marketplace: PropTypes.object,
  onSortBy: PropTypes.func,
  sortBy: PropTypes.object,
};

export default OrderTableToolbar;
