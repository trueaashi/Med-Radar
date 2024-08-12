import {
  Box,
  Grid,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  HStack,
  useDisclosure,
  Input,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTreatmentsApi, removeTreatmentApi } from '../../https';
import { toast } from 'react-toastify';
const Treatments = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchName, setSearchName] = useState('');
  const [searchRegNo, setSearchRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  // const [removeProcessing, setRemoveProcessing] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const getTreatments = async () => {
    setLoading(true);
    try {
      const { data } = await getTreatmentsApi();
      if (!data) {
        setLoading(false);
        return toast.error('Server Error');
      }
      setTreatments(data.treatments);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTreatments();
  }, []);

  const handleNameSearch = async () => {};

  const removeHandler = async id => {
    // setRemoveProcessing(true);
    try {
      const { data } = await removeTreatmentApi(id);
      if (!data) {
        // setRemoveProcessing(false);
        return toast.error('Server Error');
      }
      toast.success(data);
      getTreatments();
      // setRemoveProcessing(false);
    } catch (error) {
      console.log(error);
      // setRemoveProcessing(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <Grid minH={'100vh'} templateColumns={['1fr', '1fr 5fr']}>
      <Sidebar />
      <Box p={['0', '16']} overflowX="auto" ove>
        <HStack justifyContent={'space-between'}>
          <Heading
            children={'Treatments'}
            ml={['0', '16']}
            mb="16"
            textAlign={['center', 'left']}
          />
          <HStack justifyContent={'space-around'}>
            <HStack>
              <Input
                placeholder="Search by Treatment name"
                size="md"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={handleNameSearch}
              >
                Search
              </Button>
            </HStack>
          </HStack>
        </HStack>
        <TableContainer maxH="70vh" overflowY="auto">
          <Table variant="simple">
            <TableCaption>Treatments</TableCaption>
            <Thead>
              <Tr>
                <Th>Serial number</Th>
                <Th>Treatment Name</Th>
                <Th>Treatment Cost</Th>
                <Th>Treatment Duration</Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {treatments.map((treatment, index) => {
                return (
                  <Tr>
                    <Td>{index + 1}</Td>
                    <Td>{treatment.name}</Td>
                    <Td>{treatment.price}</Td>
                    <Td>{treatment.duration}</Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        // onClick={onOpen}
                        onClick={() => {
                          navigate(`/view-treatment/${treatment._id}`);
                        }}
                      >
                        View
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        variant="solid"
                        onClick={() => {
                          navigate(`/edit-treatment/${treatment._id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        variant="solid"
                        colorScheme="red"
                        onClick={() => removeHandler(treatment._id)}
                      >
                        Remove
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
};

export default Treatments;
