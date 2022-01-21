module.exports = {
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
  SCAN_LINK: process.env.REACT_APP_ETHERSCAN_URL,
  NETWORK: {
    NAME: process.env.REACT_APP_NETWORK_NAME,
    SYMBOL: process.env.REACT_APP_NETWORK_SYMBOL,
    ID: process.env.REACT_APP_NETWORK_ID,
  },
  NFT_NAME: process.env.REACT_APP_NFT_NAME,
  SYMBOL: process.env.REACT_APP_NFT_SYMBOL,
  MAX_SUPPLY: process.env.REACT_APP_NFT_MAX_SUPPLY,
  WEI_COST: process.env.REACT_APP_WEI_COST,
  DISPLAY_COST: process.env.REACT_APP_DISPLAY_COST,
  GAS_LIMIT: process.env.REACT_APP_GAS_LIMIT,
  MARKETPLACE: process.env.REACT_APP_MARKETPLACE_NAME,
  MARKETPLACE_LINK: process.env.REACT_APP_OPENSEA_URL,
  SHOW_BACKGROUND: true,
  MAX_TRANSACTION: process.env.REACT_APP_MAX_TRANSACTION,
};
