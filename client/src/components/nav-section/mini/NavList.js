import PropTypes from 'prop-types';

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import { StyledPopover } from './styles';
import NavItem from './NavItem';

// ----------------------------------------------------------------------

function NavList({ user, data, depth, hasChild }) {
  const navRef = useRef(null);

  const { pathname } = useLocation();

  const { active, isExternalLink } = useActiveLink(data.path);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const appBarEl = Array.from(document.querySelectorAll('.MuiAppBar-root'));

    // Reset styles when hover
    const styles = () => {
      document.body.style.overflow = '';
      document.body.style.padding = '';
      // Apply for Window
      appBarEl.forEach((elem) => {
        elem.style.padding = '';
      });
    };

    if (open) {
      styles();
    } else {
      styles();
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavItem
        ref={navRef}
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={isExternalLink}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      />
      {hasChild && (
        <StyledPopover
          open={open}
          anchorEl={navRef.current}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          <NavSubList user={user} data={data.children} depth={depth} />
        </StyledPopover>
      )}
    </>
  );
}

NavList.propTypes = {
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
  user: PropTypes.object,
};

export default NavList;

// ----------------------------------------------------------------------

NavSubList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.array,
  depth: PropTypes.number,
};

function NavSubList({ user, data, depth }) {
  return (
    <>
      {data.map((list) => (
        <NavList
          user={user}
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
        />
      ))}
    </>
  );
}
