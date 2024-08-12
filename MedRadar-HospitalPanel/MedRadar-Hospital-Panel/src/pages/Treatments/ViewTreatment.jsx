import {
  Box,
  Button,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
  Spinner,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-toastify';
import {
  addTreatmentApi,
  getTreatmentApi,
  updateTreatmentApi,
} from '../../https';
import { useParams } from 'react-router-dom';

const ViewTreatment = () => {
  const [treatment, setTreatment] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchTreatment = async () => {
    setLoading(true);
    try {
      const { data } = await getTreatmentApi(id);
      if (data) {
        const { treatment } = data;
        setTreatment(treatment);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useState(() => {
    fetchTreatment();
  }, []);

  return (
    <Grid minH={'100vh'} templateColumns={['1fr', '1fr 5fr']}>
      <Sidebar />
      {loading ? (
        <VStack
          h={'full'}
          paddingX={['10', '200px']}
          justifyContent="center"
          spacing={'16'}
        >
          <Heading children={'Edit Treatment'} mt={'10'} />
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="lg"
          />
        </VStack>
      ) : (
        <VStack
          h={'full'}
          paddingX={['10', '200px']}
          justifyContent="center"
          spacing={'16'}
        >
          <Heading children={'View Treatment'} mt={'10'} />
          <TableContainer style={{ width: '100%' }}>
            <Table variant="striped" colorScheme="teal">
              <TableCaption>Treatment Details</TableCaption>
              <Thead>
                <Tr>
                  <Th>Field Name</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Name</Td>
                  <Td>{treatment.name}</Td>
                </Tr>
                <Tr>
                  <Td>Description</Td>
                  <Td>{treatment.description}</Td>
                </Tr>
                <Tr>
                  <Td>Price</Td>
                  <Td>{treatment.price}</Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Duration</Th>
                  <Td>{treatment.duration}</Td>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </VStack>
      )}
    </Grid>
  );
};

export default ViewTreatment;
