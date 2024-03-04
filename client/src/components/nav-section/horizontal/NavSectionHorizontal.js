import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
// utils
import { hideScrollbarY } from '../../../utils/cssStyles';
//
import NavList from './NavList';

// ----------------------------------------------------------------------

function NavSectionHorizontal({ Auth: { user }, data, sx, ...other }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mx: 'auto',
        ...hideScrollbarY,
        ...sx,
      }}
      {...other}
    >
      {data.map((group) => (
        <Items user={user} key={group.subheader} items={group.items} />
      ))}
    </Stack>
  );
}

NavSectionHorizontal.propTypes = {
  Auth: PropTypes.object.isRequired,
  sx: PropTypes.object,
  data: PropTypes.array,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(memo(NavSectionHorizontal));

// ----------------------------------------------------------------------

Items.propTypes = {
  items: PropTypes.array,
  user: PropTypes.object,
};

function Items({ user, items }) {
  return (
    <>
      {items.map((list) => (
        <NavList
          user={user}
          key={list.title + list.path}
          data={list}
          depth={1}
          hasChild={!!list.children}
        />
      ))}
    </>
  );
}
