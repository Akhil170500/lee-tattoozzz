"use client";
import { Box, Typography } from "@mui/material";

const adminMetrics = [
  { title: "Users by Age", type: "pie" },
  { title: "Users by Gender", type: "pie" },
  { title: "Total Designs", type: "bar" },
  { title: "Designs by Category", type: "bar" },
  { title: "Designs by Body Part", type: "bar" },
  { title: "Active Users", type: "line" },
  { title: "New Registrations", type: "line" },
  { title: "Design Uploads", type: "line" },
];

const Console = () => {
  return (
    <Box className="p-4 bg-black min-h-screen text-white">
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Admin Dashboard
      </Typography>

      {/* Responsive Dashboard Grid */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {adminMetrics.map((metric, idx) => (
          <Box
            key={idx}
            className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3 flex flex-col"
          >
            {/* Card Title */}
            <Typography
              variant="subtitle1"
              className="text-white font-semibold mb-2"
            >
              {metric.title}
            </Typography>

            {/* Chart Placeholder */}
            <Box
              className={`flex-1 rounded-lg border border-gray-700 bg-black flex items-center justify-center text-gray-500`}
              style={{ minHeight: metric.type === "pie" ? "250px" : "300px" }}
            >
              {metric.type.toUpperCase()} Chart
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Console;
