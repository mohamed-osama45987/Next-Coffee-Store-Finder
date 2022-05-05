import {
  findCoffeeStoreRecords,
  table,
  getMinifiedRecords,
} from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  const { id } = req.body;

  if (req.method === "PUT") {
    if (id) {
      //finding a record by id and returning it if found
      try {
        const foundRecord = await findCoffeeStoreRecords(id);

        if (foundRecord.length === 0) {
          res.status(404).json({ message: "Id Not Found" });
          return; //in order to avoid error "Cannot set headers after they are sent to the client"
        }

        const record = foundRecord[0];

        const calcVoting = parseInt(record.voting) + 1; //to increment the voting field value

        //saving the incremented version of voting to the air table DB

        const updateRecord = await table.update([
          {
            id: record.recordId,
            fields: {
              voting: calcVoting, //incremeted voting value
            },
          },
        ]);

        if (updateRecord) {
          const miniRecord = getMinifiedRecords(updateRecord);
          res.json(miniRecord);
          return;
        }

        return;
      } catch (error) {
        console.log("Error Finding Store : ", error);
        res.json({ message: "Error Finding Store" });
        return;
      }
    } else {
      //if i did not find the id in the air table
      res.status(400);
      res.json({ message: "Could Not Find The Store" });
      return;
    }
  }

  // we only want to support PUT method
  res.status(405).json({ Message: "Method Not Allowed" });
  return;
};

export default upvoteCoffeeStoreById;
