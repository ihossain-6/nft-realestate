const { assert, expect } = require("chai")
const { network, deployments, ethers, waffle } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RealEstate", () => {
          let deployer
          let buyer
          let inspector
          const inspectionStatus = false
          const purchasePrice = ethers.utils.parseEther("1").toString()
          const escrowAmount = ethers.utils.parseEther("0.1").toString()
          const tokenURI =
              "https://ipfs.io/ipfs/QmPwp5kCCtCt5HVoeXx9WSCvsRyRTv8U2oDcyNX4eq2A6G?filename=Metadata2.json"
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              buyer = accounts[1]
              inspector = accounts[2]
              await deployments.fixture(["all"])
              realEstate = await ethers.getContract("RealEstate")
              nft = await ethers.getContract("NFT")
              const approve = await nft.setApprovalForAll(realEstate.address, true)
              await approve.wait(1)
          })
          describe("list", function () {
              it("emits an event", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await expect(
                      realEstate.list(
                          tokenId,
                          nft.address,
                          buyer.address,
                          inspector.address,
                          purchasePrice,
                          escrowAmount,
                          inspectionStatus,
                          tokenURI
                      )
                  ).to.emit(realEstate, "Listed")
              })

              it("updates mapping", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const response = await realEstate.getList(tokenId)
                  const restokenId = response.tokenId
                  const resNftAddress = response.nftAddress
                  const resBuyer = response.buyer
                  const resInspector = response.inspector
                  const resPurchasePrice = response.purchasePrice.toString()
                  const resEscrowAmount = response.escrowAmount.toString()
                  const resTokenURI = response.tokenURI
                  assert.equal(tokenId, restokenId)
                  assert.equal(nft.address, resNftAddress)
                  assert.equal(buyer.address, resBuyer)
                  assert.equal(inspector.address, resInspector)
                  assert.equal(purchasePrice, resPurchasePrice)
                  assert.equal(escrowAmount, resEscrowAmount)
                  assert.equal(tokenURI, resTokenURI)
              })
          })

          describe("inspection status", function () {
              it("emits event", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const connected = await realEstate.connect(inspector)
                  await expect(connected.inspectionStatus(tokenId)).to.emit(
                      realEstate,
                      "UpdateInspection"
                  )
              })

              it("updates inspection status", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const connected = await realEstate.connect(inspector)
                  const tx2 = await connected.inspectionStatus(tokenId)
                  await tx2.wait(1)
                  const res = await connected.getList(tokenId)
                  console.log(res)
                  const resStatus = res.inspectionStatus
                  console.log(resStatus.toString())
                  assert.equal("true", resStatus.toString())
              })
          })

          describe("deposit", function () {
              it("reverts if the msg value is less", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const value = ethers.utils.parseEther("0.001")
                  const buyerConnect = await realEstate.connect(buyer)
                  await expect(buyerConnect.deposit(tokenId, { value: value.toString() })).to.be
                      .reverted
              })

              it("reverts if the function is not called by the buyer", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  await expect(
                      realEstate.deposit(tokenId, { value: escrowAmount })
                  ).to.be.revertedWith("YouAreNotBuyer")
              })

              it("emits event", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const buyerConnect = await realEstate.connect(buyer)
                  await expect(buyerConnect.deposit(tokenId, { value: escrowAmount })).to.emit(
                      buyerConnect,
                      "Deposited"
                  )
              })
          })

          describe("finalize", function () {
              it("reverts if the msg value is less", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const buyerConnect = await realEstate.connect(buyer)
                  const value = ethers.utils.parseEther("0.01")
                  await expect(buyerConnect.finalize(tokenId, { value: value.toString() })).to.be
                      .reverted
              })

              it("transfers nft", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const inspectorConnect = await realEstate.connect(inspector)
                  await inspectorConnect.inspectionStatus(tokenId)
                  const buyerConnect = await realEstate.connect(buyer)
                  const value = ethers.utils.parseEther("1.1")
                  console.log(value.toString())
                  await buyerConnect.finalize(tokenId, { value: value.toString() })
                  const owner = await nft.ownerOf(tokenId)
                  assert.equal(owner, buyer.address)
              })
          })

          describe("cancel", async () => {
              it("sends back the money to the buyer", async () => {
                    const tx = await nft.mintToken(deployer.address, tokenURI)
                    await tx.wait(1)
                    const id = await nft.totalSupply()
                    const tokenId = id.toString()
                    console.log(tokenId)
                  await realEstate.list(
                      tokenId,
                      nft.address,
                      buyer.address,
                      inspector.address,
                      purchasePrice,
                      escrowAmount,
                      inspectionStatus,
                      tokenURI
                  )
                  const buyerConnect = await realEstate.connect(buyer)
                  const startingRealEstateBalance = await buyerConnect.provider.getBalance(
                      buyerConnect.address
                  )
                  console.log(`Starting balance: ${startingRealEstateBalance.toString()}`)
                  await buyerConnect.deposit(tokenId, { value: escrowAmount })
                  await buyerConnect.cancel(tokenId)
                  const endingRealEstateBalance = await buyerConnect.provider.getBalance(
                      buyerConnect.address
                  )
                  console.log(`Ending balance: ${endingRealEstateBalance.toString()}`)
                  assert.equal(
                      startingRealEstateBalance.toString(),
                      endingRealEstateBalance.toString()
                  )
              })
          })
      })
