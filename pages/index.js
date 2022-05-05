import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "./components/banner/banner";
import Image from "next/image";

import Card from "./components/card/card";
import { fetchCoffeStores } from "../lib/coffee-Stores";
import useTrackLocation from "../hooks/useTrackLocation";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeStores();

  return {
    props: { coffeeStores },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState("");

  const { dispatch, state } = useContext(StoreContext);

  const { nearByCoffeeStores, latLong } = state;

  useEffect(() => {
    async function nearByCoffeeStores() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );

          const coffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { nearByCoffeeStores: coffeeStores },
          });
          } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }
    nearByCoffeeStores();
  }, [latLong, dispatch]);

  function HandleOnBannerButtonClick() {
    handleTrackLocation();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating...." : "View stores nearby"}
          handleOnClick={HandleOnBannerButtonClick}
        />

        {locationErrorMsg && <p>Somthing Went Wrong : {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Somthing Went Wrong : {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="A illistration of a woman drinking coffee"
          />
        </div>

        {nearByCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me </h2>

            <div className={styles.cardLayout}>
              {nearByCoffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    name={coffeeStore.name}
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores </h2>

            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    name={coffeeStore.name}
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}