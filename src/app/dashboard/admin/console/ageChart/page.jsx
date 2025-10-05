"use client";
import { Box, Typography } from "@mui/material";
import ReactECharts from "echarts-for-react";

const AgeChart = ({ usersDob = [] }) => {
  const toDate = (dob) => {
    if (!dob) return null;
    if (dob?.toDate) return dob.toDate();
    const parsed = new Date(dob);
    return isNaN(parsed) ? null : parsed;
  };

  const calculateAge = (dob) => {
    const dateObj = toDate(dob);
    if (!dateObj) return null;
    const ageDifMs = Date.now() - dateObj.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const categorizeAges = (dobList) => {
    const categories = { "<18": 0, "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0, "NA": 0 };
    dobList.forEach((dob) => {
      const age = calculateAge(dob);
      if (age === null || isNaN(age)) categories["NA"]++;
      else if (age < 18) categories["<18"]++;
      else if (age <= 25) categories["18-25"]++;
      else if (age <= 35) categories["26-35"]++;
      else if (age <= 50) categories["36-50"]++;
      else categories["50+"]++;
    });
    return categories;
  };

  const ageGroups = categorizeAges(usersDob);
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

  const pieOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      bottom: "0%",
      textStyle: { color: "#ccc" },
    },
    series: [
      {
        name: "Ages",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#000", borderWidth: 2 },
        label: { show: true, formatter: "{b}\n{c}", color: "#ccc" },
        labelLine: { show: true, lineStyle: { color: "#666" } },
        data: ageData,
      },
    ],
  };

  return (
    <Box className="bg-black rounded-lg border border-gray-700 p-4 text-gray-300">
      {/* <Typography variant="subtitle1" mb={2}>
        User Age Distribution
      </Typography> */}
      {usersDob.length === 0 ? (
        <Typography>No user data available</Typography>
      ) : (
        <ReactECharts option={pieOptions} style={{ height: "320px", width: "100%" }} />
      )}
    </Box>
  );
};

export default AgeChart;
