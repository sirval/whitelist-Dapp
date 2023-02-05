import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  useEffect(() => {
    //if wallet is not connected, create a new instance
    //of the Web3Modal and connect the MetaMask Wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      //connectWallet();
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
        <h1 className={styles.title}>Welcome to Crypto Devs!</h1>

        <div className={styles.description}>
          {numOfWhitelisted} have already joined the whitelist
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
