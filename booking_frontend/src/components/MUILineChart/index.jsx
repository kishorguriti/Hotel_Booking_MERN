import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function SimpleLineChart({
  LineChartData,
  isComparisonEnable,
  getPropertyCountInCity=()=>{},
}) {
  const [propertyCountValues, setPropertyCountValues] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  useEffect(() => {
    if (LineChartData && LineChartData.length > 0) {
      segregateLabelsCountValues(LineChartData);
    }
  }, [LineChartData , isComparisonEnable]);

  const segregateLabelsCountValues = async (lineChartData) => {
    let xLabels = [];
    let propertyCountValues = [];

    lineChartData.forEach((cityData) => {
      let xValues = [];
      let yValues = [];
      cityData.counts.forEach((propertyObj) => {
        xValues.push(propertyObj.label);
        yValues.push(propertyObj.value);
      });
      xLabels.push(xValues);
      propertyCountValues.push(yValues);
    });

    setXLabels(xLabels);
    setPropertyCountValues(propertyCountValues);
  };

  return (
    <LineChart
      width={500}
      height={300}
      series={propertyCountValues.map((values, index) => ({
        data: values,
        label: LineChartData[index]?.city?.toUpperCase(),
      }))}
      xAxis={xLabels.map((labels) => ({ scaleType: "point", data: labels }))}
    />
  );
}
