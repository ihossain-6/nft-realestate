const {network} = require("hardhat")
const {developmentChains} = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
require("dotenv").config

module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()

    log("Deploying Real Estate....")

    const arguments = []

    const realEstate = await deploy("RealEstate", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`Student Registration deployed at ${realEstate.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(realEstate.address, arguments)
    }
}

module.exports.tags = ["all", "realEstate"]
