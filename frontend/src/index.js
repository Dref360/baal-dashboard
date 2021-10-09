import React from "react";
import { render } from 'react-dom';
import { Container, Grid, Text, GridItem, ChakraProvider, Box, Spacer} from "@chakra-ui/react"
import { Separator } from "./Components/Separator/Separator"

import Header from "./Components/Header";
import MetricPlot from "./Components/MetricPlot";
import LabellingStats from "./Components/LabellingStat"
import InputTable from "./Components/InputTable"
import theme from "./theme/theme";


function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Spacer p={1}/>
      <Grid
        templateRows="repeat(4, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={2} colSpan={1}>
          <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Text align="center" mb="1px">
              Metrics
            </Text>
            <Separator/>
            <MetricPlot/>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <LabellingStats />
        </GridItem>
        <GridItem colSpan={3} bg="papayawhip" />
        <GridItem colSpan={5}>
          <InputTable />
        </GridItem>
      </Grid>
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
