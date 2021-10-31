import React from "react";
import { render } from "react-dom";
import {
  Container,
  Grid,
  Text,
  GridItem,
  ChakraProvider,
  Box,
  Spacer,
} from "@chakra-ui/react";
import { Separator } from "./Components/Separator/Separator";

import Header from "./Components/Header";
import MetricPlot from "./Components/MetricPlot";
import LabellingStats from "./Components/LabellingStat";
import InputTable from "./Components/InputTable";
import theme from "./theme/theme";
import DatasetInfo from "./Components/DatasetInfo";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Spacer p={1} />
      <Grid
        templateRows="repeat(4, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={4} colSpan={1}>
          <DatasetInfo />
        </GridItem>
        <GridItem  colStart={2} colSpan={5} rowSpan={1}>
          <LabellingStats />
        </GridItem>
        <GridItem colStart={2} colSpan={5}>
          <MetricPlot />
        </GridItem>
        <GridItem colStart={2} colSpan={5}>
          <InputTable />
        </GridItem>
        <GridItem colSpan={5}></GridItem>
      </Grid>
    </ChakraProvider>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
