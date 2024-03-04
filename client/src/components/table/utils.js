// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  const splitOrderBY = orderBy.split('.');

  if (splitOrderBY.length === 2) {
    if (
      (b[splitOrderBY[0]] ? b[splitOrderBY[0]][splitOrderBY[1]] : null) <
      (a[splitOrderBY[0]] ? a[splitOrderBY[0]][splitOrderBY[1]] : null)
    ) {
      return -1;
    }

    if (
      (b[splitOrderBY[0]] ? b[splitOrderBY[0]][splitOrderBY[1]] : null) >
      (a[splitOrderBY[0]] ? a[splitOrderBY[0]][splitOrderBY[1]] : null)
    ) {
      return 1;
    }
  } else {
    if (b[splitOrderBY[0]] < a[splitOrderBY[0]]) {
      return -1;
    }
    if (b[splitOrderBY[0]] > a[splitOrderBY[0]]) {
      return 1;
    }
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
