
"use client";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";

export default function AlertDialog  () {

  const socket = useContext (SocketContext);
  const user = useContext(UserDataContext);
  const [open, setOpen] = useState (false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    
    setOpen(false);
  };

  const handleave = () => {
    socket?.emit("LeaveGame",   { clientid : user?.id });
    setOpen(false);
  };




  return (
    
    <React.Fragment>
      <Button variant="outlined"  className='font-lalezar  text-[12px] px-7  py-1.5  md:text-lg md:px-10  md:py-2.5  mt-[20px] md:mt-[0]' onClick={handleClickOpen}>
        exit
      </Button>
      <Dialog
        open={open}
        
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"  sx= {
            {
                background: '#1B266B',
                 color : 'white'
            }

        }>
          {"Are you sure you to leave the game?"}
        </DialogTitle>
        <DialogContent  sx= {{background: '#1B266B' , color : 'white'}}>
          <DialogContentText id="alert-dialog-description" sx= {{background: '#1B266B' , color : 'white' , font : 'Lalezar'}} >
            If you leave the game, you will lose 
          </DialogContentText>
        </DialogContent>
        <DialogActions  sx= {{background: '#1B266B' , color : 'white'}}>
          <Button onClick={handleClose} sx= {{background: '#1B266B' , color : 'white'}}>Disagree</Button>
          <Button onClick={handleave} sx= {{background: '#1B266B' , color : 'white'}}  autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}