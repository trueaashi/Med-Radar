import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { CheckCircle, UnpublishedSharp } from '@mui/icons-material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { getMeApi, updateProfileApi } from '../../https';

const Profile = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [hospital, setHospital] = useState({
    profilePic: {},
    name: '',
    contacts: { email: '', phone: '' },
    address: { city: '', state: '', pincode: '', location: '' },
    approved: false,
  });
  const fetchHospital = async () => {
    setLoading(true);
    try {
      const { data } = await getMeApi();
      if (!data) {
        setLoading(false);
        return toast.error('Server Error');
      }
      setHospital(data.hospital);
      console.log(data.hospital);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchHospital();
  }, []);

  return (
    <>
      {loading ? (
        <VStack
          h={'full'}
          paddingX={['10', '200px']}
          justifyContent="center"
          spacing={'16'}
        >
          <Heading children={'Profile'} mt={'10'} />
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="lg"
          />
        </VStack>
      ) : (
        <Container minH={'95vh'} maxW="container.lg" py="8">
          <Heading children="Profile" m="8" textTransform={'uppercase'} />

          <Stack
            justifyContent={'flex-start'}
            direction={['column', 'row']}
            alignItems={'center'}
            spacing={['8', '16']}
            padding="8"
          >
            <VStack>
              {hospital.profilePic && hospital.profilePic.url ? (
                <Avatar boxSize={'48'} src={hospital.profilePic.url} />
              ) : (
                <Avatar boxSize={'48'} src={""} />
              )}
              <Button onClick={onOpen} colorScheme={'yellow'} variant="ghost">
                Change Photo
              </Button>
            </VStack>

            <VStack spacing={'4'} alignItems={['center', 'flex-start']}>
              <HStack justifyContent={'space-around'} gap={'100px'}>
                <VStack alignItems={'start'}>
                  <HStack>
                    <Text children="Name :" fontWeight={'bold'} />
                    <Text children={hospital.name} />
                  </HStack>{' '}
                  <HStack>
                    <Text children="Email :" fontWeight={'bold'} />
                    <Text children={hospital.contacts.email} />
                  </HStack>
                  <HStack>
                    <Text children="Phone :" fontWeight={'bold'} />
                    <Text children={hospital.contacts.phone} />
                  </HStack>
                </VStack>
                <VStack alignItems={'start'}>
                  <HStack>
                    <Text children="City :" fontWeight={'bold'} />
                    <Text children={hospital.address.city} />
                  </HStack>
                  <HStack>
                    <Text children="State :" fontWeight={'bold'} />
                    <Text children={hospital.address.state} />
                  </HStack>
                  <HStack>
                    <Text children="pincode :" fontWeight={'bold'} />
                    <Text children={hospital.address.pincode} />
                  </HStack>
                </VStack>
              </HStack>
              <HStack>
                <Text children="Location :" fontWeight={'bold'} />
                <Text children={hospital.address.location} />
              </HStack>
              <Stack direction={['column', 'row']} alignItems={'center'}>
                {hospital.approved ? (
                  <Button colorScheme={'green'}>
                    Approved <CheckCircle />
                  </Button>
                ) : (
                  <Button colorScheme={'red'}>
                    Approval Pending... <UnpublishedSharp />
                  </Button>
                )}
              </Stack>
            </VStack>
          </Stack>

          <ChangePhotoBox
            isOpen={isOpen}
            onClose={onClose}
            fetchHospital={fetchHospital}
          />
        </Container>
      )}
    </>
  );
};

export default Profile;

function ChangePhotoBox({ isOpen, onClose, fetchHospital }) {
  const [image, setImage] = useState('');
  const [imagePrev, setImagePrev] = useState('');
  const [processing, setProcessing] = useState(false);
  const changeImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const closeHandler = () => {
    onClose();
    setImagePrev('');
    setImage('');
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
  const handleSubmit = async event => {
    event.preventDefault();
    if (!image) return toast.warn('Please select a profile pic.');
    setProcessing(true);
    try {
      const { data } = await updateProfileApi({ file: image });
      if (!data) {
        setProcessing(false);
        return toast.error('Server Error');
      }
      setProcessing(false);
      toast.success(data);
      fetchHospital();
      closeHandler();
    } catch (e) {
      toast.error(e.response.data.message);
      setProcessing(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay backdropFilter={'blur(10px)'} />
      <ModalContent>
        <ModalHeader>Change Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form>
              <VStack spacing={'8'}>
                {imagePrev && <Avatar src={imagePrev} boxSize={'48'} />}

                <Input
                  type={'file'}
                  css={{ '&::file-selector-button': fileUploadCss }}
                  onChange={changeImage}
                />

                <Button
                  isLoading={processing}
                  w="full"
                  colorScheme={'yellow'}
                  onClick={handleSubmit}
                >
                  Change
                </Button>
              </VStack>
            </form>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button mr="3" onClick={closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
