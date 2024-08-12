import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../../https';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../Stores/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginHandler = async e => {
    e.preventDefault();
    setProcessing(true);
    if (!email || !password) {
      return toast.warn('All fields are mandatory');
    }
    try {
      const { data } = await loginApi({ email, password });
      if (!data) {
        return toast.error('Server Error');
      }
      dispatch(setAuth(data));
      if (data.data.approved) {
        navigate('/treatments');
      } else {
        navigate('/');
      }
    } catch (e) {
      toast.error(e.response.data.message);
      setProcessing(false);
    }
  };
  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading children={'Login'} />
        <form style={{ width: '100%' }}>
          <Box marginY={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="eamil"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              focusBorderColor="yellow.500"
              type={'email'}
            />
          </Box>
          <Box marginY={'4'}>
            <FormLabel htmlFor="password" children="Password" />
            <Input
              required
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="asAS12@...."
              focusBorderColor="yellow.500"
              type={'password'}
            />
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
            <Button my="4" colorScheme={'yellow'} onClick={loginHandler}>
              Login
            </Button>
          )}
          <p>
            Don't have account ?{' '}
            <span style={{ color: 'blue' }}>
              <Link to={'/signup'}> Signup </Link>
            </span>
          </p>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
