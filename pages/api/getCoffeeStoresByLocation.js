//loads the defulat coffee stores from api
import { fetchCoffeStores } from "../../lib/coffee-Stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;

    const response = await fetchCoffeStores(latLong, limit);

    res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: `Oh No an error happened: ${error}` });
  }

  //   return
};

export default getCoffeeStoresByLocation;
