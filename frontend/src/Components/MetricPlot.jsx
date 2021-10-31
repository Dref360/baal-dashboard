import React, { useEffect, useState } from "react";
import LineChart from "./Charts/LineChart";
import {
  Box,
  Divider,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const MetricContext = React.createContext({
  metrics: [],
  fetchMetrics: () => {},
});

function MetricHelper({ name, values }) {
  return (
    <div>
      <Text>{capitalize(name)}</Text>
      <LineChart
        x={values.x}
        y={values.y.map((yi) => yi.toFixed(2))}
        name={name}
        xlabel="Dataset size"
      />
    </div>
  );
}

export default function MetricPlot() {
  const [metrics, setMetrics] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://0.0.0.0:8000/metrics")
      .then((res) => res.json())
      .then(
        (metrics) => {
          setMetrics(metrics);
          setIsLoaded(true);
        },
        (error) => {
          console.log("Can't fetch stats");
          setIsLoaded(false);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <MetricContext.Provider value={{ metrics }}>
        <Text align="left" mb="1px" style={{ fontWeight: "bold" }}>
          Metrics
        </Text>
        <SimpleGrid columns={3} spacing={10}>
          {Object.keys(metrics).map((met) => (
            <MetricHelper name={met} values={metrics[met]} />
          ))}
        </SimpleGrid>
      </MetricContext.Provider>
    );
  }
}
