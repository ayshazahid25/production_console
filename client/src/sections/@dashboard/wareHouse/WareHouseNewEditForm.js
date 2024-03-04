import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';

//
import {
  Card,
  Grid,
  Stack,
  Button,
  Typography,
  Autocomplete,
  Checkbox,
  TextField,
} from '@mui/material';

// components
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { MotionContainer, varBounce } from '../../../components/animate';
// assets
import { PageNotFoundIllustration } from '../../../assets/illustrations';

// ----------------------------------------------------------------------

const WareHouseNewEditForm = memo(
  ({
    Auth: { user },
    Marketplace: { activeMarketplaces },
    isEdit = false,
    isBannable = false,
    currentWareHouse,
    handleSubmited,
    handleData,
    awsStoreId,
    err,
  }) => {
    const NewWareHouseSchema = Yup.object().shape({
      name: Yup.string().required('Name is required.'),
      city: Yup.string().required('City is required.'),
      county: Yup.string(),
      state_or_region: Yup.string().required('Region is required.'),
      postal_code: Yup.string().required('Postal Code is required.'),
      address_1: Yup.string().required('Address 1 is required.'),
      address_2: Yup.string(),
      address_3: Yup.string(),

      marketplace: Yup.object().required('Marketplace is required.').nullable(true),
    });

    const defaultValues = useMemo(
      () => ({
        name: currentWareHouse?.name || '',
        address_1: currentWareHouse?.address_1 || '',
        address_2: currentWareHouse?.address_2 || '',
        address_3: currentWareHouse?.address_3 || '',
        city: currentWareHouse?.city || '',
        county: currentWareHouse?.county || '',
        country: currentWareHouse?.country || '',
        country_code: currentWareHouse?.country_code || '',
        state_or_region: currentWareHouse?.state_or_region || '',
        postal_code: currentWareHouse?.postal_code || '',
        marketplace: currentWareHouse?.ware_houses_linked_to_marketplace || null,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentWareHouse]
    );

    const methods = useForm({
      resolver: yupResolver(NewWareHouseSchema),
      defaultValues,
    });
    const {
      // register,
      reset,
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const [isDisable, setIsDisable] = useState(false);

    useEffect(() => {
      if (isEdit && currentWareHouse) {
        reset(defaultValues);
      }
      if (!isEdit) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentWareHouse]);

    const onSubmit = useCallback(
      async (data) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const wareHouseData = {
            name: data.name ? data.name : null,
            address_1: data.address_1 ? data.address_1 : null,
            address_2: data.address_2 ? data.address_2 : null,
            address_3: data.address_3 ? data.address_3 : null,
            city: data.city ? data.city : null,
            county: data.county ? data.county : null,
            state_or_region: data.state_or_region ? data.state_or_region : null,
            postal_code: data.postal_code ? data.postal_code : null,
            store_id: awsStoreId,
            marketplace: data.marketplace ? data.marketplace.id : null,
          };

          handleSubmited(wareHouseData);
          setIsDisable(false);
        } catch (e) {
          console.error(e);
        }
      },
      [handleSubmited, awsStoreId]
    );

    // const onDelete = useCallback(
    //   (status) => {
    //     // setOnActive(status);
    //     deleteUserRequest({
    //       wareHouseId: [currentWareHouse.id],
    //       status,
    //       isEdit: true,
    //     });
    //   },
    //   [deleteUserRequest, currentWareHouse]
    // );

    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              {err === 'Please enter a valid warehouse id' ? (
                <MotionContainer>
                  <m.div variants={varBounce().in}>
                    <Typography variant="h3" paragraph>
                      Sorry, WareHouse not found!
                    </Typography>
                  </m.div>

                  <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Sorry, we couldn’t find the WareHouse you’re looking for. Perhaps you’ve
                      mistyped the id Be sure to check your spelling.
                    </Typography>
                  </m.div>

                  <m.div variants={varBounce().in}>
                    <PageNotFoundIllustration
                      sx={{
                        height: 260,
                        my: { xs: 5, sm: 10 },
                      }}
                    />
                  </m.div>
                </MotionContainer>
              ) : (
                <>
                  <Stack direction="row-reverse" alignItems="flex-end" sx={{ mb: 3 }}>
                    {isBannable && (
                      <Button
                        sx={{ mr: 1 }}
                        disabled={isDisable}
                        onClick={() => setIsDisable(true)}
                        color="secondary"
                        variant="soft"
                      >
                        Edit
                      </Button>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <RHFTextField
                        name="name"
                        disabled={isBannable && !isDisable}
                        label="Name *"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <RHFTextField
                        name="city"
                        disabled={isBannable && !isDisable}
                        label="City *"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <RHFTextField
                        name="county"
                        disabled={isBannable && !isDisable}
                        label="County"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <RHFTextField
                        name="state_or_region"
                        disabled={isBannable && !isDisable}
                        label="Region *"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="marketplace"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error, invalid },
                        }) => (
                          <Autocomplete
                            fullWidth
                            disabled={isBannable && !isDisable}
                            options={activeMarketplaces || []}
                            getOptionLabel={(option) => option.country}
                            value={value}
                            isOptionEqualToValue={(option, v) => option.id === v.id}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} />
                                {option.country}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Marketplace *"
                                placeholder="Marketplace"
                                error={invalid}
                                helperText={invalid ? error.message : null}
                                id="marketplace"
                              />
                            )}
                            onChange={(e, data) => {
                              onChange(data);
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <RHFTextField
                        name="postal_code"
                        disabled={isBannable && !isDisable}
                        label="Postal Code *"
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <RHFTextField
                        name="address_1"
                        disabled={isBannable && !isDisable}
                        label="Address 1 *"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <RHFTextField
                        name="address_2"
                        disabled={isBannable && !isDisable}
                        label="Address 2"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <RHFTextField
                        name="address_3"
                        disabled={isBannable && !isDisable}
                        label="Address 3"
                      />
                    </Grid>
                  </Grid>

                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton
                      type="submit"
                      disabled={isBannable && !isDisable}
                      variant="soft"
                      loading={isSubmitting}
                    >
                      {!isEdit ? 'Submit' : 'Save Changes'}
                    </LoadingButton>
                  </Stack>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

WareHouseNewEditForm.propTypes = {
  Marketplace: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
  isBannable: PropTypes.bool,
  currentWareHouse: PropTypes.object,
  handleSubmited: PropTypes.func,
  handleData: PropTypes.func,
  awsStoreId: PropTypes.string,
  err: PropTypes.string,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Marketplace: state.Marketplace,
});

export default connect(mapStateToProps, {})(WareHouseNewEditForm);
