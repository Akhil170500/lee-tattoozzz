"use client";
import { Box, Typography } from "@mui/material";

const UsersPerGraph = ({ usersCreatedAt = [] }) => {
  // Helper: safely convert Firestore Timestamp or string to JS Date
  const toDate = (dob) => {
    if (!dob) return null;
    if (dob?.toDate) return dob.toDate(); // Firestore Timestamp case
    const parsed = new Date(dob);
    return isNaN(parsed) ? null : parsed;
  };

  // Calculate age from a given DOB
  const calculateAge = (dob) => {
    const dateObj = toDate(dob);
    if (!dateObj) return null;

    const ageDifMs = Date.now() - dateObj.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Categorize users by age range
  const categorizeAges = (dobList) => {
    const categories = {
      "<18": 0,
      "18-25": 0,
      "26-35": 0,
      "36-50": 0,
      "50+": 0,
      "NA": 0,
    };

    dobList.forEach((dob) => {
      const age = calculateAge(dob);
      if (age === null || isNaN(age)) {
        categories["NA"]++;
      } else if (age < 18) {
        categories["<18"]++;
      } else if (age <= 25) {
        categories["18-25"]++;
      } else if (age <= 35) {
        categories["26-35"]++;
      } else if (age <= 50) {
        categories["36-50"]++;
      } else {
        categories["50+"]++;
      }
    });

    return categories;
  };

  const ageGroups = categorizeAges(usersDob);

  return (
    <Box className="bg-black rounded-lg border border-gray-700 p-4 text-gray-300">
      <Typography variant="subtitle1" mb={2}>
        User Age Distribution
      </Typography>

      {usersDob.length === 0 ? (
        <Typography>No user data available</Typography>
      ) : (
        <Box className="space-y-2">
          {Object.entries(ageGroups).map(([group, count], index) => (
            <Box
              key={index}
              className="flex justify-between border-b border-gray-800 pb-1"
            >
              <Typography>{group}</Typography>
              <Typography>{count}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UsersPerGraph;
