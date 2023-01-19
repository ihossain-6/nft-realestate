const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const nft = await ethers.getContract("NFT", deployer)

    console.log(`Found NFT at ${nft.address}`)

    console.log("Minting your NFT.....")

    const address = "0x9f44dC0085f74Ee4C2319bFeB552CF0268C00122"
    const metadataURI = "https://ipfs.io/ipfs/QmPwp5kCCtCt5HVoeXx9WSCvsRyRTv8U2oDcyNX4eq2A6G?filename=Metadata2.json"

    const mintTx = await nft.mintToken(address, metadataURI)
    await mintTx.wait(1)

    console.log("NFT minted....")
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })