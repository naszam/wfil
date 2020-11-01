const LOCAL_STORAGE_KEY = 'wfil_wallet_v0.1';

export function getWallet() {
  const lsData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return lsData ? JSON.parse(lsData) : null;
}

export function saveWallet(wallet) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallet));
}
