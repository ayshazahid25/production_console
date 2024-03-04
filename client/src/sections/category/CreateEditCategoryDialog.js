import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';
import { clearError, clearMessage } from '../../actions/category';
// ----------------------------------------------------------------------

function CreateEditCategoryDialog({
  Category: { message, error },
  isEdit = false,
  currentCategory,
  handleSubmited,
  clrError,
  clrMessage,
}) {
  const [open, setOpen] = useState(false);
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
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      handleClose();
      clrError();
    }

    // eslint-disable-next-line
  }, [message, error]);

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCategory]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const categoryData = {
        name: data.name ? data.name : null,
      };

      if (!isEdit) {
        handleSubmited(categoryData);
        reset();
      } else {
        categoryData.id = currentCategory.id;
        handleSubmited(categoryData);
      }
    } catch (err) {
      console.error(err);
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
          Add Category
        </Button>
      )}
      <Dialog fullWidth open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <RHFTextField name="name" label="Name *" />
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

CreateEditCategoryDialog.propTypes = {
  Category: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  handleSubmited: PropTypes.func,
  clrMessage: PropTypes.func,
  clrError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Category: state.Category,
});

export default connect(mapStateToProps, {
  clrError: clearError,
  clrMessage: clearMessage,
})(CreateEditCategoryDialog);
