import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
//
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  Tooltip,
} from '@mui/material';
// utils
import FormatPermissionData from '../../../utils/permissionSetting/FormatPermissionData';
import RadioMenuList from '../../../utils/permissionSetting/RadioMenuList';
// components
import Iconify from '../../../components/iconify';

import FormProvider from '../../../components/hook-form';

// ----------------------------------------------------------------------

function UserPermissionSettings({
  isEdit = false,
  currentPermission,
  currentUser,
  handleSubmited,

  handleBack,
}) {
  const theme = useTheme();

  const NewPermissionSchema = Yup.object().shape({
    dashboard: Yup.string().required('Dashboard is required'),
    usersPermissions: Yup.string().required('Users Permissions is required'),
    manageInventoryOrAddAProduct: Yup.string().required(
      'Manage Inventory/Add A Product is required'
    ),
    manageFBAInventoryShipments: Yup.string().required(
      'Manage FBA Inventory Shipments is required'
    ),
    manageCategories: Yup.string().required('Manage Categories is required'),
    marketplaces: Yup.string().required('Marketplaces is required'),
    manageOrders: Yup.string().required('Manage Orders is required'),
    manageRefunds: Yup.string().required('Manage Refunds is required'),
    manageReturns: Yup.string().required('Manage Returns is required'),
    manageVendors: Yup.string().required('Manage Vendors is required'),
    huntingForm: Yup.string().required('Hunting Form is required'),
    changeVendor: Yup.string().required('Change Vendor is required'),
    approveHuntedLists: Yup.string().required('Approve Hunted Lists is required'),
  });

  const defaultValues = useMemo(
    () => ({
      dashboard:
        (currentPermission?.dashboard_view_and_edit && 'viewEdit') ||
        (currentPermission?.dashboard_view && 'view') ||
        'view',
      usersPermissions:
        (currentPermission?.user_create_view_and_edit && 'admin') ||
        (currentPermission?.user_view_and_edit && 'viewEdit') ||
        (currentPermission?.user_view && 'view') ||
        'none',
      manageInventoryOrAddAProduct:
        (currentPermission?.manage_inventory_view_and_edit && 'viewEdit') || 'none',
      manageFBAInventoryShipments:
        (currentPermission?.manage_fba_inventory_view_and_edit && 'viewEdit') || 'none',
      manageCategories:
        (currentPermission?.category_create_view_and_edit && 'admin') ||
        (currentPermission?.category_view_and_edit && 'viewEdit') ||
        (currentPermission?.category_view && 'view') ||
        'none',
      marketplaces:
        (currentPermission?.marketplace_create_view_and_edit && 'admin') ||
        (currentPermission?.marketplace_view_and_edit && 'viewEdit') ||
        (currentPermission?.marketplace_view && 'view') ||
        'none',

      manageOrders:
        (currentPermission?.manage_orders_create_view_and_edit && 'admin') ||
        (currentPermission?.manage_orders_view_and_edit && 'viewEdit') ||
        (currentPermission?.manage_orders_view && 'view') ||
        'none',

      manageRefunds: (currentPermission?.manage_refunds_view_and_edit && 'viewEdit') || 'none',
      manageReturns: (currentPermission?.manage_returns_view_and_edit && 'viewEdit') || 'none',

      manageVendors:
        (currentPermission?.manage_vendors_create_view_and_edit && 'admin') ||
        (currentPermission?.manage_vendors_view_and_edit && 'viewEdit') ||
        (currentPermission?.manage_vendors_view && 'view') ||
        'none',
      huntingForm: (currentPermission?.hunting_form_view_and_edit && 'viewEdit') || 'none',
      changeVendor: (currentPermission?.change_vendor_view_and_edit && 'viewEdit') || 'none',
      approveHuntedLists:
        (currentPermission?.approve_hunting_list_create_view_and_edit && 'admin') ||
        (currentPermission?.approve_hunting_list_view_and_edit && 'viewEdit') ||
        'none',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPermission]
  );

  const methods = useForm({
    resolver: yupResolver(NewPermissionSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentPermission) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPermission]);

  const onBackClick = () => {
    const permission = FormatPermissionData(getValues());
    handleBack(permission);
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!isEdit) reset();
      // navigate(PATH_DASHBOARD.users.list);
      const permission = FormatPermissionData(data);

      handleSubmited(permission);
    } catch (error) {
      console.error(error);
    }
  };

  const onNoneClick = (RadioMenu) => {
    RadioMenu[`${Object.keys(RadioMenu)[0]}`].map((menu, i) => {
      const key = Object.keys(menu)[0];
      setValue(key, menu[key].none ? 'none' : 'view');
      return '';
    });
  };

  const onViewClick = (RadioMenu) => {
    RadioMenu[`${Object.keys(RadioMenu)[0]}`].map((menu, i) => {
      const key = Object.keys(menu)[0];
      setValue(key, menu[key].view ? 'view' : 'none');
      return '';
    });
  };

  const onViewEditClick = (RadioMenu) => {
    RadioMenu[`${Object.keys(RadioMenu)[0]}`].map((menu, i) => {
      const key = Object.keys(menu)[0];
      setValue(key, menu[key].viewEdit ? 'viewEdit' : 'view');
      return '';
    });
  };

  const onAdminClick = (RadioMenu) => {
    RadioMenu[`${Object.keys(RadioMenu)[0]}`].map((menu, i) => {
      const key = Object.keys(menu)[0];
      setValue(key, menu[key].admin ? 'admin' : 'viewEdit');
      return '';
    });
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            {!isEdit ? (
              <Stack direction="row" justifyContent="space-between">
                <Button
                  color="inherit"
                  onClick={() => onBackClick()}
                  startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                  Back
                </Button>

                <LoadingButton variant="soft" type="submit" loading={isSubmitting}>
                  Create User
                </LoadingButton>
              </Stack>
            ) : (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton variant="soft" type="submit" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            )}
            <Typography gutterBottom variant="h3" component="div">
              User Permissions
            </Typography>
            <Typography gutterBottom variant="subtitle2" component="div">
              {isEdit ? 'Edit' : 'Add'} Permissions for
              {currentUser
                ? ` ${currentUser.first_name} ${currentUser.last_name} (${currentUser.email}) `
                : ''}
              in BUGGAZ
            </Typography>
            {RadioMenuList.map((RadioMenu, index) => (
              <Box key={index} rowGap={1} display="grid" sx={{ my: 3 }}>
                <Grid
                  container
                  // rowSpacing={4}
                  sx={{ mb: 3 }}
                >
                  <Grid item xs={4}>
                    <Typography variant="h6">{Object.keys(RadioMenu)[0]}</Typography>
                  </Grid>

                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Button
                      sx={{
                        color: `${theme.palette.error?.main}`,
                        bgcolor: `${theme.palette.error?.lighter}`,
                        '&:hover': {
                          bgcolor: `${theme.palette.error?.light}`,
                        },
                      }}
                      onClick={() => onNoneClick(RadioMenu)}
                      size="small"
                      variant="soft"
                    >
                      None
                    </Button>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Button
                      sx={{
                        color: `${theme.palette.error?.main}`,
                        bgcolor: `${theme.palette.error?.lighter}`,
                        '&:hover': {
                          bgcolor: `${theme.palette.error?.light}`,
                        },
                      }}
                      onClick={() => onViewClick(RadioMenu)}
                      size="small"
                      variant="soft"
                    >
                      View
                    </Button>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Button
                      sx={{
                        color: `${theme.palette.error?.main}`,
                        bgcolor: `${theme.palette.error?.lighter}`,
                        '&:hover': {
                          bgcolor: `${theme.palette.error?.light}`,
                        },
                      }}
                      onClick={() => onViewEditClick(RadioMenu)}
                      size="small"
                      variant="soft"
                    >
                      View & Edit
                    </Button>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Button
                      sx={{
                        color: `${theme.palette.error?.main}`,
                        bgcolor: `${theme.palette.error?.lighter}`,
                        '&:hover': {
                          bgcolor: `${theme.palette.error?.light}`,
                        },
                      }}
                      onClick={() => onAdminClick(RadioMenu)}
                      size="small"
                      variant="soft"
                    >
                      Admin
                    </Button>
                  </Grid>
                </Grid>

                {RadioMenu[`${Object.keys(RadioMenu)[0]}`].map((menu, i) => (
                  <FormControl key={i}>
                    <Grid container>
                      <Grid item xs={4}>
                        <FormLabel sx={{ color: 'rgb(127, 126, 126)' }}>
                          {menu[`${Object.keys(menu)[0]}`].title}{' '}
                          {menu[`${Object.keys(menu)[0]}`].note && (
                            <Tooltip title={menu[`${Object.keys(menu)[0]}`].note}>
                              <Iconify
                                inline
                                icon="tabler:exclamation-circle"
                                sx={{
                                  color: theme.palette.warning?.main,
                                  width: '18px',
                                  height: '18px',
                                }}
                              />
                            </Tooltip>
                          )}
                        </FormLabel>
                      </Grid>

                      <Grid item xs={8}>
                        <Controller
                          name={`${Object.keys(menu)[0]}`}
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error, invalid },
                          }) => (
                            <RadioGroup
                              row
                              label={`${Object.keys(menu)[0]}`}
                              value={value}
                              onChange={(val) => onChange(val)}
                              error={error}
                            >
                              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                {menu[`${Object.keys(menu)[0]}`].none && <Radio value="none" />}
                              </Grid>
                              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                {menu[`${Object.keys(menu)[0]}`].view && <Radio value="view" />}
                              </Grid>
                              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                {menu[`${Object.keys(menu)[0]}`].viewEdit && (
                                  <Radio value="viewEdit" />
                                )}
                              </Grid>
                              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                {menu[`${Object.keys(menu)[0]}`].admin && <Radio value="admin" />}
                              </Grid>
                            </RadioGroup>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                ))}
              </Box>
            ))}
            {!isEdit ? (
              <Stack direction="row" justifyContent="space-between">
                <Button
                  color="inherit"
                  onClick={() => onBackClick()}
                  startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                  Back
                </Button>

                <LoadingButton variant="soft" type="submit" loading={isSubmitting}>
                  Create User
                </LoadingButton>
              </Stack>
            ) : (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton variant="soft" type="submit" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserPermissionSettings.propTypes = {
  isEdit: PropTypes.bool,
  currentPermission: PropTypes.object,
  currentUser: PropTypes.object,
  handleSubmited: PropTypes.func,
  handleBack: PropTypes.func,
};

export default UserPermissionSettings;
