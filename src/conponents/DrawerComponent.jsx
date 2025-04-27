import React, { useState, useEffect } from 'react';
import { 
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Import des composants
import DashboardComponent from './Dashbord';
import UserManagement from './User';

const DRAWER_WIDTH = 250;

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '320vh',
  overflow: 'hidden',
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: open ? DRAWER_WIDTH : theme.spacing(7),
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const StyledMain = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: open ? DRAWER_WIDTH : theme.spacing(7),
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(selected && {
    backgroundColor: `${theme.palette.primary.light} !important`,
  }),
}));

const menuItems = [
  { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, component: DashboardComponent },
  { id: 'users', text: 'Users', icon: <PersonIcon />, component: UserManagement },
];

const DrawerComponent = ({ user }) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [userRole, setUserRole] = useState(user?.role || 'USER');

  useEffect(() => {
    setUserRole(user?.role || 'USER');
  }, [user]);

  const handleMenuClick = (id) => {
    setSelectedComponent(id);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const SelectedComponent = menuItems.find(item => item.id === selectedComponent)?.component || DashboardComponent;

  return (
    <StyledContainer>
      <IconButton
        color="primary"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          left: 10,
          top: 10,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: { sm: 'none' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <StyledDrawer variant="permanent" open={isDrawerOpen}>
        <DrawerHeader>
          {isDrawerOpen && (
            <Typography variant="h6">Menu</Typography>
          )}
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <UserSection>
          <Avatar>
            {user?.firstName?.[0] || 'U'}
          </Avatar>
          {isDrawerOpen && (
            <>
              <Typography variant="subtitle1">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.role}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email}
              </Typography>
            </>
          )}
        </UserSection>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <StyledListItem
              button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              selected={selectedComponent === item.id}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isDrawerOpen ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: selectedComponent === item.id ? 600 : 400,
                  },
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </StyledDrawer>

      <StyledMain open={isDrawerOpen}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
          <SelectedComponent />
        </Box>
      </StyledMain>
    </StyledContainer>
  );
};

export default DrawerComponent;