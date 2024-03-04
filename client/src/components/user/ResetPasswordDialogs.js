import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { useEffect, useMemo, useState, memo } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// Component
import FormProvider, { RHFTextField } from '../hook-form';
import Iconify from '../iconify';
// action
import { resetPasswordRequest } from '../../actions/users';

// ----------------------------------------------------------------------

const ResetPasswordDialogs = memo(
  ({ Users: { message }, open, handleClose, userId, resetPassword }) => {
    const defaultValues = useMemo(
      () => ({
        newPassword: '',
        confirmPassword: '',
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [open]
    );
    const ResetPasswordSchema = Yup.object().shape({
      newPassword: Yup.string().min(5).required('Password is required'),
      confirmPassword: Yup.string().test(
        'confirmPassword',
        "Confirm-Password don't match with the New-Password.",
        (value) => value === getValues('newPassword')
      ),
    });

    const methods = useForm({
      resolver: yupResolver(ResetPasswordSchema),
      defaultValues,
    });

    const { reset, handleSubmit, getValues } = methods;

    useEffect(() => {
      if (open) {
        reset(defaultValues);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
      if (message) {
        //   if (message === 'Password Reset was Successful!') {
        reset(defaultValues);
        handleClose();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    const onSubmited = async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const userData = {
          new_password: data.newPassword ? data.newPassword : null,
          user_id: userId,
        };

        resetPassword(userData);
        //     reset();
      } catch (error) {
        console.error(error);
      }
    };

    const [showPasswords, setShowPasswords] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
      <Dialog open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmited)}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <RHFTextField
              name="newPassword"
              label="New-Password *"
              type={showPasswords ? 'text' : 'password'}
              sx={{ mb: 2, mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPasswords(!showPasswords)} edge="end">
                      <Iconify icon={showPasswords ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="confirmPassword"
              label="Confirm-Password *"
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              //   loading={isSubmitting}
            >
              Submit
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    );
  }
);
ResetPasswordDialogs.propTypes = {
  Users: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
});

export default connect(mapStateToProps, { resetPassword: resetPasswordRequest })(
  ResetPasswordDialogs
);
