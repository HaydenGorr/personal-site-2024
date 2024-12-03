import { chip, api_return_schema } from "../../interfaces/interfaces";
import Chip_Schema from "../../mongo_schemas/chip_schema"
import { MONOGDB_CHIPS } from '../path_consts.js'
import dbConnect from '../db_conn';


export async function get_chip(inName: string): Promise<api_return_schema<chip[]>> {

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
        const chips: chip[] = await Chip_Schema(connection).find({name: inName});
        return {data: chips, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:"Could not fetch Chip data from DB"}}
    }
}

export async function AddChip(inChip: chip): Promise<api_return_schema<Boolean>>{

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
        const ChipModel = Chip_Schema(connection);

        const existingChip = await ChipModel.findOne({ name: inChip.name });
        if (existingChip) {
            return { data: false, error: { has_error: true, error_message: "Chip already exists" } };
        }

        const newCat = new ChipModel({
            name: inChip.name,
            description: inChip.description,
            date: new Date()
        });

        const saved = await newCat.save();

        return {data: true, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: false, error:{has_error: true, error_message: `${error}`}};
    }

}

export async function DeleteChip(inChip: chip) : Promise<api_return_schema<Boolean>> {
    try {
        console.log("deleting chip")
        const connection = await dbConnect(process.env.DB_CHIPS_NAME)
        const ChipModel = await Chip_Schema(connection);
        const result = await ChipModel.findByIdAndDelete(inChip._id);
        
        if (!result) {
            return { 
                data: false,
                error:{
                    has_error: true,
                    error_message: `Could not find the Chip in the backend with id ${inChip._id}`
                }
            };
        }
        return { 
            data: true,
            error:{
                has_error: false,
                error_message: ``
            }
        };
    } catch (error: any) {
        return { 
            data: false,
            error:{
                has_error: true,
                error_message: `Error connecting to database. ${error}`
            }
        };
    }
}

export async function get_unique_chips(): Promise<api_return_schema<chip[]>>{

    console.log("inside get_unique_chips")
    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
    console.log("got response")
    try {
        const chips:chip[] = await Chip_Schema(connection).find().sort({ submit_date: -1 });

        return {data: chips, error: { has_error: false, error_message:""}}

    } catch (error) {
        return {data: [], error: { has_error: true, error_message:"Could not fetch Chip data from DB"}}
    }
  
  }

