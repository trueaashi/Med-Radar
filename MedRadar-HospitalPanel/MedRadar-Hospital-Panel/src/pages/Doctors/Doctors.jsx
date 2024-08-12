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
import { getDoctorsApi, removeDoctorApi } from '../../https';
import { toast } from 'react-toastify';
const Doctors = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchName, setSearchName] = useState('');
  const [searchRegNo, setSearchRegNo] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState([]);

  const getDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorsApi();
      if (!data) {
        setLoading(false);
        return toast.error('Server Error');
      }
      setDoctors(data.doctors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const removeHandler = async id => {
    try {
      const { data } = await removeDoctorApi(id);
      if (!data) {
        return toast.error('Server Error');
      }
      toast.success(data);
      getDoctors();
    } catch (error) {
      console.log(error);

      toast.error('Something went wrong');
    }
  };

  const handleNameSearch = async () => {};

  return (
    <Grid minH={'100vh'} templateColumns={['1fr', '1fr 5fr']}>
      <Sidebar />
      <Box p={['0', '16']} overflowX="auto">
        <HStack justifyContent={'space-between'}>
          <Heading
            children={'Doctors'}
            ml={['0', '16']}
            mb="16"
            textAlign={['center', 'left']}
          />
          <HStack justifyContent={'space-around'}>
            <HStack>
              <Input
                placeholder="Search by Doctor name"
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
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Treatments</TableCaption>
            <Thead>
              <Tr>
                <Th>Serial number</Th>
                <Th>Doctor Name</Th>
                <Th>Doctor Slot</Th>
                <Th>Doctor specialty</Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {doctors.map((doctor, index) => {
                return (
                  <Tr>
                    <Td>{index + 1}</Td>
                    <Td>Dr. {doctor.name}</Td>
                    <Td>
                      {doctor.startTime} - {doctor.endTime}
                    </Td>
                    <Td>{doctor.specialty}</Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        // onClick={onOpen}
                        onClick={() => {
                          navigate(`/doctor/${doctor._id}`);
                        }}
                      >
                        View
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        variant="solid"
                        colorScheme="red"
                        onClick={() => removeHandler(doctor._id)}
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

export default Doctors;
