import fs from "fs";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

function generateMerkleTree(data: Array<string>): MerkleTree {
  const leafNodes = data.map((addr) => keccak256(addr));
  return new MerkleTree(leafNodes, keccak256, { sortPairs: true });
}

const OUT_FILE_PATH = "data/whitelist.json";

async function main() {
  const data = JSON.parse(fs.readFileSync(OUT_FILE_PATH).toString());

  console.log("\n==== Creating Merkle tree and calculating root... ====");
  const tree = generateMerkleTree(data);
  console.log(`0x${tree.getRoot().toString("hex")}`);
  console.log("==== Complete! ====\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
