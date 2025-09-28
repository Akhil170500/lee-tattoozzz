"use client";

import { useEffect, useState } from "react";
import { Card, CardMedia, Typography, Box, TextField, InputAdornment, Container, Fade, Skeleton, Modal, IconButton, Chip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { db } from "../../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dbqg53ryr/image/upload/";

const HeroCard = ({ image, title, onClick, isSeeMore = false }) => {
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "design"));
      const images = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imageFiles && Array.isArray(data.imageFiles)) {
          data.imageFiles.forEach((fileName, idx) => {
            const imageObj = {
              id: `${doc.id}-${idx}`,
              url: `${CLOUDINARY_BASE_URL}${fileName}.png`,
              title: data.title || "Untitled",
              docId: doc.id,
            };
            images.push(imageObj);
          });
        } else {
          console.error("No imageFiles array in this doc.");
        }
      });

      setAllImages(images);
      setFilteredImages(images);
    } catch (err) {
      console.error("Failed to fetch all images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredImages(allImages);
    } else {
      const filtered = allImages.filter(img =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchTerm, allImages]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleImageClick = (img) => {
    setSelectedImage(() => {
      return img;
    });
    
    setModalOpen(() => {
      return true;
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        pt: { xs: 10, sm: 12 }, // Add top padding to account for fixed navbar
        pb: 6
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(45deg, #fff 30%, #ccc 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Design Gallery
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "grey.400",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            Discover stunning designs and creative inspirations from our curated collection
          </Typography>
        </Box>

        {/* Search Section */}
        <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
          <TextField
            placeholder="Search designs..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: 500, md: 600 },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                color: "white",
                borderRadius: 4,
                height: "60px",
                fontSize: "1.1rem",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderWidth: 2,
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2196F3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputBase-input": {
                color: "white",
                padding: "20px 14px",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255, 255, 255, 0.5)",
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 28 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Results Info */}
        {!loading && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "grey.300", fontSize: "1.1rem" }}>
              {searchTerm 
                ? `Found ${filteredImages.length} of ${allImages.length} designs`
                : `${allImages.length} designs available`
              }
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              sx={{ 
                color: "grey.400", 
                textAlign: "center", 
                mb: 4,
                fontSize: "1.1rem"
              }}
            >
              Loading amazing designs...
            </Typography>
            <Box 
              sx={{ 
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                  xl: "repeat(6, 1fr)"
                },
                gap: 3,
              }}
            >
              {[...Array(12)].map((_, index) => (
                <Card key={index} sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                  <Skeleton variant="rectangular" height={200} sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* No Results */}
        {!loading && filteredImages.length === 0 && searchTerm && (
          <Fade in={true}>
            <Box 
              sx={{ 
                textAlign: "center", 
                py: 8,
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <Typography variant="h5" sx={{ color: "grey.300", mb: 2 }}>
                No designs found
              </Typography>
              <Typography variant="body1" sx={{ color: "grey.400" }}>
                Try searching with different keywords for "{searchTerm}"
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Image Gallery */}
        {!loading && filteredImages.length > 0 && (
          <Fade in={true}>
            <Box 
              sx={{ 
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(auto-fill, minmax(250px, 1fr))",
                  sm: "repeat(auto-fill, minmax(280px, 1fr))",
                  md: "repeat(auto-fill, minmax(300px, 1fr))",
                },
                gap: 4,
                mb: 6
              }}
            >
              {filteredImages.map((img, index) => (
                <Fade in={true} timeout={300 + index * 100} key={img.id}>
                  <Card
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageClick(img);
                    }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": { 
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "& .image-overlay": {
                          opacity: 1,
                        }
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", paddingTop: "75%" }}>
                      <CardMedia
                        component="img"
                        image={img.url}
                        alt={img.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        onError={(e) => {
                          console.error("Image failed to load:", img.url);
                          e.target.style.display = "none";
                        }}
                      />
                      <Box
                        className="image-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(156, 39, 176, 0.3))",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                          }}
                        >
                          View Details
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: "white", 
                          fontWeight: 600, 
                          textAlign: "center",
                          fontSize: "1.1rem",
                          textTransform: "capitalize",
                          letterSpacing: "0.5px"
                        }}
                        noWrap
                      >
                        {img.title}
                      </Typography>
                    </Box>
                  </Card>
                </Fade>
              ))}
            </Box>
          </Fade>
        )}

        {/* Professional Modal Popup */}
        {modalOpen && selectedImage && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
            onClick={handleCloseModal}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                borderRadius: 3,
                width: '90vw',
                maxWidth: '1200px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Image Section */}
              <Box
                sx={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  minHeight: { xs: '50vh', md: '70vh' },
                }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  }}
                />
              </Box>

              {/* Details Section */}
              <Box
                sx={{
                  flex: 1,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minWidth: { md: '350px' },
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <Box>
                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 3,
                      textTransform: 'capitalize',
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedImage.title}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label="Creative Design"
                      sx={{
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        color: '#2196F3',
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    <Chip
                      label="Digital Art"
                      sx={{
                        backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        color: '#9C27B0',
                        mr: 1,
                        mb: 1,
                      }}
                    />
                    <Chip
                      label="Premium"
                      sx={{
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        color: '#FFC107',
                        mr: 1,
                        mb: 1,
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'grey.300',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    This stunning design showcases creative excellence and attention to detail. 
                    Perfect for modern applications and creative projects that require high-quality visuals.
                  </Typography>

                  {/* Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
                      <strong>Format:</strong> PNG
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
                      <strong>Category:</strong> {selectedImage.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
                      <strong>ID:</strong> {selectedImage.docId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.400' }}>
                      <strong>Created:</strong> {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box
                    onClick={() => handleDownload(selectedImage.url, selectedImage.title)}
                    sx={{
                      flex: 1,
                      minWidth: '120px',
                      py: 2,
                      px: 3,
                      backgroundColor: '#2196F3',
                      color: 'white',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                    <Typography variant="body2" fontWeight="bold">
                      Download
                    </Typography>
                  </Box>

                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      color: '#F44336',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.3)',
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>

                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.3)',
                      }
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Original single card section (if needed) */}
        {(image || title) && (
          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <Card
              onClick={onClick}
              sx={{
                width: { xs: 300, sm: 350, md: 400 },
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { 
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
                },
              }}
            >
              {isSeeMore ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ 
                      color: "white", 
                      fontWeight: "bold",
                      mb: 2
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      color: "grey.400",
                      fontSize: "1rem"
                    }}
                  >
                    Explore our complete collection
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ position: "relative", paddingTop: "60%" }}>
                    <CardMedia
                      component="img"
                      image={image}
                      alt={title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        color: "white", 
                        fontWeight: 600, 
                        textAlign: "center",
                        fontSize: "1.2rem"
                      }}
                      noWrap
                    >
                      {title}
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HeroCard;