import {
  Grid,
  Heading,
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
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-toastify';
import { getDoctorApi, getTreatmentApi } from '../../https';
import { useParams } from 'react-router-dom';
const ViewDoctor = () => {
  const [doctor, setDoctor] = useState({});
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorApi(id);
      if (data) {
        const { doctor } = data;
        setDoctor(doctor);
        setImg(doctor.img.url);
      }
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useState(() => {
    fetchDoctor();
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
          {/* <Heading children={'Doctor'} mt={'10'} /> */}
          <TableContainer style={{ width: '100%' }}>
            <Table variant="striped" colorScheme="teal">
              <TableCaption>Doctor's Details</TableCaption>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td></Td>
                  <Td>
                    {<img src={img} alt="" />}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Name</Td>
                  <Td>{doctor.name}</Td>
                </Tr>
                <Tr>
                  <Td>Specialty</Td>
                  <Td>{doctor.specialty}</Td>
                </Tr>
                <Tr>
                  <Td>Appointment Time</Td>
                  <Td>
                    {doctor.startTime} - {doctor.startTime}
                  </Td>
                </Tr>
                <Tr>
                  <Td>About</Td>
                  <Td>{doctor.about}</Td>
                </Tr>
                <Tr>
                  <Td>Experience</Td>
                  <Td>{doctor.yearsOfExperience}</Td>
                </Tr>
              </Tbody>
              <Tfoot></Tfoot>
            </Table>
          </TableContainer>
        </VStack>
      )}
    </Grid>
  );
};
export default ViewDoctor;
