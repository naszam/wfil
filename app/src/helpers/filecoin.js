export const formatAddress = (address) => `f${address.slice(1)}`;

export const absoluteAmount = (amount) => (amount * 1000000000000000000).toString();
export const friendlyAmount = (amount) => (amount / 1000000000000000000).toFixed(4);