import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { RiAddCircleFill, RiEyeFill, RiUser3Fill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <VStack
      spacing={'8'}
      padding={'16'}
      boxShadow={'-2px 0 10px rgba(107,70,193,0.5)'}
    >
     
      <LinkButton
        url={'treatments'}
        text={'Treatments'}
        active={location.pathname === '/treatments'}
      />
      <LinkButton
        url={'add-treatments'}
        text={'Add Treatment'}
        active={location.pathname === '/add-treatments'}
      />
      <LinkButton
        url={'doctors'}
        text={'Doctors'}
        active={location.pathname === '/doctors'}
      />
      <LinkButton
        url={'add-doctors'}
        text={'Add Doctor'}
        active={location.pathname === '/add-doctors'}
      />
      <LinkButton
        url={'facilities'}
        text={'Facilities'}
        active={location.pathname === '/facilities'}
      />
      <LinkButton
        url={'add-facility'}
        text={'Add Facility'}
        active={location.pathname === '/add-facility'}
      />
    </VStack>
  );
};

export default Sidebar;

function LinkButton({ url, text, active }) {
  return (
    <Link to={`/${url}`}>
      <Button
        gap={'2'}
        variant={active ? 'solid' : 'ghost'}
        colorScheme={'purple'}
      >
        {text}
      </Button>
    </Link>
  );
}
