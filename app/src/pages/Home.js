import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Field, Text } from 'rimble-ui';

import MainLayout from '../components/layouts';

const Tab = styled(Box)`
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary};
`;

const Input = styled.input`
  width: 100%;
  border: 0px solid transparent;
  outline: none;
  font-size: 52px;
  text-align: center;
  color: ${props => props.theme.colors.primary};

  ::-webkit-input-placeholder { /* Edge */
    color: ${props => props.theme.colors['moon-gray']};
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.theme.colors['moon-gray']};
  }

  ::placeholder {
    color: ${props => props.theme.colors['moon-gray']};
  }
`;
const parseAmount = textAmount => Number(textAmount.replace(/ FIL/, ''));

const Home = () => {
  const inputRef = useRef(null);
  const [tab, setTab] = useState('wrap');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      const cursorPosition = amount.length - 4;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [amount]);

  const handleAmountOnChange = (e) => {
    const { value } = e.target;
    const amountNumber = parseAmount(value)
    const inputAmount = !isNaN(amountNumber) && amountNumber > 0 ? `${amountNumber} FIL` : ''
    setAmount(inputAmount);
  }

  console.log(process.env.REACT_APP_FIL_WALLET);

  return (
    <MainLayout>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5} p={0}>
        <Flex>
          <Tab
            p={3}
            width={1 / 2}
            color={tab === 'wrap' ? 'white' : 'primary'}
            bg={tab === 'wrap' ? 'primary' : 'white'}
            onClick={() => setTab('wrap')}
          >
            <Heading as="h3" fontFamily="sansSerif">WRAP</Heading>
          </Tab>
          <Tab
            p={3}
            width={1 / 2}
            color={tab === 'unwrap' ? 'white' : 'primary'}
            bg={tab === 'unwrap' ? 'primary' : 'white'}
            onClick={() => setTab('unwrap')}
          >
            <Heading as="h3" fontFamily="sansSerif">UNWRAP</Heading>
          </Tab>
        </Flex>
        {tab === 'wrap'
         ? (
          <Flex flexDirection="column" alignItems="center">
            <Box px={3} pt={5} pb={3}>
              <Input
                value={amount}
                onChange={handleAmountOnChange}
                type="text"
                placeholder="0.00 FIL"
                ref={inputRef}
                showingPlaceholder={!amount}
              />
            </Box>
          </Flex>
         )
         : (
          <Flex flexDirection="column" alignItems="center">
            <Box p={3}>
              UNWRAP
            </Box>
          </Flex>
         )
        }
      </Card>
    </MainLayout>
  );
}
 
export default Home;
