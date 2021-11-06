import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

const DatasetContext = React.createContext({
  stats: [],
  fetchStats: () => [],
});

function ClassHelper({ name, count}) {
  return (
    <Box>
      <Text>
        {name}: {count}
      </Text>
    </Box>
  );
}

export default function DatasetInfo() {
  const [stats, setStats] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://0.0.0.0:8000/dataset_info")
      .then((res) => res.json())
      .then(
        (stats) => {
          setIsLoaded(true);
          setStats(stats);
        },
        (error) => {
          console.log("Can't fetch dataset_info");
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
      <DatasetContext.Provider value={{ stats }}>
        <Stack
          bg="gray.50"
          p="10"
          textAlign="center"
          rounded="lg"
          color="black.400"
          borderWidth="1px"
          borderRadius="lg"
          minH="100%"
        >
          <Text style={{fontWeight: "bold"}}>
          Class Distribution
        </Text>
          {stats.map(item => (
            <ClassHelper name={item[0]} count={item[1]} />
          ))}
        </Stack>
      </DatasetContext.Provider>
    );
  }
}
