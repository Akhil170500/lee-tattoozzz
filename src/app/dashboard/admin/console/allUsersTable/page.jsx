"use client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";

const UsersTable = ({ usersTableData = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper: safely convert Firestore Timestamp or string to Date
  const toDate = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue?.toDate) return dateValue.toDate(); // Firestore Timestamp
    const parsed = new Date(dateValue);
    return isNaN(parsed) ? null : parsed;
  };

  // Format date as dd-mm-yyyy
  const formatDateOnly = (dateValue) => {
    const date = toDate(dateValue);
    if (!date) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format full date + time (for createdAt)
  const formatFullDateTime = (dateValue) => {
    const date = toDate(dateValue);
    if (!date) return "N/A";
    return date.toLocaleString();
  };

  // Filtered data based on name (case-insensitive)
  const filteredUsers = usersTableData.filter((user) => {
    if (!user || Object.keys(user).length === 0) return false;
    const name = (user.name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <Box className="bg-black rounded-lg border border-gray-700 p-4 text-gray-300 overflow-x-auto">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
        <Typography variant="subtitle1">Users Table</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#aaa" },
            },
          }}
        />
      </Box>

      {filteredUsers.length === 0 ? (
        <Typography>No user data available</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: "8px",
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#ccc" }}>Name</TableCell>
                <TableCell sx={{ color: "#ccc" }}>Last Name</TableCell>
                <TableCell sx={{ color: "#ccc" }}>Email</TableCell>
                <TableCell sx={{ color: "#ccc" }}>Gender</TableCell>
                <TableCell sx={{ color: "#ccc" }}>User Type</TableCell>
                <TableCell sx={{ color: "#ccc" }}>DOB</TableCell>
                <TableCell sx={{ color: "#ccc" }}>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { backgroundColor: "#222" },
                  }}
                >
                  <TableCell sx={{ color: "#ccc" }}>{user.name || "N/A"}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{user.lastname || "N/A"}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{user.email || "N/A"}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{user.gender || "N/A"}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>
                    {user.admin ? "Admin" : "User"}
                  </TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{formatDateOnly(user.dob)}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>
                    {formatFullDateTime(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UsersTable;
