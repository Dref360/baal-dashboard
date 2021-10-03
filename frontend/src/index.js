import React from "react";
import { render } from 'react-dom';
import { Container, Grid, Text, GridItem, ChakraProvider, Box} from "@chakra-ui/react"
import { Separator } from "./Components/Separator/Separator"

import Header from "./Components/Header";
import MetricPlot from "./Components/MetricPlot";
import LabellingStats from "./Components/LabellingStat"
import theme from "./theme/theme";


function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Grid
        h="200px"
        templateRows="repeat(5, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={2} colSpan={1}>
          <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Text align="center" mb="20px">
            Metrics
          </Text>
          <Separator/>
          <MetricPlot/>
          </Box>
        </GridItem>
        <GridItem colSpan={2} bg="papayawhip">
          <LabellingStats />
        </GridItem>
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={4} bg="tomato" />
      </Grid>
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
