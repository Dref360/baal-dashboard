import React, {useEffect, useState} from "react";
import {
  Stack, Flex, Text, Stat, StatLabel, StatNumber, StatHelpText
} from "@chakra-ui/react";

const LSContext = React.createContext({
  stats: {}, fetchStats: () => {}
})

function ProgressHelper({num_labelled, total}) {
  return (
    <Stat>
        <StatLabel>Labelling Progress</StatLabel>
        <StatNumber>{num_labelled}/{total}</StatNumber>
    </Stat>
  )}

function UncertaintyHelper({mean, std}) {
    return (
      <Stat>
          <StatLabel>Pool Uncertainty</StatLabel>
          <StatNumber>{mean}±{std}</StatNumber>
          <StatHelpText>Using BALD</StatHelpText>
      </Stat>
    )}

export default function LabellingStat () {
  const [stats, setStats] = useState({})
  const fetchStats = async () => {
    const response = await fetch("http://0.0.0.0:8000/stats")
    const stats = await response.json()
    setStats(stats.data)
  }
  useEffect(() => {
    fetchStats()
  }, [])


  return (
    <LSContext.Provider value={{stats, fetchStats}}>
      <Flex spacing={5}>
        <ProgressHelper num_labelled={stats.num_labelled} total={stats.total} />
        <UncertaintyHelper mean={stats.uncertainty_stats?.mean} std={stats.uncertainty_stats?.std} />
      </Flex>
    </LSContext.Provider>
    );
}