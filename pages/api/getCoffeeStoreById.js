import { findCoffeeStoreRecords } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (id) {
        //finding a record by id and returning it if found
        try {
          const foundRecord = await findCoffeeStoreRecords(id);

          if (foundRecord.length === 0) {
            res.status(404).json({ message: "Id Not Found" });
            return; //in order to avoid error "Cannot set headers after they are sent to the client"
          }
          res.status(200).json(foundRecord);
        } catch (error) {
          console.log("Error Finding Store : ", error);
          res.json({ message: "Error Finding Store" });
        }
      } else {
        //if i did not find the id in the air table
        res.status(400);
        res.json({ message: "id is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "something went wrong", error });
    }
  } else {
    // we only want to support GET http requests
    res.status(405);
    res.json({ message: "Invalid request type" });
  }
};

export default getCoffeeStoreById;
