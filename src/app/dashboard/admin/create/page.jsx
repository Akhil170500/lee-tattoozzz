"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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
import CreateForm from "./createForm/createForm";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dbqg53ryr/image/upload/";

const DesignListScreen = () => {
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  // Fetch all designs from Firestore
  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching designs:", err);
      }
    };

    fetchDesigns();
  }, []);

  return (
    <Box className="flex flex-col h-screen bg-black text-gray-200">
      {/* ---------- Header ---------- */}
      <Box className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-black">
        <Typography variant="h5" fontWeight="bold" className="text-white">
          Designs Dashboard
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#111111", // dark button
            color: "#f5f5f5",
            border: "1px solid #333",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1a1a1a" },
          }}
          onClick={() => setOpen(true)}
        >
          + New
        </Button>
      </Box>

      {/* ---------- 2-Column Layout ---------- */}
      <Box className="flex flex-1 overflow-hidden">
        {/* LEFT - 30% List */}
        <Box className="w-1/3 border-r border-gray-800 overflow-y-auto bg-[#0d0d0d]">
          {designs.map((design) => {
            const imageUrl = design.imageFiles?.[0]
              ? `${CLOUDINARY_BASE_URL}${design.imageFiles[0]}.png`
              : "https://via.placeholder.com/50";

            return (
              <Box
                key={design.id}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-900 transition ${
                  selectedDesign?.id === design.id
                    ? "bg-neutral-900"
                    : "hover:bg-neutral-800"
                }`}
                onClick={() => setSelectedDesign(design)}
              >
                <img
                  src={imageUrl}
                  alt={design.title}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="text-gray-100"
                  >
                    {design.title || "Untitled"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500"
                    noWrap
                    sx={{ maxWidth: "180px" }}
                  >
                    {design.description || "No description"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {designs.length === 0 && (
            <Typography className="text-center mt-10 text-gray-600">
              No designs found
            </Typography>
          )}
        </Box>

        {/* RIGHT - 70% Details */}
        <Box className="flex-1 p-6 overflow-y-auto bg-black flex flex-col gap-6">
          {selectedDesign ? (
            <>
              {/* ---------- Top Compact Card ---------- */}
              <Box className="bg-neutral-900 rounded-xl shadow border border-gray-800 p-4 flex flex-col md:flex-row gap-4">
                {/* Left: Hero Image */}
                <Box className="flex-shrink-0 w-full md:w-1/2">
                  <img
                    src={`${CLOUDINARY_BASE_URL}${selectedDesign.imageFiles?.[0]}.png`}
                    alt={selectedDesign.title}
                    className="w-full h-[300px] object-cover rounded-lg border border-gray-700 shadow"
                  />
                </Box>

                {/* Right: Info */}
                <Box className="flex flex-col justify-start w-full md:w-1/2 gap-3">
                  <Typography variant="h5" className="text-white font-bold">
                    {selectedDesign.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    className="text-gray-400 leading-relaxed max-h-[120px] overflow-y-auto"
                  >
                    {selectedDesign.description || "No description available"}
                  </Typography>

                  {/* Details Grid */}
                  <Box className="grid grid-cols-2 gap-4 mt-2 text-gray-300">
                    <Box>
                      <Typography className="text-gray-500 text-sm">
                        Category
                      </Typography>
                      <Typography className="text-white font-medium">
                        {selectedDesign.category || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className="text-gray-500 text-sm">
                        Body Part
                      </Typography>
                      <Typography className="text-white font-medium">
                        {selectedDesign.bodyPart || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className="text-gray-500 text-sm">
                        Measurement
                      </Typography>
                      <Typography className="text-white font-medium">
                        {selectedDesign.measurement || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* ---------- Bottom Black Card for Charts ---------- */}
              <Box className="bg-neutral-900 rounded-xl shadow border border-gray-800 p-4 flex flex-col md:flex-row gap-4">
                {/* Placeholder boxes for 2 charts */}
                <Box className="flex-1 bg-black rounded-lg border border-gray-700 h-64 flex items-center justify-center text-gray-500">
                  Chart 1
                </Box>
                <Box className="flex-1 bg-black rounded-lg border border-gray-700 h-64 flex items-center justify-center text-gray-500">
                  Chart 2
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

      {/* ---------- Popup ---------- */}
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
          <CreateForm onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DesignListScreen;
