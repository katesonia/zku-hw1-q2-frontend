import { useState } from 'react';
import {ethers} from 'ethers';
import './App.css';
import contract from './contracts/MerkleNftV2.json';

const contractAddr = "0x02B3E0e4aC90c711c0e96114f3f090B61D268FAD";
const abi = contract.abi;
const {ethereum} = window;

// Connect wallet if not connected, return the wallet address.
const getWalletAddr = async () => {
  if (!ethereum) {
    return null;
  }

  // Get current connected addresses.
  const accounts = await ethereum.request({method: 'eth_accounts'});
  if (accounts.length > 0) {
    console.log("Found an account! Address: ", accounts[0]);
    return accounts[0];
  } else {
    console.log("No authorized account found");
  }
}


function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  // Set account to already connected user if any.
  getWalletAddr().then((addr) => {setCurrentAccount(addr)});
  
  const connectWalletHandler = async () => { 
    if (!ethereum) {
      alert("Please install Metamask!"); 
      return;
    }
  
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }
  
  const mintNftHandler = async () => { 
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddr, abi, signer);

      let nftTxn = await nftContract.mint(signer.getAddress(), "nft");

      console.log("Mining... please wait");
      await nftTxn.wait();

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    } catch (err) {
      console.log(err);
    }

  }
  
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
  
  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  return (
    <div className='main-app'>
      <h1>Merkle tree nft</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
