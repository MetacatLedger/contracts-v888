const BN = web3.utils.BN
const Exchange = artifacts.require("FakeExchange")
const WBTC = artifacts.require("FakeWBTC")
const HEGIC = artifacts.require("FakeHEGIC")
const PriceProvider = artifacts.require("FakePriceProvider")
const BTCPriceProvider = artifacts.require("FakeBTCPriceProvider")
const ETHOptions = artifacts.require("HegicETHOptions")
const WBTCOptions = artifacts.require("HegicWBTCOptions")
const ETHPool = artifacts.require("HegicETHPool")
const ERCPool = artifacts.require("HegicERCPool")
const StakingETH = artifacts.require("HegicStakingETH")
const StakingWBTC = artifacts.require("HegicStakingWBTC")
const ETHRewards = artifacts.require("HegicETHRewards")
const WBTCRewards = artifacts.require("HegicWBTCRewards")
const BC = artifacts.require("LinearBondingCurve")

const params = {
    ETHPrice: new BN(380e8),
    BTCPrice: new BN("1161000000000"),
    ExchangePrice: new BN(30e8),
    BC:{
        k: new BN("100830342800"),
        startPrice: new BN("69000000000000")
    }
}

module.exports = async function (deployer, network) {
    if (["development", "develop", 'soliditycoverage'].indexOf(network) >= 0) {
      await deployer.deploy(WBTC)
      await deployer.deploy(HEGIC)
      await deployer.deploy(ETHPool)
      await deployer.deploy(BC, HEGIC.address, params.BC.k, params.BC.startPrice)
      await deployer.deploy(Exchange, WBTC.address, params.BTCPrice)
      await deployer.deploy(PriceProvider, params.ETHPrice)
      await deployer.deploy(BTCPriceProvider, params.BTCPrice)

      await deployer.deploy(StakingWBTC, HEGIC.address, WBTC.address)
      await deployer.deploy(StakingETH, HEGIC.address)

      await deployer.deploy(ETHOptions,
          PriceProvider.address,
          StakingETH.address
      )
      await deployer.deploy(WBTCOptions,
          BTCPriceProvider.address,
          Exchange.address,
          WBTC.address,
          StakingWBTC.address
      )
      await deployer.deploy(ETHRewards, ETHOptions.address, HEGIC.address)
      await deployer.deploy(WBTCRewards, WBTCOptions.address, HEGIC.address)

  } else {
      throw Error(`wrong network ${network}`)
  }
}