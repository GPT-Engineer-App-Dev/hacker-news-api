import React, { useEffect, useState } from "react";
import { Container, VStack, Box, Text, Link, Spinner, Flex, Heading } from "@chakra-ui/react";
import { FaHackerNews } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top10Ids = storyIds.slice(0, 10);
        return Promise.all(
          top10Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
          )
        );
      })
      .then((stories) => {
        setStories(stories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stories:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxW="container.lg" p={4}>
      <Flex as="nav" bg="gray.800" color="white" p={4} mb={4} alignItems="center">
        <FaHackerNews size="24px" />
        <Heading as="h1" size="lg" ml={2}>
          Hacker News
        </Heading>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="80vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <Link href={story.url} isExternal fontSize="xl" fontWeight="bold">
                {story.title}
              </Link>
              <Text fontSize="sm" color="gray.500">
                by {story.by} | {new Date(story.time * 1000).toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;