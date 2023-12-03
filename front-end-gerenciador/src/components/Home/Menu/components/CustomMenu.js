import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';

const CustomMenu = ({ userData, seletorDeComponente,handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSettingsClick = () => {
    seletorDeComponente(8);
    handleClose();
  };

  const onLogoutClick = () => {
    handleLogout();
    handleClose();
  };

  return (
    <div>
      <div onClick={handleOpen} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Avatar>{userData.nome.charAt(0).toUpperCase()}</Avatar>
        <Typography sx={{ marginLeft: 1 }}>{userData.nome}</Typography>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <Typography>{userData.nome}</Typography>
        </MenuItem>
        <MenuItem onClick={onSettingsClick}>
          <SettingsIcon /> Configurações
        </MenuItem>
        <MenuItem onClick={onLogoutClick}>
          <LogoutIcon /> Deslogar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CustomMenu;
