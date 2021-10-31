import React from "react";
import { Heading, Flex, Divider, Image, Box, Link, Spacer, Grid} from "@chakra-ui/react";
import {
  PhoneIcon,
  AddIcon,
  WarningIcon,
  ExternalLinkIcon,
  StarIcon,
} from "@chakra-ui/icons";

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
      <Link href="/">
      <Flex align="center" mr={8} minW="500px">
        <Image
          borderRadius="full"
          src="https://raw.githubusercontent.com/ElementAI/baal/master/docs/_static/images/logo-transparent.png"
          alt="BaaL Logo"
          maxW="100px"
        />
        <Heading as="h1" size="large">
          <Box>BaaL Dashboard</Box>
        </Heading>
      </Flex>
      </Link>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Link href="https://github.com/Dref360/baal-dashboard" isExternal>
          <Image src='/GitHub-Mark/PNG/GitHub-Mark-32px.png' w={6} h={6}/>
        </Link>
        <Link href="https://baal.readthedocs.io" isExternal>
          <ExternalLinkIcon w={6} h={6} />
        </Link>
      </Grid>
    </Flex>
  );
};

export default Header;
