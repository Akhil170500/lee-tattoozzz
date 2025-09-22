// TransitionsModal.jsx
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2" className='text-black'>
            Sign out
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }} className='text-black'>
            Are you sure you want to log out?
          </Typography>
          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={onClose}>No</Button>
            <Button onClick={onConfirm} color="error" variant="contained">
              Yes
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
