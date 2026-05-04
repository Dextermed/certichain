import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ALCHEMY_RPC_URL } from './constants';

export const CONTRACT_ABI = [
  "function ministry() view returns (address)",
  "function registerUniversity(address _universityAddress, string _universityId, string _name) external",
  "function revokeUniversity(address _universityAddress) external",
  "function issueDiploma(string _universityId, string _studentId, string _cid, bytes32 _diplomaHash) external returns (bytes32)",
  "function batchIssueDiplomas(string[] _universityIds, string[] _studentIds, string[] _cids, bytes32[] _diplomaHashes) external returns (bytes32[])",
  "function revokeDiploma(bytes32 _diplomaId) external",
  "function verifyDiploma(bytes32 _diplomaId) view returns (string universityId, string studentId, string cid, bytes32 diplomaHash, uint8 status, uint256 issuedAt, address issuedBy)",
  "function isUniversityAuthorized(address _addr) view returns (bool)",
  "function getUniversity(address _addr) view returns (tuple(string universityId, string name, bool isAuthorized, uint256 registeredAt))",
  "function getUniversityCount() view returns (uint256)",
  "function getMinistry() view returns (address)",
  "function universityAddresses(uint256) view returns (address)",
  "event UniversityRegistered(address indexed universityAddress, string universityId, string name)",
  "event UniversityRevoked(address indexed universityAddress)",
  "event DiplomaIssued(bytes32 indexed diplomaId, string universityId, string studentId, string cid)",
  "event DiplomaRevoked(bytes32 indexed diplomaId)",
  "event DiplomaBatchIssued(bytes32[] diplomaIds)",
] as const;

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
}

export function getContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export async function getContractWithSigner(): Promise<{
  contract: ethers.Contract;
  signer: ethers.Signer;
}> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return { contract, signer };
}

export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
}

export async function switchToSepolia(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    }
  }
}
