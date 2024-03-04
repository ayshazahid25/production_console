import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Checkbox,
  TextField,
} from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';
import { clearMessage } from '../../actions/car';
import { getCategoryRequest, clearCategoryList } from '../../actions/category';
// ----------------------------------------------------------------------

function CreateEditCarDialog({
  Car: { message },
  Category: { categoryList },
  getCategory,
  clrCategoryList,
  isEdit = false,
  currentCar,
  handleSubmited,
  clrMessage,
}) {
  const [open, setOpen] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message);
      handleClose();
      clrMessage();
    }

    // eslint-disable-next-line
  }, [message]);

  useEffect(() => {
    if (categoryList == null) {
      getCategory();
    } else {
      setCategorys(categoryList);
    }

    // eslint-disable-next-line
  }, [categoryList]);

  useEffect(
    () => () => clrCategoryList(),
    // eslint-disable-next-line
    []
  );

  const NewCarSchema = Yup.object().shape({
    name: Yup.string().min(3).max(50).required('Name is required'),
    reg_no: Yup.string().min(3).max(50).required('Reg No. is required'),
    model: Yup.string().min(3).max(50).required('Model is required'),
    make: Yup.string().min(3).max(50),
    color: Yup.string().min(3).max(50),
    category: Yup.object().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCar?.name || '',
      reg_no: currentCar?.reg_no || '',
      model: currentCar?.model || '',
      make: currentCar?.make || '',
      color: currentCar?.color || '',
      category: currentCar?.car_category || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCar]
  );

  const methods = useForm({
    resolver: yupResolver(NewCarSchema),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (isEdit && currentCar) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCar]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const carData = {
        name: data.name ? data.name : null,
        reg_no: data.reg_no ? data.reg_no : null,
        model: data.model ? data.model : null,
        make: data.make ? data.make : null,
        color: data.color ? data.color : null,
        category_id: data.category ? data.category.id : null,
      };

      if (!isEdit) {
        handleSubmited(carData);
        reset();
      } else {
        handleSubmited({ carData, id: currentCar.id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {(isEdit && (
        <IconButton sx={{ color: 'primary.main' }} onClick={handleClickOpen}>
          <Iconify icon="material-symbols:edit-square-outline" />
        </IconButton>
      )) || (
        <Button variant="soft" onClick={handleClickOpen}>
          Add Car
        </Button>
      )}
      <Dialog fullWidth open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Car</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="name" label="Name *" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="reg_no" label="Reg No. *" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="model" label="Model " />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="make" label="Make " />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="color" label="Color " />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="category"
                    control={control}
                    // defaultValue={null}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <Autocomplete
                        fullWidth
                        options={categorys || []}
                        // disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        value={value}
                        isOptionEqualToValue={(option, v) => v && option.id === v.id}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} />
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category *"
                            placeholder="Category"
                            error={invalid}
                            helperText={invalid ? error.message : null}
                            id="category"
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
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              {!isEdit ? 'Submit' : 'Update'}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

CreateEditCarDialog.propTypes = {
  Car: PropTypes.object.isRequired,
  Category: PropTypes.object.isRequired,
  getCategory: PropTypes.func.isRequired,
  clrCategoryList: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  currentCar: PropTypes.object,
  handleSubmited: PropTypes.func,
  clrMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Car: state.Car,
  Category: state.Category,
});

export default connect(mapStateToProps, {
  clrMessage: clearMessage,
  getCategory: getCategoryRequest,
  clrCategoryList: clearCategoryList,
})(CreateEditCarDialog);
