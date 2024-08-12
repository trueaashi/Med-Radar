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
  Image,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import facility1 from '../../Assets/Facilities/download.jpeg';
import facility2 from '../../Assets/Facilities/download (1).jpeg';
import { toast } from 'react-toastify';
import { getFacilitiesApi, removeFacilityApi } from '../../https';

const Facilities = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const handleNameSearch = async () => {};
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const { data } = await getFacilitiesApi();
      if (!data) {
        setLoading(false);
        return toast.error('Server Error');
      }
      console.log(data);
      setFacilities(data.facilities);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleRemove = async id => {
    setProcessing(true);
    try {
      const { data } = await removeFacilityApi(id);
      if (!data) {
        return toast.error('Server Error');
      }
      toast.success(data);
      fetchFacilities();
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Grid minH={'100vh'} templateColumns={['1fr', '1fr 5fr']}>
      <Sidebar />
      <Box p={['0', '16']} overflowX="auto">
        <HStack justifyContent={'space-between'}>
          <Heading
            children={'Facilities'}
            ml={['0', '16']}
            mb="16"
            textAlign={['center', 'left']}
          />
          <HStack justifyContent={'space-around'}>
            <HStack>
              <Input
                placeholder="Search by name"
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
                <Th>Sr No.</Th>
                <Th>Facility Name</Th>
                <Th>Facility Image</Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {facilities.map((facility, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{facility.name}</Td>
                    <Td>
                      <Image
                        src={facility.img.url}
                        boxSize="64"
                        objectFit={'contain'}
                      />
                    </Td>

                    <Td>
                      {processing ? (
                        <Button my="4" colorScheme={'red'}>
                          <Spinner
                            thickness="3px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="white.500"
                            size="lg"
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="solid"
                          colorScheme="red"
                          onClick={() => {
                            handleRemove(facility._id);
                          }}
                        >
                          Remove
                        </Button>
                      )}
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

export default Facilities;
