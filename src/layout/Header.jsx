import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { User } from 'lucide-react';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate()
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    handleMenuClose();
    window.location.reload();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#ffffff',
        color: '#014421', // Royal green for text and icons
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo + Title */}
        <Box display="flex" alignItems="center">
          <img
            src={logo}
            alt="Logo"
            style={{ width: 60, height: 60, marginRight: 10 }}
          />
         
        </Box>

        {/* Right Side */}
        {token ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ color: '#014421' }}>
              <User size={22} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            href="/login"
            sx={{
              color: '#014421',
              border: '1px solid #014421',
              textTransform: 'none',
            }}
            variant="outlined"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
