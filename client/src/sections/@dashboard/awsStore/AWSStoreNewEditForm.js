import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Yup from 'yup';
import { forwardRef, useEffect, useMemo, useState, memo, useCallback } from 'react';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { DesktopDatePicker } from '@mui/x-date-pickers';

//
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  LinearProgress,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import moment from 'moment';

import { useSnackbar } from '../../../components/snackbar';

import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AWSStoreNewEditForm = memo(
  ({
    Auth: { user },
    Order: { loading, ordersDate, ordersPreviousDate },
    Marketplace: { activeMarketplaces },
    isEdit = false,
    currentAwsStore,
    handleSubmited,
    handleData,
    handleSync,
  }) => {
    const NewStoreSchema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      seller_id: Yup.string().required('Seller ID is required'),
      lwa_client_id: Yup.string().required('Selling partner app client ID is required'),
      lwa_client_secret: Yup.string().required('Selling partner app client secret is required'),
      lwa_refresh_token: Yup.string().required('Refresh token is required'),
      aws_access_key_id: Yup.string().required('AWS access key ID is required'),
      aws_secret_access_key: Yup.string().required('AWS secret access key is required'),
      role_arn: Yup.string().required('AWS selling partner role is required'),
      marketplaces: Yup.array().min(1).required('At least one marketplace is required'),
      joined_at: Yup.date(),
    });

    const defaultValues = useMemo(
      () => ({
        title: currentAwsStore?.title || '',
        seller_id: currentAwsStore?.seller_id || '',
        lwa_client_id: currentAwsStore?.lwa_client_id || '',
        lwa_client_secret: currentAwsStore?.lwa_client_secret || '',
        lwa_refresh_token: currentAwsStore?.lwa_refresh_token || '',
        aws_access_key_id: currentAwsStore?.aws_access_key_id || '',
        aws_secret_access_key: currentAwsStore?.aws_secret_access_key || '',
        role_arn: currentAwsStore?.role_arn || '',
        marketplaces: currentAwsStore?.marketplaces || [],
        joined_at: currentAwsStore?.joined_at || moment(new Date()).format('YYYY-MM-DD'),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentAwsStore]
    );

    const methods = useForm({
      resolver: yupResolver(NewStoreSchema),
      defaultValues,
    });

    const {
      reset,
      control,
      // getValues,
      // setValue,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const [isDisable, setIsDisable] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      if (isEdit && currentAwsStore) {
        reset(defaultValues);
      }
      if (!isEdit) {
        reset(defaultValues);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentAwsStore]);

    useEffect(() => {
      if (!loading && ordersDate)
        enqueueSnackbar(`We have fetched orders of 
${ordersDate && moment(ordersDate).format('MMMM')}`);

      if (
        ordersPreviousDate &&
        moment(ordersDate).format('MMMM') !== moment(ordersPreviousDate).format('MMMM')
      ) {
        enqueueSnackbar(`We have fetched orders of 
  ${moment(ordersPreviousDate).format('MMMM')}`);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, ordersPreviousDate]);

    const onSubmit = useCallback(
      async (data) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const storeData = {
            marketplaces: data.marketplaces,
            title: data.title ? data.title : null,
            lwa_client_id: data.lwa_client_id ? data.lwa_client_id : null,
            lwa_client_secret: data.lwa_client_secret ? data.lwa_client_secret : null,
            lwa_refresh_token: data.lwa_refresh_token ? data.lwa_refresh_token : null,
            aws_access_key_id: data.aws_access_key_id ? data.aws_access_key_id : null,
            aws_secret_access_key: data.aws_secret_access_key ? data.aws_secret_access_key : null,
            role_arn: data.role_arn ? data.role_arn : null,
            seller_id: data.seller_id ? data.seller_id : null,
            joined_at: moment(data.joined_at).format('YYYY-MM-DD'),
          };

          handleData(storeData);
          setIsDisable(false);
          handleSubmited(storeData);

          reset();
        } catch (error) {
          console.error(error);
        }
      },
      [handleData, handleSubmited, reset]
    );

    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              {isEdit && (
                <Stack direction="row-reverse" alignItems="flex-end" sx={{ mb: 3 }}>
                  <Button
                    sx={{ mr: 1 }}
                    disabled={isDisable}
                    onClick={() => setIsDisable(true)}
                    color="secondary"
                    variant="soft"
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{ mr: 1 }}
                    // disabled={isDisable}
                    onClick={() => handleSync()}
                    color="warning"
                    variant="soft"
                  >
                    Sync
                  </Button>
                </Stack>
              )}
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                  lg: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="title" disabled={isEdit && !isDisable} label="Title *" />
                <RHFTextField
                  name="seller_id"
                  disabled={isEdit && !isDisable}
                  label="Seller ID *"
                />
                <RHFTextField
                  name="lwa_client_id"
                  disabled={isEdit && !isDisable}
                  label="Selling Partner App Client ID *"
                />
                <RHFTextField
                  name="lwa_client_secret"
                  disabled={isEdit && !isDisable}
                  label="Selling Partner App Client Secret *"
                />
                <RHFTextField
                  name="lwa_refresh_token"
                  disabled={isEdit && !isDisable}
                  label="Refresh Token *"
                />
                <RHFTextField
                  name="aws_access_key_id"
                  disabled={isEdit && !isDisable}
                  label="AWS Access Key ID *"
                />
                <RHFTextField
                  name="aws_secret_access_key"
                  disabled={isEdit && !isDisable}
                  label="AWS Secret Access Key *"
                />
                <RHFTextField
                  name="role_arn"
                  disabled={isEdit && !isDisable}
                  label="AWS Selling Partner Role *"
                />

                <Controller
                  name="marketplaces"
                  control={control}
                  // defaultValue={null}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      fullWidth
                      multiple
                      // defaultValue={[]}
                      // console.log(value)
                      // value.length && activeMarketplaces
                      //   ? activeMarketplaces.filter((market) => {
                      //       console.log(market.id === value);
                      //       return market.id === value;
                      //     })
                      //   : value || []
                      // loading={!activeMarketplaces}
                      disabled={isEdit && !isDisable}
                      options={activeMarketplaces || []}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.country}
                      value={value}
                      isOptionEqualToValue={(option, v) => v && option.id === v.id}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} />
                          {option.country}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Marketplaces *"
                          placeholder="Marketplace"
                          error={invalid}
                          helperText={invalid ? error.message : null}
                          id="marketplaces"
                          // margin="none"
                          // fullWidth
                          // color="primary"
                        />
                      )}
                      onChange={(e, data) => {
                        onChange(data);
                      }}
                    />
                  )}
                />
                <Controller
                  name="joined_at"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <DesktopDatePicker
                      label="Joining Date *"
                      disableFuture
                      disabled={isEdit && !isDisable}
                      value={value}
                      onChange={(date) => onChange(moment(date).format('YYYY-MM-DD'))}
                      renderInput={(params) => (
                        <TextField
                          error={invalid}
                          helperText={invalid ? error.message : null}
                          id="joined_at"
                          margin="none"
                          fullWidth
                          color="primary"
                          {...params}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  disabled={isEdit && !isDisable}
                  variant="soft"
                  loading={isSubmitting}
                >
                  {!isEdit ? 'Create' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={loading}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            We are fetching your data, Please wait....
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" sx={{ mb: 4 }}>
              Note: Don&apos;t close this window. Fetching old data can take several minutes.
            </DialogContentText>

            <DialogContentText sx={{ display: 'flex', justifyContent: 'center' }}>
              <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360, mb: 4 }} />
            </DialogContentText>
            {currentAwsStore && (
              <DialogContentText sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                We are fetching orders of{' '}
                {`${
                  ordersDate
                    ? moment(ordersDate).format('MMMM')
                    : moment(currentAwsStore.joined_at).format('MMMM')
                } 
              `}
                {/* ${
                !loading &&
                enqueueSnackbar(`we are fetching order of 
            ${ordersDate && moment(ordersDate).format('MMMM')}`)
              } */}
              </DialogContentText>
            )}
          </DialogContent>
        </Dialog>
      </FormProvider>
      //   )}
      // </>
    );
  }
);

AWSStoreNewEditForm.propTypes = {
  Auth: PropTypes.object.isRequired,
  Order: PropTypes.object.isRequired,
  Marketplace: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
  currentAwsStore: PropTypes.object,
  handleSubmited: PropTypes.func,
  handleData: PropTypes.func,
  handleSync: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Order: state.Order,
  Marketplace: state.Marketplace,
});

export default connect(mapStateToProps, {})(AWSStoreNewEditForm);
