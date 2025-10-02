"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CreateForm from "./createForm/createForm";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dbqg53ryr/image/upload/";

const DesignListScreen = () => {
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [open, setOpen] = useState(false);

  // state for selection
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Mobile sidebar state
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClose = () => setOpen(false);

  // Fetch all designs from Firestore
      const fetchDesigns = async () => {
      try {
        const snapshot = await getDocs(collection(db, "design"));
        const result = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          result.push({ id: doc.id, ...data });
        });

        setDesigns(result);
        if (result.length > 0) setSelectedDesign(result[0]); // default selection
        console.log("dddddddddd", result);
      } catch (err) {
        console.error("Error fetching designs:", err);
      }
    };
  useEffect(() => {


    fetchDesigns();
  }, []);

  // toggle selection
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // handle delete confirm
  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteDoc(doc(db, "design", id));
      }
      setDesigns(designs.filter((d) => !selectedIds.includes(d.id)));
      setSelectedIds([]);
      setSelectionMode(false);
      setConfirmOpen(false);
      console.log("✅ Deleted successfully");
      fetchDesigns();
    } catch (err) {
      console.error("❌ Error deleting designs:", err);
    }
  };

  const handleDesignSelect = (design) => {
    setSelectedDesign(design);
    setShowSidebar(false); // Close sidebar on mobile when design is selected
  };

  return (
    <Box className="flex flex-col h-screen bg-black text-gray-200 mt-15">
      {/* ---------- Header ---------- */}
      <Box className="flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-800 bg-black">
        <Box className="flex items-center gap-2 lg:gap-0">
          {/* Hamburger menu for mobile */}
          {/* <IconButton
            onClick={() => setShowSidebar(!showSidebar)}
            sx={{
              display: { xs: "block", lg: "none" },
              color: "#f5f5f5",
              padding: "8px",
            }}
          >
            <MenuIcon />
          </IconButton> */}

          <Typography
            variant="h5"
            fontWeight="bold"
            className="text-white"
            sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}
          >
            Designs Dashboard
          </Typography>
        </Box>

        <div className="flex gap-2">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#111111",
              color: "#f5f5f5",
              border: "1px solid #333",
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" },
              padding: { xs: "6px 12px", sm: "6px 16px" },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "&:hover": { backgroundColor: "#1a1a1a" },
            }}
            onClick={() => {
              if (selectionMode && selectedIds.length > 0) {
                setConfirmOpen(true);
              } else {
                setSelectionMode(!selectionMode);
                setSelectedIds([]);
              }
            }}
          >
            {selectionMode ? "Confirm Delete" : "Delete"}
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#111111",
              color: "#f5f5f5",
              border: "1px solid #333",
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" },
              padding: { xs: "6px 12px", sm: "6px 16px" },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "&:hover": { backgroundColor: "#1a1a1a" },
            }}
            onClick={() => setOpen(true)}
          >
            <span className="hidden sm:inline">+ New</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </Box>

      {/* ---------- 2-Column Layout ---------- */}
      <Box className="flex flex-1 overflow-hidden relative">
        {/* Overlay for mobile when sidebar is open */}
        {showSidebar && (
          <Box
            onClick={() => setShowSidebar(false)}
            sx={{
              display: { xs: "block", lg: "none" },
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 30,
            }}
          />
        )}

        {/* LEFT - Sidebar */}
        <Box
          sx={{
            width: { xs: "280px", sm: "320px", lg: "300px" },
            position: { xs: "fixed", lg: "static" },
            left: 0,
            top: { xs: "57px", lg: "auto" }, // Below header on mobile
            bottom: 0,
            transform: {
              xs: showSidebar ? "translateX(0)" : "translateX(-100%)",
              lg: "translateX(0)",
            },
            transition: "transform 0.3s ease-in-out",
            zIndex: 40,
            borderRight: "1px solid #333",
            backgroundColor: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Mobile: Close button header */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #333",
            }}
          >
            <Typography variant="h6" className="text-white">
              Designs
            </Typography>
            <IconButton
              onClick={() => setShowSidebar(false)}
              sx={{ color: "#f5f5f5", padding: "4px" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Design List */}
          {designs.map((design) => {
            const imageUrl = design.imageFiles?.[0]
              ? `${CLOUDINARY_BASE_URL}${design.imageFiles[0]}.png`
              : "https://via.placeholder.com/50";

            const isSelected = selectedIds.includes(design.id);

            return (
              <Box
                key={design.id}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-900 transition ${
                  isSelected
                    ? "bg-pink-900/30"
                    : selectedDesign?.id === design.id
                    ? "bg-neutral-900"
                    : "hover:bg-neutral-800"
                }`}
                onClick={() =>
                  selectionMode
                    ? toggleSelect(design.id)
                    : handleDesignSelect(design)
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {selectionMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(design.id)}
                    className="accent-pink-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <img
                  src={imageUrl}
                  alt={design.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-700 flex-shrink-0"
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="text-gray-100"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {design.title || "Untitled"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: { xs: "160px", sm: "200px" },
                    }}
                  >
                    {design.description || "No description"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Confirm Delete Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {selectedIds.length} design(s)?
            </Typography>
          </DialogContent>
          <Box className="flex gap-2 p-4 justify-end">
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Dialog>

        {/* RIGHT - Details */}
        <Box
          className="flex-1 p-4 md:p-6 overflow-y-auto bg-black flex flex-col gap-4 md:gap-6"
          sx={{
            marginLeft: { xs: 0, lg: 0 },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          {selectedDesign ? (
            <>
              {/* Back button for mobile */}
              <Button
                startIcon={<ChevronLeftIcon />}
                onClick={() => setShowSidebar(true)}
                sx={{
                  display: { xs: "flex", lg: "none" },
                  color: "#9ca3af",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  marginBottom: 2,
                  "&:hover": { color: "#fff", backgroundColor: "transparent" },
                }}
              >
                View list
              </Button>

              {/* ---------- Top Compact Card ---------- */}
              <Box className="bg-neutral-900 rounded-xl shadow border border-gray-800 p-3 md:p-4 flex flex-col md:flex-row gap-4">
                {/* Left: Hero Image */}
                <Box
                  className="flex-shrink-0 w-full md:w-1/2"
                  sx={{ maxWidth: { xs: "100%", md: "50%" } }}
                >
                  <img
                    src={`${CLOUDINARY_BASE_URL}${selectedDesign.imageFiles?.[0]}.png`}
                    alt={selectedDesign.title}
                    className="w-full rounded-lg border border-gray-700 shadow object-cover"
                    style={{
                      height: "250px",
                      maxHeight: "300px",
                    }}
                  />
                </Box>

                {/* Right: Info */}
                <Box className="flex flex-col justify-start w-full md:w-1/2 gap-2 md:gap-3">
                  <Typography
                    variant="h5"
                    className="text-white font-bold"
                    sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                  >
                    {selectedDesign.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-400"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  >
                    {selectedDesign.createdAt.toDate().toLocaleString()}
                  </Typography>

                  <Typography
                    variant="body2"
                    className="text-gray-400 leading-relaxed overflow-y-auto"
                    sx={{
                      maxHeight: { xs: "80px", md: "120px" },
                      fontSize: { xs: "0.875rem", md: "0.875rem" },
                    }}
                  >
                    {selectedDesign.description || "No description available"}
                  </Typography>

                  {/* Details Grid */}
                  <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-2 text-gray-300">
                    <Box>
                      <Typography
                        className="text-gray-500"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        Category
                      </Typography>
                      <Typography
                        className="text-white font-medium"
                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                      >
                        {selectedDesign.category || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        className="text-gray-500"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        Body Part
                      </Typography>
                      <Typography
                        className="text-white font-medium"
                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                      >
                        {selectedDesign.bodyPart || "-"}
                      </Typography>
                    </Box>
                    <Box className="col-span-2 sm:col-span-1">
                      <Typography
                        className="text-gray-500"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        Measurement
                      </Typography>
                      <Typography
                        className="text-white font-medium"
                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                      >
                        {selectedDesign.measurement || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* ---------- Bottom Card for Charts ---------- */}
              <Box className="bg-neutral-900 rounded-xl shadow border border-gray-800 p-3 md:p-4">
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="bg-black rounded-lg border border-gray-700 h-48 md:h-64 flex items-center justify-center text-gray-500">
                    Chart 1
                  </Box>
                  <Box className="bg-black rounded-lg border border-gray-700 h-48 md:h-64 flex items-center justify-center text-gray-500">
                    Chart 2
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <Typography className="text-gray-500 mt-20 text-center">
              Select a design to view details
            </Typography>
          )}
        </Box>
      </Box>

      {/* ---------- Create Design Popup ---------- */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: "#0d0d0d",
            color: "#f3f4f6",
            border: "1px solid #222",
            margin: { xs: "16px", sm: "32px" },
            maxHeight: { xs: "90vh", sm: "85vh" },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, color: "#e5e7eb" }}>
          Add New Design
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#9ca3af",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#1f1f1f" }}>
          <CreateForm onClose={handleClose} fetchDesigns={fetchDesigns}/>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DesignListScreen;