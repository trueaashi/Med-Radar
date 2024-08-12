import {
  Box,
  Button,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-toastify';
import { addFacilityApi } from '../../https';
import { useNavigate } from 'react-router-dom';

const AddFacility = () => {
  const [imagePrev, setImagePrev] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const loginHandler = async e => {
    e.preventDefault();
    setProcessing(true);
    if (!image || !title) {
      return toast.warn('All fields are mandatory');
    }
    try {
      const { data } = await addFacilityApi({ facility: title, file: image });
      if (!data) {
        return toast.error('Server Error');
      }
      if (data) {
        toast.success(data);
        setProcessing(false);
        navigate('/facilities');
      } else {
        setProcessing(false);
        navigate('/');
      }
    } catch (e) {
      toast.error(e.response.data.message);
      setProcessing(false);
    }
  };
  const fileUploadCss = {
    cursor: 'pointer',
    marginLeft: '-5%',
    width: '110%',
    border: 'none',
    height: '100%',
    color: '#ECC94B',
    backgroundColor: 'white',
  };
  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };
  return (
    <Grid minH={'100vh'} templateColumns={['1fr', '1fr 5fr']}>
      <Sidebar />
      <VStack
        h={'full'}
        paddingX={['10', '200px']}
        justifyContent="center"
        spacing={'16'}
      >
        <Heading children={'Add Facility'} mt={'10'} />
        <form method="POST" style={{ width: '50%' }}>
          {/* ======== Name =========== */}
          <Box marginY={'2'}>
            <FormLabel htmlFor="name" children="Image" />
            <VStack>
              {imagePrev && (
                <Image src={imagePrev} boxSize="64" objectFit={'contain'} />
              )}
              <Input
                accept="image/*"
                required
                type={'file'}
                focusBorderColor="purple.300"
                css={{
                  '&::file-selector-button': {
                    ...fileUploadCss,
                    color: 'purple',
                  },
                }}
                onChange={changeImageHandler}
              />
            </VStack>
          </Box>

          {/* ========= Age , Gender and Date of birth */}
          <Box marginY={'4'}>
            <HStack justifyContent={'space-between'}>
              <Box>
                <FormLabel htmlFor="text" children="Title" />
                <Input
                  placeholder="Facility Name"
                  size="md"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
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
            <Button my="4" colorScheme={'yellow'} onClick={loginHandler}>
              Add
            </Button>
          )}
        </form>
      </VStack>
    </Grid>
  );
};

export default AddFacility;
