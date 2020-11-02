import axios from 'axios';

const BASE_URL = 'https://hyh3zeh3t7.execute-api.eu-west-3.amazonaws.com';

const parseResponse = (success, data, message) => {
  return {
    success,
    data,
    message
  }
}

export async function createWallet() {
  try {
    const result = await axios.post(`${BASE_URL}/wallet`);
    console.log("createWallet -> result", result);
    const { privateKey, address } = result.data;
    return parseResponse(true, { privateKey, address }, '');
  } catch (error) {
    console.log("createWallet -> error", error)
    return parseResponse(false); 
  }
}

export async function getBalance(address) {
  try {
    const result = await axios.get(`${BASE_URL}/wallet/balance?address=${address}`);
    return parseResponse(true, result.data, '');
  } catch (error) {
    console.log("getBalance -> error", error)  
    return parseResponse(false);  
  }
}

export async function sendFil(from, to, value) {
  try {
    const result = await axios.post(`${BASE_URL}/wallet/send`,{ from, to, value });
    console.log("sendFil -> result", result);
    return parseResponse(true, true, '');
  } catch (error) {
    console.log("sendFil -> error", error)
    return parseResponse(false);
  }
}

export async function askForWrap({origin, amount, destination}) {
  try {
    const result = await axios.post(`${BASE_URL}/wrap`, { origin, amount, destination });
    console.log("askForWrap -> result", result);
    return parseResponse(true, { id: result.data.data });
  } catch (error) {
    console.log("askForWrap -> error", error)
    return parseResponse(false); 
  }
}
export async function askForUnwrap({origin, amount, destination}) {
  try {
    const result = await axios.post(`${BASE_URL}/unwrap`, { origin, amount, destination });
    console.log("askForUnwrap -> result", result);
    return parseResponse(true, { id: result.data.data });
  } catch (error) {
    console.log("askForWrap -> error", error)
    return parseResponse(false); 
  }
}

export async function checkTransactionStatus(id) {
  try {
    const result = await axios.get(`${BASE_URL}/transaction/${id}`);
    console.log("checkTransactionStatus -> result", result);
    return parseResponse(true, { ...result.data.data });
  } catch (error) {
    console.log("askForWrap -> error", error)
    return parseResponse(false); 
  }
}

export async function checkEthTransaction({amount, destination}) {
  try {
    return parseResponse(true, { tx: '0x467ad41d3df2441bde10f0f5e4c7f52f94e5d2abe105ec47644f5cf4e725032a' });
    // const query = `amount=${amount}&destination=${destination}`;
    // const result = await axios.get(`${BASE_URL}/unwrap?${query}`);
    // console.log("checkEthTransaction -> result", result);
    // const { tx } = result.data;
    // return parseResponse(true, { tx });
  } catch (error) {
    console.log("checkEthTransaction -> error", error)
    return parseResponse(false); 
  }
}