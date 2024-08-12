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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-toastify';
import {
  addTreatmentApi,
  getTreatmentApi,
  updateTreatmentApi,
} from '../../https';
import { useNavigate, useParams } from 'react-router-dom';

const EditTreatment = () => {
  const [treatmentName, setTreatmentName] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const addHandler = async e => {
    e.preventDefault();
    setProcessing(true);
    if (
      !treatmentName ||
      !duration ||
      !durationUnit ||
      !description ||
      !price
    ) {
      setProcessing(false);
      return toast.warn('All fields are mandatory');
    }

    if (!Number.isInteger(Number(price)) || price <= 0) {
      return toast.warn('Treatment Cost should be a positive number');
    }

    try {
      const properDuration = duration + ' ' + durationUnit;
      const input = {
        name: treatmentName,
        description,
        price,
        duration: properDuration,
      };

      const { data } = await updateTreatmentApi(id, input);
      if (!data) {
        setProcessing(false);
        toast.error('Server Error');
      }
      toast.success(data);
      navigate('/treatments');
      setTreatmentName('');
      setDuration('');
      setDurationUnit('');
      setPrice('');
      setDescription('');
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.log(error);
    }
  };

  const fetchTreatment = async () => {
    setLoading(true);
    try {
      const { data } = await getTreatmentApi(id);
      if (data) {
        const { treatment } = data;
        setTreatmentName(treatment.name);
        setDescription(treatment.description);
        setPrice(treatment.price);
        let { duration } = treatment;
        let parts = duration.split(' ');
        setDuration(parts[0]);
        setDurationUnit(parts[1]);
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
          <Heading children={'Edit Treatment'} mt={'10'} />
          <form method="POST" style={{ width: '100%' }}>
            {/* ======== Name =========== */}
            <Box marginY={'2'}>
              <FormLabel htmlFor="name" children="Treatment Name" />
              <HStack>
                <Input
                  required
                  id="fname"
                  value={treatmentName}
                  onChange={e => setTreatmentName(e.target.value)}
                  placeholder="Name"
                  focusBorderColor="yellow.500"
                  type={'text-area'}
                />
              </HStack>
            </Box>
            {/* ========= Email ============= */}
            <Box marginY={'4'}>
              <FormLabel
                htmlFor="description"
                children="Treatment Description"
              />
              <Textarea
                required
                id="fname"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                focusBorderColor="yellow.500"
                type={'text-area'}
              />
            </Box>
            {/* ========= Age , Gender and Date of birth */}
            <Box marginY={'4'}>
              <HStack>
                <Box>
                  <FormLabel htmlFor="text" children="Treatment Cost (₹)" />
                  <Input
                    placeholder="Cost in ₹"
                    size="md"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </Box>
                <Box marginY={'2'}>
                  <FormLabel htmlFor="name" children="Treatment Duration" />
                  <HStack>
                    <Input
                      required
                      id="fname"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="Duration"
                      focusBorderColor="yellow.500"
                      type={'number'}
                    />
                    <Select
                      placeholder="-- Hr/Min --"
                      onChange={e => setDurationUnit(e.target.value)}
                    >
                      <option value="Minute">Minute</option>
                      <option value="Hour">Hour</option>
                      <option value="Day">Day</option>
                      <option value="Month">Month</option>
                      <option value="Year">Year</option>
                    </Select>
                  </HStack>
                </Box>
              </HStack>
            </Box>
            {processing ? (
              <Button my="4" colorScheme={'yellow'}>
                <Spinner
                  thickness="3px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="red.500"
                  size="lg"
                />
              </Button>
            ) : (
              <Button my="4" colorScheme={'yellow'} onClick={addHandler}>
                Edit
              </Button>
            )}
          </form>
        </VStack>
      )}
    </Grid>
  );
};

export default EditTreatment;
