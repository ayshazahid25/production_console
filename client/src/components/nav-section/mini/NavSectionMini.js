import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Box, Stack } from '@mui/material';
//
import NavList from './NavList';

// ----------------------------------------------------------------------

function NavSectionMini({ Auth: { user }, data, sx, ...other }) {
  return (
    <Stack
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 0.75,
        ...sx,
      }}
      {...other}
    >
      {data.map((group, index) => (
        <Items
          user={user}
          key={group.subheader}
          items={group.items}
          isLastGroup={index + 1 === data.length}
        />
      ))}
    </Stack>
  );
}

NavSectionMini.propTypes = {
  Auth: PropTypes.object.isRequired,
  sx: PropTypes.object,
  data: PropTypes.array,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(memo(NavSectionMini));

// ----------------------------------------------------------------------

Items.propTypes = {
  items: PropTypes.array,
  isLastGroup: PropTypes.bool,
  user: PropTypes.object,
};

function Items({ user, items, isLastGroup }) {
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

      {!isLastGroup && (
        <Box
          sx={{
            width: 24,
            height: '1px',
            bgcolor: 'divider',
            my: '8px !important',
          }}
        />
      )}
    </>
  );
}
