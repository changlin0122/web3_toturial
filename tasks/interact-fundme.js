const { task } = require("hardhat/config");

task("interact-fundme", "interact with fundme contract")
  .addParam("addr", "Fundme Contract Address")
  .setAction(async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);

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
  });

module.exports = {};
