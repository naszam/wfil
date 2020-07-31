import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Button, Heading, Text, Input, Field } from 'rimble-ui';

import MainLayout from '../components/layouts';

const Wallet = () => {
  const [balanceAddress, setBalanceAddress] = useState('');
  const [sendForm, setSendForm] = useState({});

  const handleSendValueChange = ({ target }) => {
    const { name, value } = target;
    setSendForm({
      ...sendForm,
      [name]: value
    });
  }

  return (
    <MainLayout>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5}>
        <Heading as="h1" fontFamily="sansSerif" color="primary" mb={1}>Create Wallet</Heading>
        <Box>
          <Text fontFamily="sansSerif" mb={4}>
            Create your own filecoin wallet. You will receive an address and a private token.
          </Text>
        </Box>
        <Flex justifyContent="flex-end">
          <Button onClick={() => {}}>Create</Button>
        </Flex>
      </Card>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5}>
        <Heading as="h1" fontFamily="sansSerif" color="primary" mb={1}>Get address balance</Heading>
        <Box mb={2}>
          <Text fontFamily="sansSerif" mb={4}>
            Get the balance of a given address
          </Text>
          <Input
              name="address"
              onChange={({ target: { value }}) => setBalanceAddress(value)}
              placeholder="Wallet to check balance"
              type="text"
              value={balanceAddress}
              width="100%"
            />
        </Box>
        <Flex justifyContent="flex-end">
          <Button onClick={() => {}}>Get Balance</Button>
        </Flex>
      </Card>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5}>
        <Heading as="h1" fontFamily="sansSerif" color="primary" mb={1}>Send FIL</Heading>
        <Box mb={2}>
          <Text fontFamily="sansSerif" mb={4}>
            Send Filecoin to a given address
          </Text>
          <Field label="Destination FIL address" fontFamily="sansSerif" width="100%" color="primary" mb={4}>
            <Input
                name="destination"
                onChange={handleSendValueChange}
                placeholder="Wallet to send FIL"
                type="text"
                value={sendForm.destination}
                width="100%"
              />
          </Field>
          <Field label="FIL amount" fontFamily="sansSerif" width="100%" color="primary" mb={4}>
            <Input
                name="amount"
                onChange={handleSendValueChange}
                placeholder="FIL amount"
                type="text"
                value={sendForm.amount}
                width="100%"
              />
          </Field>
          <Field label="Private token" fontFamily="sansSerif" width="100%" color="primary" mb={4}>
            <Input
                name="token"
                onChange={handleSendValueChange}
                placeholder="Ypur private token"
                type="text"
                value={sendForm.token}
                width="100%"
              />
          </Field>
        </Box>
        <Flex justifyContent="flex-end">
          <Button onClick={() => {}}>Send</Button>
        </Flex>
      </Card>
      
    </MainLayout>
  );
}
 
export default Wallet;
