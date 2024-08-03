
"use client";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import React from 'react';
export default function AlertDialog() {


  const [open, setOpen] = useState (false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("useEffect");

  }, []);
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
          <Button onClick={handleClose} sx= {{background: '#1B266B' , color : 'white'}}  autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}