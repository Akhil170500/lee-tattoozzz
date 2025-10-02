"use client";
import { useState } from "react";
import { db } from "../../../../../firebase.config";
import { addDoc, collection, setDoc } from "firebase/firestore";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateForm = ({ onClose, fetchDesigns }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [bodyPart, setBodyPart] = useState("");

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const measurement = width && height ? `${width} x ${height}` : "";

    if (!title || !category || files.length === 0) {
      setError("Please fill in all fields and select files");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = await addDoc(collection(db, "design"), {
        title,
        category,
        description,
        measurement,
        bodyPart,
        createdAt: new Date(),
      });

      await setDoc(docRef, { design_id: docRef.id }, { merge: true });

      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "lee-tattoozzz_upload");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dbqg53ryr/image/upload",
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.public_id);
        }
      }

      await setDoc(docRef, { imageFiles: uploadedUrls }, { merge: true });

      // reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setWidth("");
      setHeight("");
      setBodyPart("");
      setFiles([]);
      await fetchDesigns();

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
          Create New Design
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
              name="title"
              label="Title"
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

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel 
                id="category-label"
                sx={{ 
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                }}
              >
                Category *
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                sx={{
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
                  '& .MuiSvgIcon-root': {
                    color: '#ffffff',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#262626',
                      '& .MuiMenuItem-root': {
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#404040',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                <MenuItem value="B">Band</MenuItem>
                <MenuItem value="P">Portrait</MenuItem>
                <MenuItem value="T">Text</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" fullWidth>
              <InputLabel 
                id="body_part-label"
                sx={{ 
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                }}
              >
                Body Part
              </InputLabel>
              <Select
                labelId="body_part-label"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                sx={{
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
                  '& .MuiSvgIcon-root': {
                    color: '#ffffff',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#262626',
                      '& .MuiMenuItem-root': {
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#404040',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Body Part</em>
                </MenuItem>
                <MenuItem value="Arm">Arm</MenuItem>
                <MenuItem value="Chest">Chest</MenuItem>
                <MenuItem value="Back">Back</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              name="description"
              label="Description"
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <TextField
              label="Width"
              variant="standard"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
              inputProps={{ step: "0.1" }}
              fullWidth
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
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#cccccc', 
                mx: 1,
                minWidth: '20px',
                textAlign: 'center'
              }}
            >
              ×
            </Typography>
            <TextField
              label="Height"
              variant="standard"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              inputProps={{ step: "0.1" }}
              fullWidth
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
            <Button
              component="label"
              startIcon={<CloudUploadIcon />}
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: '#262626',
                border: '2px dashed #404040',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#404040',
                  borderColor: '#1976d2',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Select Files
              <input 
                type="file" 
                hidden 
                multiple 
                accept="image/*"
                onChange={handleFileSelect} 
              />
            </Button>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: '#cccccc',
                textAlign: 'center'
              }}
            >
              Select multiple images for your design
            </Typography>
          </Box>

          {files.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2, 
                  color: '#ffffff',
                  fontWeight: 600
                }}
              >
                Selected Files ({files.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {files.map((file, index) => (
                  <Chip
                    key={index}
                    icon={<AttachFileIcon />}
                    label={file.name}
                    onDelete={() => removeFile(index)}
                    deleteIcon={<DeleteIcon />}
                    variant="outlined"
                    sx={{
                      maxWidth: '200px',
                      backgroundColor: '#262626',
                      borderColor: '#404040',
                      '& .MuiChip-label': {
                        color: '#ffffff',
                      },
                      '& .MuiChip-icon': {
                        color: '#cccccc',
                      },
                      '& .MuiChip-deleteIcon': {
                        color: '#f44336',
                        '&:hover': {
                          color: '#d32f2f',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

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

export default CreateForm;