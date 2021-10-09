import React, { useEffect, useState } from "react";
import {
  Flex,
  Stat, HStack,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import BarChart from "./Charts/BarChart";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

const LSContext = React.createContext({
  stats: {},
  fetchStats: () => {},
  isShown: false,
});

function ProgressHelper({ num_labelled, total }) {
  return (
    <Stat rounded="md" bg="white" borderWidth="1px" borderRadius="lg">
      <StatLabel>Labelling Progress</StatLabel>
      <StatNumber>
        {num_labelled}/{total}
      </StatNumber>
    </Stat>
  );
}

function UncertaintyHelper({ mean, std }) {
  return (
    <Stat rounded="md" bg="white" borderWidth="1px" borderRadius="lg"> 
      <StatLabel>Pool Uncertainty</StatLabel>
      <StatNumber>
        {mean == undefined ? mean : mean.toFixed(3)} ± {std == undefined ? std : std.toFixed(3)}
      </StatNumber>
      <StatHelpText>Using BALD</StatHelpText>
    </Stat>
  );
}

function UncertaintyBarHelper({ uncertainty }) {
  return (
    <Box>
      <BarChart name={"Uncertainty"} y={uncertainty.map(x => x.toFixed(2))} />
    </Box>
  );
}

export default function LabellingStat() {
  const [stats, setStats] = useState({});
  const fetchStats = async () => {
    const response = await fetch("http://0.0.0.0:8000/stats");
    const stats = await response.json();
    setStats(stats.data);
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <LSContext.Provider value={{ stats, fetchStats }}>
      <SimpleGrid bg="gray.50"
        columns={2}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
        color="black.400" borderWidth="1px" borderRadius="lg"
      >
        <ProgressHelper num_labelled={stats.num_labelled} total={stats.total} w="md"/>
        <Popover isLazy>
          <PopoverTrigger>
            <div
              tabIndex="0"
              role="button"
              p={5}
              bg="gray.300"
              children="Click"
              overflow="hidden"
            >
              <UncertaintyHelper
                mean={stats.uncertainty_stats?.mean}
                std={stats.uncertainty_stats?.std}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Uncertainty</PopoverHeader>
            <PopoverBody>
              <UncertaintyBarHelper uncertainty={stats.uncertainty} />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </SimpleGrid>
    </LSContext.Provider>
  );
}
