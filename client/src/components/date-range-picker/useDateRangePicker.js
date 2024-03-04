import { useState } from 'react';
import {
  // isSameDay,
  //  isSameMonth,
  //   getYear,
  isBefore,
} from 'date-fns';
// // utils
// import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

export default function useDateRangePicker(start, end) {
  const [open, setOpen] = useState(false);

  const [endDate, setEndDate] = useState(end);

  const [startDate, setStartDate] = useState(start);

  const isError =
    (startDate && endDate && isBefore(new Date(endDate), new Date(startDate))) || false;

  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const onChangeEndDate = (newValue) => {
    if (isError) {
      setEndDate(null);
    }
    setEndDate(newValue);
  };

  const onReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onReset,
    //
    isSelected: !!startDate && !!endDate,
    isError,
    //
    setStartDate,
    setEndDate,
  };
}
export const convertUTCToLocalDate = (date) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );
  return date;
};

export const convertLocalToUTCDate = (date) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
  return date;
};
