"use client";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Console from "./console/page";
import Create from "./create/page";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [alignment, setAlignment] = useState("console");

  const name = useSelector((state) => state.auth.user?.name || "");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <div className="flex items-center display-hiden">
        <h6>{name}</h6>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          className="bg-white"
          size="small"
        >
          <ToggleButton value="console">Console</ToggleButton>
          <ToggleButton value="add">Add New</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {alignment === "console" ? (
        <Console/>
      ) : (
        <Create/>
      )}


    </div>
  );
};

export default Dashboard;
