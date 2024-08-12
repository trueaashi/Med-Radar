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
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setRegister } from '../../../Stores/registerSlice';
import { registerApi } from '../../../https';
import { setAuth } from '../../../Stores/authSlice';
const Step2 = ({ backStep }) => {
  const [processing, setProcessing] = useState(false);
  const data = useSelector(state => state.register);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const handleChange = event => {
    const { name, value } = event.target;
    setInputs(inputs => ({
      ...inputs,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key) && !inputs[key]) {
        return toast.warn('All fields are mandatory');
      }
    }
    if (inputs.password !== inputs.confirmPassword) {
      return toast.warn('password and confirm password must be same');
    }
    dispatch(setRegister(inputs));
    const dataToSend = { ...data, ...inputs };
    try {
      const { data } = await registerApi(dataToSend);
      if (!data) {
        return toast.error('Server Error');
      }
      dispatch(setAuth(data));
      toast.success('You have successfully registered, Please wait for approval');
      setProcessing(false);
      if (data.data.approved) {
        navigate('/treatments');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setProcessing(false);
      console.log(error);
    }
  };
  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading children={'Signup'} />
        <form style={{ width: '100%' }}>
          <Box marginY={'4'}>
            <FormLabel htmlFor="email" children="Email" />
            <Input
              required
              name={'email'}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              focusBorderColor="yellow.500"
              type={'email'}
            />
          </Box>
          <Box marginY={'4'}>
            <FormLabel htmlFor="password" children="Phone Number" />
            <Input
              required
              name={'phone'}
              onChange={handleChange}
              focusBorderColor="yellow.500"
              type={'number'}
            />
          </Box>
          <Box marginY={'4'}>
            <FormLabel htmlFor="password" children="Password" />
            <Input
              required
              name={'password'}
              onChange={handleChange}
              focusBorderColor="yellow.500"
              type={'password'}
            />
          </Box>
          <Box marginY={'4'}>
            <FormLabel htmlFor="Location" children="Confirm Password" />
            <Input
              required
              name="confirmPassword"
              onChange={handleChange}
              focusBorderColor="yellow.500"
              type={'password'}
            />
          </Box>

          <HStack justifyContent={'space-between'}>
            <Button my="4" colorScheme={'blue'} onClick={backStep}>
              Back
            </Button>
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
              <Button my="4" colorScheme={'yellow'} onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </HStack>
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

export default Step2;
