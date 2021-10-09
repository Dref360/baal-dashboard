import React, { useEffect, useState } from "react";
import {
  Flex,
  Stat,
  HStack,
  StatLabel,
  StatNumber,
  StatHelpText,
  Image,
  SimpleGrid,
  Box,
  Img,
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

const InputContext = React.createContext({
  stats: [],
  fetchStats: () => [],
});

function InputHelper({ idx }) {
  return (
    <Image
      borderRadius="full"
      src={"http://0.0.0.0:8000/input/" + idx}
      alt="BaaL Logo"
      maxW="100px"
    />
  );
}

export default function LabellingStat() {
  const [stats, setStats] = useState([]);
  const fetchStats = async () => {
    const response = await fetch("http://0.0.0.0:8000/most_uncertains");
    const stats = await response.json();
    setStats(stats.data);
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <InputContext.Provider value={{ stats, fetchStats }}>
      <SimpleGrid
        bg="gray.50"
        columns={5}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
        color="black.400"
        borderWidth="1px"
        borderRadius="lg"
      >
        {stats.map((idx) => (
          <InputHelper idx={idx} />
        ))}
      </SimpleGrid>
    </InputContext.Provider>
  );
}
