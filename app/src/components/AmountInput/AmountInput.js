import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

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

const UNITS_REGEX = {
  FIL: / FIL/,
  ETH: / ETH/
}

const AmountInput = ({ name, onChange, unit, value }) => {
  const inputRef = useRef(null);
  const parseAmount = textAmount => textAmount.replace(UNITS_REGEX[unit], '');

  useEffect(() => {
    if (inputRef.current) {
      const cursorPosition = String(value).length - 4;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [value, inputRef]);

  const handleAmountOnChange = (e) => {
    const { value } = e.target;
    const amountNumber = parseAmount(value);
    onChange({ target: { name, value: amountNumber } });
  }

  return (
    <Input
      value={value}
      onChange={handleAmountOnChange}
      type="text"
      placeholder={`0.00 ${unit}`}
      ref={inputRef}
      showingPlaceholder={!value}
    />
  )
}
 
export default AmountInput;