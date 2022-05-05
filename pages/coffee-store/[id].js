import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";
import { fetchCoffeStores } from "../../lib/coffee-Stores"; //talks to api to get a list of defulat coffee stores
import styles from "./coffee-store.module.css";
import IsEmpty from "../../lib/IsEmpty"; //a function that return true if object does not contain id property wich means its empty

import { StoreContext } from "../../store/store-context"; //global store context

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStoresData = await fetchCoffeStores();

  const coffeeStore = coffeeStoresData.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: coffeeStore || {},
    },
  };
}

export async function getStaticPaths() {
  let coffeeStoresData = await fetchCoffeStores();

  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return { paths, fallback: true };
}

export default function ID(props) {
  const router = useRouter();
  const id = router.query.id;

  // save to db (air table) when the context is updated

  const handleCreatCoffeeStore = async (contextCoffeeStore) => {
    const { id, name, address, neighbourhood, imgUrl } = contextCoffeeStore;

    try {
      const res = await fetch("../api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name,
          address: address || "",
          neighbourhood: neighbourhood || "",
          voting: 0,
          imgUrl,
        }),
      });

      const savedData = await res.json();
      return savedData;
    } catch (err) {
      console.log(err);
    }
  };

  const { state } = useContext(StoreContext); //global state set inside the context
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore);
  // for setting the coffeeStore ( aka. data source ) from either the context or the props depends on the user choosen store
  useEffect(() => {
    if (IsEmpty(props.coffeeStore)) {
      const contextCoffeeStore = state.nearByCoffeeStores.find(
        (coffeeStore) => {
          return coffeeStore.id.toString() === id;
        }
      );
      setCoffeeStore(contextCoffeeStore); // client side render if the store is in the context of the client
      //if you accessed the coffee store from context we save it in our air table data base
      handleCreatCoffeeStore(contextCoffeeStore);
    } else {
      //SSG storing its value in our air table when you access it
      handleCreatCoffeeStore(props.coffeeStore);
    }
  }, [id, props, props.coffeeStore, state]);

  // geting data from our db if the user has the link only or refreshed the page

  const [votes, setVotes] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotes(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Something Went Wrong</div>;
  }

  if (router.isFallback) {
    return <div>Loading.....</div>;
  }

  // destructuring the data we get from our Api or from the context depending on the context data
  const { address, neighborhood, name, imgUrl } = coffeeStore;

  const handleUpvoteButton = async () => {
    try {
      const res = await fetch("../api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const savedData = await res.json();

      if (savedData && savedData.length > 0) {
        //inctement only if it is successfuly incremeted in our DB
        setVotes(votes++);
      }

      return savedData;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title> {name} </title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a> ← Back to Home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={`A photo of ${name} coffee store `}
          ></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={24}
              alt="small svg"
            ></Image>
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width={24}
                height={24}
                alt="small svg"
              ></Image>
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt="small svg"
            ></Image>
            <p className={styles.text}>{votes}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote !
          </button>
        </div>
      </div>
    </div>
  );
}
