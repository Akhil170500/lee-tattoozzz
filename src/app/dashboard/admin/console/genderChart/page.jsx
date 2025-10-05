"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase.config";
import { collection, getDocs, query, where, getCountFromServer } from "firebase/firestore";
import ReactECharts from "echarts-for-react";
import { Box, Typography } from "@mui/material";

const GenderChart = () => {
  const [genderCount, setGenderCount] = useState({ Male: 0, Female: 0, NA: 0 });
  const usersRef = collection(db, "users");

  const getGenderData = async () => {
    try {
      const counts = { Male: 0, Female: 0, NA: 0 };
      const maleSnap = await getCountFromServer(query(usersRef, where("gender", "==", "M")));
      counts.Male = maleSnap.data().count;
      const femaleSnap = await getCountFromServer(query(usersRef, where("gender", "==", "F")));
      counts.Female = femaleSnap.data().count;
      const allUsers = await getDocs(usersRef);
      counts.NA = allUsers.size - (counts.Male + counts.Female);
      setGenderCount(counts);
    } catch (err) {
      console.error("Error fetching gender data:", err);
    }
  };

  useEffect(() => { getGenderData(); }, []);

  const genderData = [
    { name: "Male", value: genderCount.Male },
    { name: "Female", value: genderCount.Female },
    { name: "NA", value: genderCount.NA },
  ];

  const genderPieOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", formatter: "{b}: {c} users ({d}%)" },
    legend: {
      bottom: "0%",
      textStyle: { color: "#ccc" },
    },
    series: [
      {
        name: "Gender",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#000", borderWidth: 2 },
        label: { show: true, formatter: "{b}\n{c}", color: "#ccc" },
        labelLine: { show: true, lineStyle: { color: "#666" } },
        data: genderData,
      },
    ],
  };

  return (
    <Box className="bg-black rounded-lg border border-gray-700 p-4 text-gray-300">
      {/* <Typography variant="subtitle1" mb={2}>
        Gender Distribution
      </Typography> */}
      <ReactECharts option={genderPieOptions} style={{ height: "320px", width: "100%" }} />
    </Box>
  );
};

export default GenderChart;
