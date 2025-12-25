import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  Star,
  Tag,
  TicketPercent
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    // { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Products', icon: <Package size={20} />, path: '/product' },
    // { label: 'Inventory', icon: <Boxes size={20} />, path: '/inventory' },
    // { label: 'Tracking', icon: <Truck size={20} />, path: '/tracking' },
    { label: 'Category', icon: <Tag size={20} />, path: '/category' },
    // { label: 'Rating & Review', icon: <Star size={20} />, path: '/rating' },
    { label: 'DropDowns', icon: <TicketPercent size={20} />, path: '/dropdowns' },
    { label: 'Inquiries', icon: <Users size={20} />, path: '/users' },
    { label: 'Contact', icon: <LayoutDashboard size={20} />, path: '/contact' },
  ];

  return (
    <Box
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      sx={{
        width: collapsed ? 70 : 240,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#014421',
        color: '#ffffff',
        pt: 8,
        transition: 'width 0.3s',
        borderRight: '1px solid #003f1f',
        overflow: 'hidden',
        zIndex: 1200,
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.label}
              component={Link}
              to={item.path}
              button
              sx={{
                color: isActive ? '#014421' : '#ffffff',
                fontWeight: 'bold',
                bgcolor: isActive ? '#ffffff' : 'transparent',
                '&:hover': {
                  bgcolor: '#ffffff',
                  color: '#014421',
                  '& .MuiListItemIcon-root': {
                    color: '#014421',
                  },
                },
              }}
            >
              <Tooltip title={collapsed ? item.label : ''} placement="right">
                <ListItemIcon
                  sx={{
                    color: isActive ? '#014421' : '#ffffff',
                    minWidth: collapsed ? 40 : 56,
                    margin: '10px 0px',
                    display: 'flex',
                    justifyContent: 'center',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
