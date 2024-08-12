import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { ColorModeSwitcher } from '../../../ColorModeSwitcher';
import './Header.css';
import axios from 'axios';
import logo from '../../../Assets/medradarLogo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { logoutApi } from '../../../https';
import { toast } from 'react-toastify';
import { clearAuth } from '../../../Stores/authSlice';
const LinkButton = ({ url = '/', title = 'Home', onClose }) => {
  return (
    <Link to={url} onClick={onClose}>
      <Button variant={'ghost'}>{title}</Button>
    </Link>
  );
};

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const {isAuth, approved} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);

  const logoutHandler = async () => {
    setProcessing(true);
    try {
      const { data } = await logoutApi();
      if (!data) {
        return toast.error('Server Error');
      }
      setProcessing(false);
      toast.success('You have successfully signed out');
      dispatch(clearAuth());
      navigate('/');
      onClose();
    } catch (error) {
      setProcessing(false);
      console.log(error);
      onClose();
    }
  };

  return (
    <div className="header" style={{ height: '60px', background: '#8083c9' }}>
      <HStack alignItems={'center'} h="100%" justifyContent={'space-between'}>
        {/* Logo */}
        <Box>
          <Image src={logo} width={'100px'} marginLeft="2" />
        </Box>
        {/* theme toggler and menu btn */}
        <HStack justifyContent={'space-around'} width="200px">
          <ColorModeSwitcher />
          <Button
            colorScheme={'yellow'}
            width="12"
            height="12"
            rounded={'full'}
            zIndex="overlay"
            // marginRight={'2'}
            onClick={onOpen}
          >
            <RiMenu5Fill />
          </Button>
        </HStack>

        {/* Drawer */}
        <Drawer placement={'left'} size="xs" isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VStack spacing={'4'}>
                <LinkButton url="/" title="Home" onClose={onClose} />
                {/* <LinkButton
                  url="/registration"
                  title="Register"
                  onClose={onClose}
                /> */}
                {/* <LinkButton url="/about" title="About" onClose={onClose} /> */}
                <HStack
                  justifyContent={'space-evenly'}
                  //   position="absolute"
                  //   bottom={'2rem'}
                  //   width="80%"
                >
                  {isAuth ? (
                    <VStack>
                      <HStack>
                        <Link to={'/Profile'} onClick={onClose}>
                          <Button variant={'ghost'} colorScheme={'yellow'}>
                            Profile
                          </Button>
                        </Link>
                        {!processing ? (
                          <Button variant={'ghost'} onClick={logoutHandler}>
                            <RiLogoutBoxLine /> Logout
                          </Button>
                        ) : (
                          <Button variant={'ghost'}>
                            <Spinner
                              thickness="3px"
                              speed="0.65s"
                              emptyColor="gray.200"
                              color="red.500"
                              size="lg"
                            />
                          </Button>
                        )}
                      </HStack>

                      {approved && <Link to={'/treatments'} onClick={onClose}>
                        <Button variant={'ghost'} colorScheme={'purple'}>
                          <RiDashboardFill style={{ margin: '4px' }} />
                          Dashboard
                        </Button>
                      </Link>}
                    </VStack>
                  ) : (
                    <Link to={'/login'} onClick={onClose}>
                      <Button colorScheme={'yellow'}>Login</Button>
                    </Link>
                  )}
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </HStack>
    </div>
  );
};

export default Header;
