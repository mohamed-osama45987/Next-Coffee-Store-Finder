import {
  table,
  getMinifiedRecords,
  findCoffeeStoreRecords,
} from "../../lib/airtable";



const createRecord = async (
  id,
  name,
  address,
  neighbourhood,
  voting,
  imgUrl
) => {
  const createdRecord = await table.create([
    {
      //because the key matched the value it is better to write it once
      fields: {
        id,
        name,
        address,
        neighbourhood,
        voting,
        imgUrl,
      },
    },
  ]);

  const data = getMinifiedRecords(createdRecord);

  return data;
};

const createCoffeeStore = async (req, res) => {
  let { method } = req;

  let { id, name, address, neighbourhood, voting, imgUrl } = req.body; //in order to process the request these properties must exit in the body of it

  if (method === "POST") {
    //since id and name is a must feilds so we dont need to do any thing if they are not found
    if (!id || !name) {
      res.status(400);
      res.json({ message: "id or name is missing" });
    }

    //first we need to check if the rec is in our air table db retuned if found
    const record = await findCoffeeStoreRecords(id);

    // if there record is not an empty array meaning not found
    if (record.length !== 0) {
      res.json(record);
    } else {
      //if it did not find the record create it

      const records = await createRecord(
        id,
        name,
        address,
        neighbourhood,
        voting,
        imgUrl
      );

      res.json({ records });
    }
  }
};

export default createCoffeeStore;
