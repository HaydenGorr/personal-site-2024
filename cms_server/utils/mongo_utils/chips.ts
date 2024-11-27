import { chip, api_return_schema } from "../../interfaces/interfaces";
import Chip_Schema from "../../mongo_schemas/chip_schema"
import { MONOGDB_CHIPS } from '../path_consts.js'
import dbConnect from '../db_conn';

export async function add_chip(inName: string, inDefinition: string){

    console.log("creating chip")

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
        // Obtain the Chip model for the specific database connection
        const ChipModel = Chip_Schema(connection);

        // Now create a new chip instance using the ChipModel
        const newChip = new ChipModel({
            name: inName,
            description: inDefinition
        });

        const asd = await newChip.save();

        console.log("SENATORS ", asd)

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }

}

export async function EditChip(id: number, inName: string, inDefinition: string){
  
    try {

        const connection = await dbConnect(process.env.DB_CHIPS_NAME)

        // Obtain the Chip model for the specific database connection
        const ChipModel = Chip_Schema(connection);

        // Update the chip
        const updatedChip = await ChipModel.findOneAndUpdate(
            { _id: id }, 
            { name: inName, definition: inDefinition},
            { new: true }  // Return the updated document
        );

        // Check if the chip was found and updated
        if (updatedChip) {
            console.log('Chip edited!');
            return true;
        } else {
            console.log('Chip not found');
            return false;
        }
        
    } catch (error) {
        console.error('Error:', error);
    }

}

export async function get_chips(): Promise<api_return_schema<chip[]>> {

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)

    try {
      const chip_search_result: chip[] = await Chip_Schema(connection).find();
      return {data: chip_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

export async function DeleteChip(articleId: number) {
    try {
        console.log("deleting chip")
        const connection = await dbConnect(process.env.DB_CHIPS_NAME)
        const Chip = await Chip_Schema(connection);
        const result = await Chip.findByIdAndDelete(articleId);
        
        if (!result) {
            console.log("Chip not found")
            return { success: false, message: "Chip not found" };
        }
        console.log("Chip deleted successfully")
        return { success: true, message: "Chip deleted successfully" };
    } catch (error) {
        return { success: false, message: "unable to delete chip" };
    }
}
