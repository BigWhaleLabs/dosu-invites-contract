import setMerkleTreeRoot from './setMerkleTreeRoot'

setMerkleTreeRoot().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
