import { NextPage } from "next";
import Head from "next/head";
import styles from "../src/styles/pages/index.module.css";
import { IPageProps } from "./_app";

const Home: NextPage<IPageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
      
      </div>
    </>
  );
};

export default Home;
