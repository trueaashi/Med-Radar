import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Spinner,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRegister } from '../../../Stores/registerSlice';
const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry',
];
const Step1 = ({ nextStep }) => {
  const [processing, setProcessing] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    location: '',
    pincode: '',
    state: '',
    city: '',
  });

  const dispatch = useDispatch();

  const handleChange = event => {
    const { name, value } = event.target;
    setInputs(inputs => ({
      ...inputs,
      [name]: value,
    }));
  };

  const handleNext = () => {
    console.log(inputs);
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key) && !inputs[key]) {
        return toast.warn('All fields are mandatory');
      }
    }
    dispatch(setRegister(inputs));
    nextStep();
  };

  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading children={'Signup'} />
        <form style={{ width: '100%' }}>
          <Box marginY={'4'}>
            <FormLabel htmlFor="email" children="Hospital Name" />
            <Input
              required
              name="name"
              onChange={handleChange}
              focusBorderColor="yellow.500"
              type={'text'}
            />
          </Box>
          <Box marginY={'4'}>
            <FormLabel htmlFor="Location" children="Location" />
            <Input
              required
              name="location"
              onChange={handleChange}
              placeholder="area/street"
              focusBorderColor="yellow.500"
              type={'text'}
            />
          </Box>
          <HStack justifyContent={'space-between'}>
            <Box marginY={'4'}>
              <FormLabel htmlFor="Location" children="City" />
              <Input
                required
                name="city"
                onChange={handleChange}
                focusBorderColor="yellow.500"
                type={'text'}
              />
            </Box>
            <Box marginY={'4'}>
              <FormLabel htmlFor="Location" children="Pincode" />
              <Input
                required
                name="pincode"
                onChange={handleChange}
                focusBorderColor="yellow.500"
                type={'number'}
              />
            </Box>
          </HStack>
          <Box marginY={'4'}>
            <FormLabel htmlFor="Location" children="State" />
            <Select
              placeholder="--state--"
              onChange={e => {
                setInputs({ ...inputs, state: e.target.value });
              }}
            >
              {states.map((state, index) => {
                return (
                  <option key={index} value={state}>
                    {state}
                  </option>
                );
              })}
            </Select>
          </Box>

          <Button my="4" colorScheme={'yellow'} onClick={handleNext}>
            Next
          </Button>

          <p>
            Already have an account ?{' '}
            <span style={{ color: 'blue' }}>
              <Link to={'/signin'}> SignIn </Link>
            </span>
          </p>
        </form>
      </VStack>
    </Container>
  );
};

export default Step1;
