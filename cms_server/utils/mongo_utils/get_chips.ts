const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')
import { chip, api_return_schema } from "../../interfaces/interfaces"

async function get_chips(): Promise<api_return_schema<chip[]>> {

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)

    try {
      const chip_search_result: chip[] = await Chip(connection).find();
      return {data: chip_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

async function get_chip(inName: string) {

    // console.log("getting chip with name", inName)

    // const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    // try {
    //     const chips = await Chip(connection).find({name: inName});
    //     console.log("found chips", inName)
    //     return chips
    // } catch (error) {
    //     console.error('Error:', error);
    //     return 'Internal server error'
    // }
}

module.exports = {
    get_chips,
    get_chip
};
