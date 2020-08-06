import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Button, Heading, Text, Input, Field } from 'rimble-ui';

import { createWallet, getBalance, sendFil } from '../services/api';
import MainLayout from '../components/layouts';

const Wallet = () => {
  const [balanceAddress, setBalanceAddress] = useState('');
  const [sendForm, setSendForm] = useState({ token: '', amount: '', destination: '' });
  const [createWalletResult, setCreateWalletResult] = useState({});
  const [walletBalance, setWalletBalance] = useState('');

  const handleSendValueChange = ({ target }) => {
    const { name, value } = target;
    setSendForm({
      ...sendForm,
      [name]: value
    });
  }

  const handleCreateWallet = async () => {
    const { success, data } = await createWallet();
    if (success) {
      setCreateWalletResult(data);
    }
  }

  const handleGetBalance = async () => {
    const { success, data } = await getBalance(balanceAddress);
    if (success) {
      setWalletBalance(data)
    }
  }

  const handleSendFil = async () => {
    const { token, amount, destination } = sendForm;
    const filAmount = amount.replace(',', '.') * 10e17;
    const { success } = await sendFil(token, filAmount, destination);
    if (success) {
      setSendForm({ token: '', amount: '', destination: '', success: true })
    }

  }

  return (
    <MainLayout>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5}>
        <Heading as="h1" fontFamily="sansSerif" color="primary" mb={1}>Create Wallet</Heading>
        <Box mb={4}>
          <Text fontFamily="sansSerif">
            Create your own filecoin wallet. You will receive an address and a private token.
          </Text>
        </Box>
        <Flex justifyContent="flex-end">
          <Button onClick={handleCreateWallet}>Create</Button>
        </Flex>
        {createWalletResult.token && createWalletResult.address && (
          <>
            <Box mt={4}>
              <Heading as="h3" fontFamily="sansSerif" color="primary" my={1}>Token:</Heading>
              <Text fontFamily="sansSerif">{createWalletResult.token}</Text>
            </Box>
            <Box mt={2}>
              <Heading as="h3" fontFamily="sansSerif" color="primary" my={1}>Address:</Heading>
              <Text fontFamily="sansSerif">{createWalletResult.address}</Text>
            </Box>
          </>
        )}
      </Card>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5}>
        <Heading as="h1" fontFamily="sansSerif" color="primary" mb={1}>Get address balance</Heading>
        <Box mb={4}>
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
          <Button onClick={handleGetBalance}>Get Balance</Button>
        </Flex>
        {walletBalance && (
          <>
            <Box mt={4}>
              <Heading as="h3" fontFamily="sansSerif" color="primary" my={1}>Balance:</Heading>
              <Text fontFamily="sansSerif">{(walletBalance / 10e17).toFixed(4)} FIL</Text>
            </Box>
          </>
        )}
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
                placeholder="Your private token"
                type="text"
                value={sendForm.token}
                width="100%"
              />
          </Field>
        </Box>
        <Flex justifyContent="flex-end">
          <Button onClick={handleSendFil}>Send</Button>
        </Flex>
        {sendForm.success && (
          <>
            <Box mt={4}>
              <Heading as="h3" fontFamily="sansSerif" color="primary" my={1}>Success</Heading>
            </Box>
          </>
        )}
      </Card>
      
    </MainLayout>
  );
}
 
export default Wallet;
