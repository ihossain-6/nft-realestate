const {network} = require("hardhat")
const {developmentChains} = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
require("dotenv").config

module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()

    log("Deploying NFT....")

    const arguments = ["REAL-ESTATE-NFT", "REN"]

    const nft = await deploy("NFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`NFT deployed at ${nft.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(nft.address, arguments)
    }
}

module.exports.tags = ["all", "nft"]
