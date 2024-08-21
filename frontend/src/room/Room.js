import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

function Room() {
  const [roomId, setRoomId] = useState('');

  const handleJoinClick = () => {
    // Handle the join logic here, for example, navigating to the room or calling an API
    console.log('Joining room with ID:', roomId);
  };

  return (
    <Box 
      maxW="md" 
      mx="auto" 
      mt="10"
      p="5"
      borderWidth="1px" 
      borderRadius="lg" 
      boxShadow="lg"
    >
      <VStack spacing="4">
        <FormControl id="room-id" isRequired>
          <FormLabel>Room ID</FormLabel>
          <Input 
            type="text" 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)} 
            placeholder="Enter Room ID" 
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleJoinClick}>
          Join
        </Button>
      </VStack>
    </Box>
  );
}

export default Room;
