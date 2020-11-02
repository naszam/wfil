import React, { useState } from 'react';
import { Flex, Box, Card, Heading, Field, Text, Icon, Input, Button, Modal, Loader } from 'rimble-ui';

import AmountInput from '../AmountInput';
import { checkTransactionStatus, askForUnwrap } from '../../services/api';

const INTERVAL_CHECK = 5000;
let intervalHandler = null;

const Unwrap = ({ contractMethodSendWrapper, account: origin }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: ''});
  const [success, setSuccess] = useState(false);

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
      
      contractMethodSendWrapper(
        "unwrap",
        destination,
        filAmountAbs,
        (txStatus, transaction) => {
          console.log("incrementCounter callback: ", txStatus, transaction);
          if (
            txStatus === "confirmation" &&
            transaction.status === "success"
          ) {
            intervalHandler && clearInterval(intervalHandler);
            intervalHandler = setInterval(async() => {
              const { success: statusSuccess, data: dataTransaction } = await checkTransactionStatus(transactionId);
              console.log("intervalHandler -> success", statusSuccess, dataTransaction)
              if (statusSuccess && dataTransaction && dataTransaction.status === 'success') {
                setSuccess(true);
                clearInterval(intervalHandler);
              }
            }, INTERVAL_CHECK);
          }
        }
      );
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
            <Heading.h3>UnWrapping WFIL into FIL</Heading.h3>
            {success 
              ? (<Text mt={4}>Success</Text>)
              : (<Text mt={4}>Please confirm transaction on Metamask</Text>)
            }
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