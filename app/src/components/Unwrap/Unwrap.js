import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Box, Card, Heading, Field, Text, Icon, Input, Button, Modal, Loader } from 'rimble-ui';

import AmountInput from '../AmountInput';
import { checkTransactionStatus, askForUnwrap } from '../../services/api';
import { sendUnwrapTransaction } from '../../services/web3';

const INTERVAL_CHECK = 5000;
let intervalHandler = null;
const TX_STATUSES = {
  PENDING_COMPLETION: 'pending-completion',
  PENDING_ETH_TX: 'pending-eth-tx',
  PENDING_METAMASK: 'pending-metamask',
  SUCCESS: 'success'
}

const Unwrap = ({ contractMethodSendWrapper, account: origin }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: ''});
  const [success, setSuccess] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const { account } = useSelector(state => state.web3);

  const onWrapValueChange = ({ target }) => {
    const { name, value } = target;
    console.log("onWrapValueChange -> name, value ", name, value )
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleUnWrap = async () => {
    const { amount, destination } = formData;
    console.log("UNWRAPPPP!!", amount, destination, origin)
    if (amount > 0) {
      const filAmount = amount.replace(',', '.');
      const { success, data } = await askForUnwrap({ origin, amount: filAmount, destination });
      
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
      // contractMethodSendWrapper(
      //   "unwrap",
      //   destination,
      //   filAmountAbs,
      //   (txStatus, transaction) => {
      //     console.log("incrementCounter callback: ", txStatus, transaction);
      //     if (
      //       txStatus === "confirmation" &&
      //       transaction.status === "success"
      //     ) {
      //       intervalHandler && clearInterval(intervalHandler);
      //       intervalHandler = setInterval(async() => {
      //         const { success: statusSuccess, data: dataTransaction } = await checkTransactionStatus(transactionId);
      //         console.log("intervalHandler -> success", statusSuccess, dataTransaction)
      //         if (statusSuccess && dataTransaction && dataTransaction.status === 'success') {
      //           setSuccess(true);
      //           clearInterval(intervalHandler);
      //         }
      //       }, INTERVAL_CHECK);
      //     }
      //   }
      // );
      setModalOpen(true)
    }
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="stretch" py={4}>
        <Box px={3} pt={2} pb={3} mb={2}>
          <AmountInput
            name="amount"
            onChange={onWrapValueChange}
            unit="WFIL"
            value={formData.amount ? `${formData.amount} WFIL` : ''}
          />
        </Box>
        <Box px={4} mb={2}>
          <Field label="FIL Address" fontFamily="sansSerif" width="100%" color="primary">
            <Input
              name="destination"
              onChange={onWrapValueChange}
              placeholder="Wallet to receive FIL"
              required={true}
              type="text"
              value={formData.destination}
              width="100%"
            />
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