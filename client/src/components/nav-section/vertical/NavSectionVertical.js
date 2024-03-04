import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { List, Stack } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------

function NavSectionVertical({ Auth: { user }, data, sx, ...other }) {
  const { translate } = useLocales();

  return (
    <Stack sx={sx} {...other}>
      {data.map((group) => {
        const key = group.subheader || group.items[0].title;

        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader && <StyledSubheader disableSticky>{group.subheader}</StyledSubheader>}

            {group.items.map((list) => (
              <NavList
                user={user}
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChild={!!list.children}
              />
            ))}
          </List>
        );
      })}
    </Stack>
  );
}

NavSectionVertical.propTypes = {
  Auth: PropTypes.object.isRequired,
  sx: PropTypes.object,
  data: PropTypes.array,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(NavSectionVertical);
