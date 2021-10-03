import React from "react";
import { Heading, Flex, Divider, Image, Box } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="0.5rem"
      bg="gray.400"
    >
      <Flex align="center" mr={8}>
        <Image
          borderRadius="full"
          src="https://raw.githubusercontent.com/ElementAI/baal/master/docs/_static/images/logo-transparent.png"
          alt="BaaL Logo"
          maxW="100px"
        />

        <Heading as="h1" size="large">
          <Box>BaaL Dashboard</Box>
        </Heading>
        <Divider />
      </Flex>
    </Flex>
  );
};

export default Header;
