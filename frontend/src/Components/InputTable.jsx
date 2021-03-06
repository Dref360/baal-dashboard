import React, { useEffect, useState } from "react";
import { Image, Text, Box, SimpleGrid } from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

const InputContext = React.createContext({
  stats: [],
  fetchStats: () => [],
});

function InputHelper({ idx, item }) {
  const [infos, setInfo] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://0.0.0.0:8000/pool/item/" + idx + "/info")
      .then((res) => res.json())
      .then(
        (stats) => {
          setIsLoaded(true);
          setInfo(stats);
        },
        (error) => {
          console.log("Can't fetch info");
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
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image
          src={"http://0.0.0.0:8000/pool/item/" + idx + "/image"}
          alt={"Image idx" + idx}
          width="100%"
        />
        <Box
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
        >
          {infos.prediction} @ {infos?.confidence?.toFixed(3)}
        </Box>
      </Box>
    );
  }
}

export default function LabellingStat() {
  const [stats, setStats] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://0.0.0.0:8000/most_uncertains")
      .then((res) => res.json())
      .then(
        (stats) => {
          setIsLoaded(true);
          setStats(stats);
        },
        (error) => {
          console.log("Can't fetch most_uncertain");
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
      <InputContext.Provider value={{ stats }}>
        <Text style={{ fontWeight: "bold" }}>Most uncertains</Text>
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
}
