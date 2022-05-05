//basic api setup for both unsplash and foursquare api 
// init  unsplash api
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getCoffeeStoreUrl = (latLong, query, limit = 8) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  // for images
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });

  let unsplashImageResults = photos.response.results;

  let imagesUrls = unsplashImageResults.map((image) => {
    return image.urls.small;
  });

  return imagesUrls;
};

export const fetchCoffeStores = async (latLong = "43.6540,-79.3800") => {
  //to get images

  const photos = await getListOfCoffeeStorePhotos();

  // for stores text data (address, name, rating )
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_Authrization,
    },
  };
  let response = await fetch(
    getCoffeeStoreUrl(latLong, "coffe-shops", 7),
    options
  );

  let myData = await response.json();

  return myData.results.map((store, idx) => {
    return {
      // ...store,
      id: store.fsq_id,
      address: store.location.address || "",
      name: store.name,
      neighborhood:
        store.location.neighborhood || store.location.cross_street || "",
      imgUrl: photos[idx],
    };
  });
};
