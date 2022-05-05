import Airtable from "airtable";

//connecting to air table
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

//we only caire about the feilds property from the api response so we need a function to extract it for us
const getMinifiedRecords = (records) => {
  return records.map((record) => {
    return {
      recordId: record.id, // air table id
      ...record.fields,
    };
  });
};

const getMinifiedRecord = (record) => {
  return getMinifiedRecords(record);
};

//finding a record by id and returning it if found
const findCoffeeStoreRecords = async (id) => {
  try {
    const res = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();

    return getMinifiedRecords(res);
  } catch (error) {
    console.error("Error Finding Store : ", error);
    return error;
  }
};

export { table, getMinifiedRecords, getMinifiedRecord, findCoffeeStoreRecords };
