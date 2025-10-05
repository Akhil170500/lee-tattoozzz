"use client";
import { useState } from "react";
import { db } from "../../../../../../firebase.config";
import { addDoc, collection, setDoc } from "firebase/firestore";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const CreateCatDropdown = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Please fill in all fields and select files");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = await addDoc(collection(db, "categories"), {
        title,
        description,
        createdAt: new Date(),
      });

      // reset form
      setTitle("");
      setDescription("");

      if (onClose) onClose(); // close popup after save
    } catch (err) {
      console.error(err);
      setError("Failed to save or upload files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      elevation={8}
      sx={{ 
        // maxWidth: 600, 
        mx: 'auto',
        backgroundColor: '#171717', // neutral-900
        borderRadius: 3,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: '#ffffff',
            textAlign: 'center',
            mb: 3
          }}
        >
          Create New Category
        </Typography>

        <Divider sx={{ mb: 3, borderColor: '#404040' }} />

        <form onSubmit={handleSubmit}>
          {error && (
            <Box 
              sx={{ 
                p: 2, 
                mb: 3, 
                backgroundColor: '#ffebee', 
                borderRadius: 2,
                border: '1px solid #f44336'
              }}
            >
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}

                    <Box sx={{ mb: 3 }}>
            <TextField
              name="description"
              label="Category"
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiInput-root': {
                  color: '#ffffff',
                  '&:before': {
                    borderBottomColor: '#404040',
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottomColor: '#ffffff',
                  },
                  '&:after': {
                    borderBottomColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              name="title"
              label="Category Code"
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiInput-root': {
                  color: '#ffffff',
                  '&:before': {
                    borderBottomColor: '#404040',
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottomColor: '#ffffff',
                  },
                  '&:after': {
                    borderBottomColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {onClose && (
              <Button
                onClick={onClose}
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderColor: '#404040',
                  color: '#cccccc',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#000000',
                  },
                }}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: loading 
                  ? '#cccccc' 
                  : 'linear-gradient(45deg, #4caf50, #66bb6a)',
                '&:hover': !loading ? {
                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                } : {},
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? "Saving" : "Save"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCatDropdown;