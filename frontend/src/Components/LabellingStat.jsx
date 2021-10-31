import React, { useEffect, useState } from "react";
import {
  Stat,
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
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";

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
      <StatLabel>
        Pool Uncertainty <InfoOutlineIcon w={4} h={4} />
      </StatLabel>
      <StatNumber>
        {mean == undefined ? mean : mean.toFixed(3)} ±{" "}
        {std == undefined ? std : std.toFixed(3)}
      </StatNumber>
      <StatHelpText>Using BALD</StatHelpText>
    </Stat>
  );
}

function UncertaintyBarHelper({ uncertainty }) {
  return (
    <Box>
      <BarChart name={"Uncertainty"} y={uncertainty.map((x) => x.toFixed(2))} />
    </Box>
  );
}

export default function LabellingStat() {
  const [stats, setStats] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://0.0.0.0:8000/stats")
      .then((res) => res.json())
      .then(
        (stats) => {
          setStats(stats);
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
      <LSContext.Provider value={{ stats }}>
        <SimpleGrid
          bg="gray.50"
          columns={2}
          spacing="8"
          p="10"
          textAlign="center"
          rounded="lg"
          color="black.400"
          borderWidth="1px"
          borderRadius="lg"
        >
          <ProgressHelper
            num_labelled={stats.num_labelled}
            total={stats.total}
            w="md"
          />
          <Popover>
            <PopoverTrigger>
              <div
                tabIndex="0"
                role="button"
                p={5}
                bg="gray.300"
                children="Click"
              >
                <UncertaintyHelper
                  mean={stats?.uncertainty_stats?.mean}
                  std={stats?.uncertainty_stats?.std}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Uncertainty</PopoverHeader>
              <PopoverBody>
                <UncertaintyBarHelper uncertainty={stats?.uncertainty} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </SimpleGrid>
      </LSContext.Provider>
    );
  }
}
