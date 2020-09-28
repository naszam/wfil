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
    const { token, address } = result.data;
    return parseResponse(true, { token, address }, '');
  } catch (error) {
    console.log("createWallet -> error", error)
    return parseResponse(false); 
  }
}

export async function getBalance(address) {
  try {
    const result = await axios.get(`${BASE_URL}/wallet/balance?address=${address}`);
    console.log("getBalance -> result", result);
    const { balance } = result.data;
    return parseResponse(true, balance, '');
  } catch (error) {
    console.log("getBalance -> error", error)  
    return parseResponse(false);  
  }
}

export async function sendFil(token, amount, destination) {
  try {
    const result = await axios.post(`${BASE_URL}/wallet/send`,{ token, amount, destination });
    console.log("sendFil -> result", result);
    return parseResponse(true, true, '');
  } catch (error) {
    console.log("sendFil -> error", error)
    return parseResponse(false);
  }
}

export async function checkFilTransaction({origin, amount, destination}) {
  try {
    const query = `origin=${origin}&amount=${amount}&destination=${destination}`;
    const result = await axios.get(`${BASE_URL}/transaction?${query}`);
    console.log("checkFilTransaction -> result", result);
    const { tx } = result.data;
    return parseResponse(true, { tx });
  } catch (error) {
    console.log("checkFilTransaction -> error", error)
    return parseResponse(false); 
  }
}
export async function checkEthTransaction({amount, destination}) {
  try {
    const query = `amount=${amount}&destination=${destination}`;
    const result = await axios.get(`${BASE_URL}/unwrap?${query}`);
    console.log("checkFilTransaction -> result", result);
    const { tx } = result.data;
    return parseResponse(true, { tx });
  } catch (error) {
    console.log("checkFilTransaction -> error", error)
    return parseResponse(false); 
  }
}