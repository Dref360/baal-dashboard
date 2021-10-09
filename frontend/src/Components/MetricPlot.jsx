import React, {useEffect, useState} from "react";
import LineChart from "./Charts/LineChart"
import {
  Box,
  Stack,
  Text
} from "@chakra-ui/react";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const MetricContext = React.createContext({
  metrics: [], fetchMetrics: () => {}
})

function MetricHelper({name, values}) {
  return (
    <Box>
      <Text>
        {capitalize(name)}
      </Text>
      <LineChart x={values.x} y={values.y.map(yi => yi.toFixed(2))} name={name} />
    </Box>
  
  )}

export default function MetricPlot () {
  const [metrics, setMetrics] = useState([])
  const fetchMetrics = async () => {
    const response = await fetch("http://0.0.0.0:8000/metrics")
    const metrics = await response.json()
    setMetrics(metrics.data)
  }
  useEffect(() => {
    fetchMetrics()
  }, [])


  return (
    <MetricContext.Provider value={{metrics, fetchMetrics}}>
      <Stack spacing={5}>
      {
        Object.keys(metrics).map((met) => (
          <MetricHelper name={met} values={metrics[met]} />
        ))
    }
    </Stack>
    </MetricContext.Provider>
    );
}