import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Field, Text, Icon, Input, Button, Modal, Loader } from 'rimble-ui';

import Clipboard from '../../utilities/components/CopyToClipboard';
import AmountInput from '../AmountInput';

const WFIL_ADDRESS = process.env.REACT_APP_FIL_WALLET;

const Unwrap = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ amount: '', destination: '', origin: '' });

  const onWrapValueChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleWrap = () => {
    const { amount, destination, origin } = formData;
    console.log("UNWRAPPPP!!", amount, destination, origin)
    if (amount > 0) {
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
              name="origin"
              onChange={onWrapValueChange}
              placeholder="Wallet to receive FIL"
              required={true}
              type="text"
              value={formData.origin}
              width="100%"
            />
          </Field>
        </Box>
        <Box px={4}>
          <Button onClick={handleWrap} width="100%">UNWRAP</Button>
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
            <Heading.h3>Wrapping FIL into WFIL</Heading.h3>
            <Text mt={4}>Send {formData.amount} to:</Text>
            <Clipboard text={WFIL_ADDRESS}>
              {isCopied => (
                <Box
                  color={'inherit'}
                  position={'relative'}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Input
                    readOnly
                    value={WFIL_ADDRESS}
                    width={1}
                    p={'auto'}
                    pl={3}
                    pr={'5rem'}
                    fontWeight={3}
                  />
                  <Button
                    size={'small'}
                    width={'4rem'}
                    mx={2}
                    position={'absolute'}
                    right={0}
                  >
                    {!isCopied ? 'Copy' : <Icon name={'Check'} />}
                  </Button>
                </Box>
              )}
            </Clipboard>
          </Box>

          <Flex
            px={4}
            py={3}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent="space-between"
          >
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
            
          </Flex>
        </Card>
      </Modal>
    </>
  )
}
 
export default Unwrap;