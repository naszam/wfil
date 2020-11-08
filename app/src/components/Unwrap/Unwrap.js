import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Field, Text, Input, Button, Modal, Loader } from 'rimble-ui';

import { checkTransactionStatus, askForUnwrap } from '../../services/api';
import { sendUnwrapTransaction } from '../../services/web3';
import { getWallet } from '../Wallet/db';

const INTERVAL_CHECK = 5000;
let intervalHandler = null;
const TX_STATUSES = {
  PENDING_COMPLETION: 'pending-completion',
  PENDING_ETH_TX: 'pending-eth-tx',
  PENDING_METAMASK: 'pending-metamask',
  SUCCESS: 'success'
}

const SetInputValue = styled.a`
  position: absolute;
  top: 12px;
  right: 0;
  text-decoration: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
`;

const Unwrap = () => {
  const lsWallet = getWallet();
  const address = lsWallet?.address ?? '';
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: address});
  const [success, setSuccess] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const { account, userBalance } = useSelector(state => state.web3);

  const onWrapValueChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'amount' && Number(value) < 0) return;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleUseMaxWFilValue = () => {
    onWrapValueChange({ target: { name: 'amount', value: userBalance }});
  };

  const handleUseFilWallet = () => {
    onWrapValueChange({ target: { name: 'destination', value: address }});
  };

  const handleUnWrap = async () => {
    const { amount, destination } = formData;
    console.log("UNWRAPPPP!!", amount, destination, account)

    if (amount > 0) {
      const filAmount = amount.replace(',', '.');
      const { success, data } = await askForUnwrap({ origin: account, amount: filAmount, destination });
      
      if (!success) return;
      const transactionId = data.id;
      const filAmountAbs = String(amount.replace(',', '.') * 1e18);
      setTxStatus(TX_STATUSES.PENDING_METAMASK);
      
      sendUnwrapTransaction({
        destination,
        amount: filAmountAbs,
        account,
        callback: ({ status, transactionHash }) => {
          setTxStatus(TX_STATUSES.PENDING_ETH_TX);
          if (status === 'success') {
            setTxStatus(TX_STATUSES.PENDING_COMPLETION);
            intervalHandler && clearInterval(intervalHandler);
            intervalHandler = setInterval(async() => {
              const { success: statusSuccess, data: dataTransaction } = await checkTransactionStatus(transactionId);
              console.log("intervalHandler -> success", statusSuccess, dataTransaction)
              if (statusSuccess && dataTransaction && dataTransaction.status === 'success') {
                setTxStatus(TX_STATUSES.SUCCESS);
                setSuccess(true);
                clearInterval(intervalHandler);
              }
            }, INTERVAL_CHECK);
          }
        }
      })
      setModalOpen(true)
    }
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="stretch" py={4}>
      <Box px={4} mb={2}>
          <Field position="relative" label="Unwrap Amount" fontFamily="sansSerif" width="100%" color="primary">
            <Input
              name="amount"
              onChange={onWrapValueChange}
              placeholder="Amount of WFIL to unwrap"
              required={true}
              type="number"
              value={formData.amount}
              width="100%"
            />
            <SetInputValue onClick={handleUseMaxWFilValue}>max</SetInputValue>
          </Field>
        </Box>
        <Box px={4} mb={2}>
          <Field position="relative" label="FIL Address" fontFamily="sansSerif" width="100%" color="primary">
            <Input
              name="destination"
              onChange={onWrapValueChange}
              placeholder="e.g. t3sajrvgya262eypuvzdbfc4n2me..."
              required={true}
              type="text"
              value={formData.destination}
              width="100%"
            />
            <SetInputValue onClick={handleUseFilWallet}>wallet</SetInputValue>
          </Field>
        </Box>
        <Box px={4}>
          <Button onClick={handleUnWrap} width="100%">UNWRAP</Button>
        </Box>
      </Flex>
      <Modal isOpen={modalOpen}>
        <Card width={"420px"} p={0}>
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={() => setModalOpen(false)}
          />

          <Box p={4} mb={3}>
            <Heading.h3>Unwrapping WFIL into FIL</Heading.h3>
            {txStatus === TX_STATUSES.SUCCESS && <Text mt={4}>Success</Text>}
            {txStatus === TX_STATUSES.PENDING_METAMASK && <Text mt={4}>Please confirm transaction on Metamask</Text>}
            {txStatus === TX_STATUSES.PENDING_ETH_TX && <Text mt={4}>Waiting for transaction to be confirmed</Text>}
            {txStatus === TX_STATUSES.PENDING_COMPLETION && <Text mt={4}>Unwrapping</Text>}
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent="space-between"
          >
            {success 
              ? (<Button onClick={() => setModalOpen(false)} width="100%">Close</Button>) 
              : (
                <>
                  <Button.Outline onClick={() => setModalOpen(false)}>Cancel</Button.Outline>
                  <Flex
                    px={4}
                    py={3}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Loader />
                    <Text ml={1}>Waiting</Text>
                  </Flex>
                </>
              )}
            
          </Flex>
        </Card>
      </Modal>
    </>
  )
}
 
export default Unwrap;