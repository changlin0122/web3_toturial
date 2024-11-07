// import ethers.js
// creat main function
// init 2 account
// fund contract with first account
// check balance of contract
// fund contract with second accounr
// check balance of contract
// check mapping
// execute main function

const { ethers } = require("hardhat");

async function main() {
  // create factory
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("contract deploying...");
  // deploy contract from factory
  const fundMe = await fundMeFactory.deploy(300);
  await fundMe.waitForDeployment();
  console.log(
    `contract has been deployed successfully, contract address is  
      ${fundMe.target}`
  );

  // verify fundme
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for 5 confirmations!");
    await fundMe.deploymentTransaction().wait(5);
    await verifyFundMe(fundMe.target, [300]);
  } else {
    console.log("Verification skipped...");
  }

  // init 2 account
  const [firstAccount, secondAccount] = await ethers.getSigners();

  // fund contract with first account
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.05") });
  await fundTx.wait();

  // check balance of contract
  const blanceOfContract = await ethers.provider.getBalance(fundMe.target);
  console.log(`Balance of contract is ${blanceOfContract}`);

  // fund contract with second accounr
  const fundTxWithSecondAccount = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.05") });
  await fundTxWithSecondAccount.wait();

  // check balance of contract
  const blanceOfContractAfterSecondFund = await ethers.provider.getBalance(
    fundMe.target
  );
  console.log(`Balance of contract is ${blanceOfContractAfterSecondFund}`);

  // check mapping
  const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(
    firstAccount.address
  );
  const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(
    secondAccount.address
  );
  console.log(`Balance of first account is ${firstAccountBalanceInFundMe}`);
  console.log(`Balance of second account is ${secondAccountBalanceInFundMe}`);
}

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
