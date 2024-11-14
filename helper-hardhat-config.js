const DECIMAL = 8;
const INITIAL_ANSWER = 300000000000;
const devlopmentChains = ["hardhat", "local"];
const LOCK_TIME = 180;
const CONFRIMATIONS = 5;

const networkConfig = {
  11155111: {
    ethUsdDataFeed: "0x694aa1769357215de4fac081bf1f309adc325306",
  },
};

module.exports = {
  DECIMAL,
  INITIAL_ANSWER,
  devlopmentChains,
  networkConfig,
  LOCK_TIME,
  CONFRIMATIONS,
};
