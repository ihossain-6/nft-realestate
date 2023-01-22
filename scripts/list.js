const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const realEstate = await ethers.getContract("RealEstate", deployer)
    const nft = await ethers.getContract("NFT", deployer)

    console.log(`Found Real Estate at ${realEstate.address}`)

    console.log("Listing.....")

    const id = 2
    const tokenId = id.toString()
    const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // for hardhat localhost
    const buyer = accounts[1]
    const inspector = accounts[2]
    const price = ethers.utils.parseEther("0.1").toString()
    const escrowAmount = ethers.utils.parseEther("0.01").toString()
    const tokenURI = "https://ipfs.io/ipfs/QmPwp5kCCtCt5HVoeXx9WSCvsRyRTv8U2oDcyNX4eq2A6G?filename=Metadata2.json"

    console.log("Transaction beginning....")

    //const address = "0x9f44dC0085f74Ee4C2319bFeB552CF0268C00122"

    const approve = await nft.setApprovalForAll(realEstate.address, true)
    await approve.wait(1)

    console.log("We will now move to listing the nft....")

      listTx = await realEstate.list(
        tokenId,
        nftAddress,
        buyer.address,
        inspector.address,
        price,
        escrowAmount,
        tokenURI,
        {gasLimit: 30000000},
    )
    listTx.wait(1)

    console.log("Listed....")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })