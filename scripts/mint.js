const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const nft = await ethers.getContract("NFT", deployer)

    console.log(`Found NFT at ${nft.address}`)

    console.log("Minting your NFT.....")

    console.log(deployer.address)

    const address = deployer.address
    const metadataURI = "https://ipfs.io/ipfs/QmPwp5kCCtCt5HVoeXx9WSCvsRyRTv8U2oDcyNX4eq2A6G?filename=Metadata2.json"

    const mintTx = await nft.mintToken(address, metadataURI)
    await mintTx.wait(1)

    const total = await nft.totalSupply()
    console.log(total.toString())

    console.log("NFT minted....")
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })