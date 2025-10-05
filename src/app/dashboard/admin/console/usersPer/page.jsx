"use client";
import { useState, useEffect } from "react";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import ReactECharts from "echarts-for-react";

const UsersPerGraph = ({ usersCreatedAt = [] }) => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [yearOptions, setYearOptions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [multiYearData, setMultiYearData] = useState([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const toDate = (ts) => {
    if (!ts) return null;
    if (ts?.toDate) return ts.toDate();
    const parsed = new Date(ts);
    return isNaN(parsed) ? null : parsed;
  };

  // Prepare data
  useEffect(() => {
    if (!usersCreatedAt || usersCreatedAt.length === 0) return;

    const dateObjs = usersCreatedAt.map(toDate).filter(Boolean);

    // Extract years
    const yearsSet = new Set(dateObjs.map((d) => d.getFullYear()));
    const years = Array.from(yearsSet).sort((a, b) => b - a);
    setYearOptions(years);

    // Monthly data for selected year
    const countsForSelectedYear = months.map((_, idx) => 
      dateObjs.filter((d) => {
        const yearMatch = selectedYear === "all" ? true : d.getFullYear() === Number(selectedYear);
        return d.getMonth() === idx && yearMatch;
      }).length
    );
    setMonthlyData(countsForSelectedYear);

    // Multi-year monthly comparison
    const multiData = years.map((year) => {
      const data = months.map((_, idx) =>
        dateObjs.filter((d) => d.getFullYear() === year && d.getMonth() === idx).length
      );
      return { year, data };
    });
    setMultiYearData(multiData);

  }, [usersCreatedAt, selectedYear]);

  const handleYearChange = (e) => setSelectedYear(e.target.value);

  // Chart options for monthly single-year
  const lineOptions = (data, name) => ({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    series: [
      {
        data,
        type: "line",
        smooth: true,
        name,
        lineStyle: { width: 2 },
      },
    ],
    legend: { textStyle: { color: "#fff" } },
    grid: { left: "10%", right: "10%", bottom: "15%" },
  });

  // Chart options for multi-year monthly comparison
  const multiLineOptions = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    series: multiYearData.map((item, idx) => ({
      name: item.year.toString(),
      data: item.data,
      type: "line",
      smooth: true,
      lineStyle: { width: 2 },
    })),
    legend: { data: multiYearData.map((item) => item.year.toString()), textStyle: { color: "#fff" } },
    grid: { left: "10%", right: "10%", bottom: "15%" },
  };

  // ---------- Yearly Totals Chart ----------
  const yearCounts = {};
  usersCreatedAt.forEach((ts) => {
    const date = toDate(ts);
    if (!date) return;
    const year = date.getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  const yearsSorted = Object.keys(yearCounts).sort((a,b)=>a-b);
  const countsSorted = yearsSorted.map(y=>yearCounts[y]);

  const yearlyLineOptions = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: yearsSorted,
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#fff" },
      axisLine: { lineStyle: { color: "#fff" } },
    },
    series: [
      { data: countsSorted, type: "line", smooth: true, lineStyle:{width:2, color:"#4f46e5"} }
    ],
    grid: { left:"10%", right:"10%", bottom:"15%" },
  };

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Monthly Chart */}
      <Box className="bg-black rounded-lg border border-gray-700 p-4">
        <div className="flex justify-between">
          <Typography variant="subtitle1" mb={2} className="text-white font-semibold">
          Users Joined Per Month
        </Typography>
                {yearOptions.length > 0 && (
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            size="small"
            sx={{ color: "white", borderColor: "gray", ".MuiSvgIcon-root": { color: "white" } }}
          >
            <MenuItem value="all">All Years</MenuItem>
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        )}
        </div>

        {/* {yearOptions.length > 0 && (
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            className="mb-4"
            size="small"
            sx={{ color: "white", borderColor: "gray", ".MuiSvgIcon-root": { color: "white" } }}
          >
            <MenuItem value="all">All Years</MenuItem>
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        )} */}

        <ReactECharts option={lineOptions(monthlyData, selectedYear)} style={{ height: "300px", width: "100%" }} />
      </Box>

      {/* Yearly Totals Line Chart */}
      <Box className="bg-black rounded-lg border border-gray-700 p-4">
        <Typography variant="subtitle1" mb={2} className="text-white font-semibold">
          Users Joined Per Year
        </Typography>

        <ReactECharts option={yearlyLineOptions} style={{ height: "300px", width: "100%" }} />
      </Box>
    </Box>
  );
};

export default UsersPerGraph;
