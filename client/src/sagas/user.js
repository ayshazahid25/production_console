import { takeEvery, call, put, fork, takeLatest, take } from 'redux-saga/effects';
import * as actions from '../actions/user';
import * as authActions from '../actions/auth';
import * as api from '../api/user';
import * as authApi from '../api/auth';
import * as types from '../actions';
import { setSession } from '../auth/utils';
import formatDate from '../utils/formateMonthAndYear';

// ********** GET ALL USERS **********
function* getAllUsers() {
  try {
    yield put(
      actions.setLoading({
        loading: true,
      })
    );

    const result = yield call(api.getAllUsers);
    console.log('clrUsers:', result);
    yield put(
      actions.getAllUsersSuccess({
        users: result.data.users,
      })
    );

    yield put(
      actions.setLoading({
        loading: false,
      })
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.setLoading({
          loading: false,
        })
      );
      yield put(
        actions.userError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetAllUsersRequest() {
  yield takeEvery(types.GET_ALL_USERS_REQUEST, getAllUsers);
}

// ********** GET USER BY ID **********
function* getUserById({ payload }) {
  try {
    yield put(
      actions.setLoading({
        loading: true,
      })
    );

    const result = yield call(api.getUserById, payload);
    yield put(
      actions.getUserByIdSuccess({
        userdetails: result.data.user[0],
      })
    );

    yield put(
      actions.setLoading({
        loading: false,
      })
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.setLoading({
          loading: false,
        })
      );
      yield put(
        actions.userError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetUserByIdRequest() {
  yield takeEvery(types.GET_USER_BY_ID_REQUEST, getUserById);
}

// ********** UPDATE USER DATA **********
function* updateUser({ payload }) {
  try {
    yield put(
      actions.setLoading({
        loading: true,
      })
    );
    const userData = {
      user: payload.user,
    };

    const formData = new FormData(JSON.stringify(userData));

    const response = yield call(api.updateUser, { userId: payload.userId, formData });

    console.log('response::', response);
    yield put(actions.getUserByIdRequest(payload.userId));

    yield put(
      actions.updateUserSuccess({
        message: response.data.message,
      })
    );
    yield put(
      actions.setLoading({
        loading: false,
      })
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.setLoading({
          loading: false,
        })
      );
      yield put(
        actions.userError({
          error: e.message || e,
        })
      );
    }
  }
}

function* watchUpdateUserRequest() {
  yield takeLatest(types.UPDATE_USER_REQUEST, updateUser);
}

function* deleteUser({ userId, is_active, isEdit }) {
  console.log('isEdit::, isEdit', isEdit);
  try {
    const response = yield call(api.deleteUser, { userId, is_active });

    yield put(
      actions.deleteUsersSuccess({
        message: response.data.message,
      })
    );

    if (!isEdit) yield call(getAllUsers);
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.userError({
          error: e.message,
        })
      );
    }
  }
}

function* watchDeleteUserRequest() {
  while (true) {
    const action = yield take(types.DELETE_USER_REQUEST);
    yield call(deleteUser, {
      userId: action.payload.userId,
      is_active: action.payload.is_active,
      isEdit: action.payload.isEdit,
    });
  }
}

// // ********** RECORD CHECK IN OR CHECK OUT **********
// function* recordCheckIns({ payload }) {
//   try {
//     yield put(
//       actions.setLoading({
//         loading: true,
//       })
//     );
//     const response = yield call(api.recordCheckIns, payload.data);

//     yield put(
//       actions.recordCheckInSuccess({
//         message: response.data.message,
//       })
//     );

//     const result = yield call(authApi.getUser);

//     yield put(
//       authActions.getUserSuccess({
//         items: result.data,
//         accessToken: response.data.token,
//       })
//       // isAuthenticated: true,
//     );

//     // Call getReportOfRemainingWorkingHours and getReportOfRemainingWorkingHoursOfMonthByDays after recording check-in/check-out
//     yield call(getReportOfRemainingWorkingHours);

//     const formattedDate = formatDate(new Date());

//     yield put(
//       actions.getReportOfRemainingWorkingHoursOfMonthByDaysRequest({
//         specificMonth: formattedDate,
//       })
//     );

//     yield put(
//       actions.setLoading({
//         loading: false,
//       })
//     );
//   } catch (e) {
//     if (e.message === 'Error: Not authorized, no token') {
//       setSession(null);
//       yield put(authActions.logoutRequest());

//       yield put(
//         authActions.loginError({
//           error: e.message,
//         })
//       );
//     } else {
//       yield put(
//         actions.setLoading({
//           loading: false,
//         })
//       );
//       yield put(
//         actions.reportError({
//           error: e.message || e,
//         })
//       );
//     }
//   }
// }

// function* watchRecordCheckInsRequest() {
//   yield takeLatest(types.RECORD_CHECKINS_RESQUEST, recordCheckIns);
// }

// // ********** GET REPORT OF REMAINING WORKING HOURS **********
// function* getReportOfRemainingWorkingHours() {
//   try {
//     yield put(
//       actions.setLoading({
//         loading: true,
//       })
//     );
//     const result = yield call(api.getReportOfRemainingWorkingHours);

//     yield put(
//       actions.getReportOfRemainingWorkingHoursSuccess({
//         report: result.data,
//       })
//     );
//     yield put(
//       actions.setLoading({
//         loading: false,
//       })
//     );
//   } catch (e) {
//     if (e.message === 'Error: Not authorized, no token') {
//       setSession(null);
//       yield put(authActions.logoutRequest());

//       yield put(
//         authActions.loginError({
//           error: e.message,
//         })
//       );
//     } else {
//       yield put(
//         actions.setLoading({
//           loading: true,
//         })
//       );
//       yield put(
//         actions.reportError({
//           error: e.message,
//         })
//       );
//     }
//   }
// }

// function* watchGetReportOfRemainingWorkingHoursRequest() {
//   yield takeEvery(
//     types.GET_REPORT_OF_REMAINING_WORKING_HOURS_REQUEST,
//     getReportOfRemainingWorkingHours
//   );
// }

// // ********** GET REPORT OF REMAINING WORKING HOURS OF MONTH GROUP BY DAYS **********
// function* getReportOfRemainingWorkingHoursOfMonthByDays({ payload }) {
//   try {
//     const result = yield call(api.getReportOfRemainingWorkingHoursOfMonthByDays, payload.data);

//     yield put(
//       actions.getReportOfRemainingWorkingHoursOfMonthByDaysSuccess({
//         report: result.data.monthlyReport,
//       })
//     );
//   } catch (e) {
//     if (e.message === 'Error: Not authorized, no token') {
//       setSession(null);
//       yield put(authActions.logoutRequest());

//       yield put(
//         authActions.loginError({
//           error: e.message,
//         })
//       );
//     } else {
//       yield put(
//         actions.reportError({
//           error: e.message,
//         })
//       );
//     }
//   }
// }

// function* watchGetReportOfRemainingWorkingHoursOfMonthByDaysRequest() {
//   yield takeEvery(
//     types.GET_REPORT_OF_REMAINING_WORKING_HOURS_OF_MONTH_BY_DAYS_REQUEST,
//     getReportOfRemainingWorkingHoursOfMonthByDays
//   );
// }

const userSagas = [
  fork(watchGetAllUsersRequest),
  fork(watchGetUserByIdRequest),
  fork(watchUpdateUserRequest),
  fork(watchDeleteUserRequest),

  //   fork(watchGetReportOfRemainingWorkingHoursRequest),
  //   fork(watchGetReportOfRemainingWorkingHoursOfMonthByDaysRequest),
];

export default userSagas;
