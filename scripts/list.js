const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const realEstate = await ethers.getContract("RealEstate", deployer)

    console.log(`Found Real Estate at ${realEstate.address}`)

    console.log("Listing.....")

    const tokenId = 1
    const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // for hardhat localhost
    //const nftAddress = "0x84968B18d9C1D066E82956d1b3D85153FCABF077" // for goerli
    const buyer = "0x7Be78eB893A2ab0B07251B0368E92819FC155437"
    const inspector = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const price = ethers.utils.parseEther("0.1").toString()
    const escrowAmount = ethers.utils.parseEther("0.01").toString()
    const tokenURI = "https://ipfs.io/ipfs/QmPwp5kCCtCt5HVoeXx9WSCvsRyRTv8U2oDcyNX4eq2A6G?filename=Metadata2.json"

    console.log("Transaction beginning....")

    listTx = await realEstate.list(
        tokenId,
        nftAddress,
        buyer,
        inspector,
        price,
        escrowAmount,
        tokenURI,
        {gasLimit: 40000000}
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