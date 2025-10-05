"use client";
import { Box, Typography } from "@mui/material";
import ReactECharts from "echarts-for-react";

const FeedbackChart = ({ feedbackCount = [] }) => {
  // Count how many users gave each rating (1–5)
  const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
    name: `${rating} star`,
    value: feedbackCount.filter((r) => r === rating).length,
  }));

  const chartOptions = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} users ({d}%)",
    },
    legend: {
      bottom: "0%",
      textStyle: { color: "#ccc" },
    },
    series: [
      {
        name: "Ratings",
        type: "pie",
        radius: ["40%", "70%"], // donut style
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#000",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{c}",
          color: "#ccc",
        },
        labelLine: {
          show: true,
          lineStyle: { color: "#666" },
        },
        data: ratingData,
      },
    ],
  };

  return (
    <Box className="bg-black rounded-lg border border-gray-700 p-4 text-gray-300">
      {/* <Typography variant="subtitle1" mb={2}>
        Feedback Rating Distribution
      </Typography> */}

      {feedbackCount.length === 0 ? (
        <Typography>No feedback data available</Typography>
      ) : (
        <ReactECharts
          option={chartOptions}
          style={{ height: "320px", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
        />
      )}
    </Box>
  );
};

export default FeedbackChart;
