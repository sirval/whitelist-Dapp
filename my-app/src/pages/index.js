import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import Swal from "sweetalert2";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxWhitelistedAddress, setMaxWhitelistedAddress] = useState(50);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    //check if signers network is goerli
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      Swal.fire({
        title: "warning",
        text: "Unknown network detected. Connect with Goerli Eth Testnet",
      });

      throw new Error("Change network to Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  //button to join the whitelist
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            <br />
            <h3 style={{ color: "#40C298" }}>
              Thanks for joining the whitelist!
            </h3>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button
            style={{ backgroundColor: "#7928C9" }}
            onClick={addAddressToWhitelist}
            className={styles.button}
          >
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button
          style={{ backgroundColor: "#BA513D" }}
          className={styles.button}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      );
    }
  };

  //add address to whitelist on button clicked
  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      //wait for transaction to be mined
      await tx.wait();
      setLoading(false);
      //get total number whitelisted
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.error(error);
    }
  };

  //check if address id whitelisted
  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      //get address of signer
      const address = await signer.getAddress();
      //get addresses that has been whitelisted
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  };

  //get number of whitelisted addresses from the contract
  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfwhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numberOfwhitelisted);
    } catch (error) {
      console.error(error);
    }
  };

  //connect wallet
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //if wallet is not connected, create a new instance
    //of the Web3Modal and connect the MetaMask Wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numOfWhitelisted}/{maxWhitelistedAddress} have already joined the
            whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <Image
            width={500}
            height={500}
            src="./crypto-devs.svg"
            alt="home-image"
            priority
          />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &nbsp; <i style={{ color: "red" }}> &#10084; </i>{" "}
        &nbsp;&nbsp;by Ikenna Val
      </footer>
    </div>
  );
}
