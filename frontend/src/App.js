import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  VStack,
  HStack,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

function App() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error fetching tasks',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { name, description });
      setName('');
      setDescription('');
      fetchTasks();
      toast({
        title: 'Task added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error adding task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
      fetchTasks();
      toast({
        title: `Task ${completed ? 'uncompleted' : 'completed'}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error updating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error deleting task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl">
          To-Do List
        </Heading>
        <Box as="form" onSubmit={addTask} width="100%">
          <VStack spacing={4}>
            <Input
              placeholder="Task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" colorScheme="blue" width="100%">
              Add Task
            </Button>
          </VStack>
        </Box>
        <List spacing={3} width="100%">
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              p={3}
              bg="gray.100"
              borderRadius="md"
              boxShadow="md"
            >
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    textDecoration={task.completed ? 'line-through' : 'none'}
                  >
                    {task.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {task.description}
                  </Text>
                </VStack>
                <HStack>
                  <IconButton
                    icon={task.completed ? <CloseIcon /> : <CheckIcon />}
                    onClick={() => toggleTask(task.id, task.completed)}
                    colorScheme={task.completed ? 'orange' : 'green'}
                    aria-label={task.completed ? 'Mark as uncompleted' : 'Mark as completed'}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => deleteTask(task.id)}
                    colorScheme="red"
                    aria-label="Delete task"
                  />
                </HStack>
              </Flex>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
}

export default App;

