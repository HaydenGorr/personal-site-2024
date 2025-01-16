import { api_return_schema } from "../../interfaces/misc_interfaces.js";
import article_schema from "../../mongo_schemas/article_schema.js";
import images_schema from "../../mongo_schemas/images_schema.js";
import mdx_schema from "../../mongo_schemas/mdx_schema.js";
import dbConnect from '../db_conn.js';
import { article_WID } from "../../interfaces/article_interfaces.js";
import mongoose from 'mongoose';
import { db_article } from "../../interfaces/article_interfaces.js";

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function get_article(id:string): Promise<api_return_schema<db_article|null>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {
      const article_model = article_schema(connection);

      const existingArticle = await article_model.findOne({ _id: id })
      .populate({
        path: 'mdx', // First populate the 'mdx' field
        populate: { path: 'images', model: 'images' }, // Then populate 'images' inside 'mdx'
      })
      .populate('image') as any;

      

      if (!existingArticle) {
          return { data: null, error: { has_error: true, error_message: `An article with the id ${id} doesn't exist` } };
      }

        return {data: existingArticle, error: {has_error:false, error_message:""}}
    } catch (error) {
        return {data: null, error: {has_error:true, error_message:'Internal server error'}}
    }
}

export async function get_all_articles(): Promise<api_return_schema<db_article[]>>{
  try {
      const connection = await dbConnect(process.env.DB_PRIME_NAME)
      mdx_schema(connection);
      images_schema(connection);

      const articles: any[] = await article_schema(connection)
      .find()
      .populate({
        path: 'mdx', // First populate the 'mdx' field
        populate: { path: 'images', model: 'images' }, // Then populate 'images' inside 'mdx'
      })
      .populate('image')
      .sort({ publishDate: -1 });
    
      return {data: articles, error:{has_error: false, error_message: ""}}
  } catch (error) {
      console.error('Error:', error);
      return {data: [], error:{has_error: true, error_message: `${error}`}}
  }
}

export async function get_all_ready_articles(): Promise<api_return_schema<db_article[]>>{
  try {
    const connection = await dbConnect(process.env.DB_PRIME_NAME)
    mdx_schema(connection) // Register mdx_schema so it can be used in the query below
    images_schema(connection) // Register images_schema so it can be used in the query below
    
    const articles: any[] = await article_schema(connection)
    .find({ ready: true })
    .sort({ publishDate: -1 })
    .populate({
      path: 'mdx', // First populate the 'mdx' field
      populate: { path: 'images', model: 'images' }, // Then populate 'images' inside 'mdx'
    })
    .populate('image');
    return {data: articles, error:{has_error: false, error_message: ""}}
} catch (error) {
    console.error('Error:', error);
    return {data: [], error:{has_error: true, error_message: `${error}`}}
}
}

export async function add_article(): Promise<api_return_schema<db_article|null>>{

    console.log("creating chip")

    const connection = await dbConnect(process.env.DB_PRIME_NAME)
  
    try {
        const ArticleModel = article_schema(connection);

        const newArticle = new ArticleModel({
            title: "template title",
            desc: "template definition",
            infoText: "template infoText",
            chips: [],
            source: generateRandomString(8),
            views: 0,
            publishDate: new Date(),
            ready: false,
            portfolioReady: false
        });

        const asd: any = await newArticle.save();

        return {data: asd, error:{has_error:false, error_message: ""}};
    } catch (error) {
        return {data: null, error:{has_error:true, error_message: "Internal server error"}};
    }

}

export async function delete_article(articleId: number): Promise<api_return_schema<Boolean>> {
    try {
      const connection = await dbConnect(process.env.DB_PRIME_NAME);
      console.log("AH!")
      const Article = await article_schema(connection); // If your model needs a connection to initialize
      console.log("\ndeleting")
      const result = await Article.findByIdAndDelete(articleId);
      console.log("\ndeleted")
      if (!result) {
        return {data: false, error:{has_error: true, error_message:"Article not found"} };
      }
      return {data: true, error:{has_error: false, error_message:"Article not found"}};
    } catch (error) {
      return {data: true, error:{has_error: false, error_message:"Could not delete article"}};
    }
  }

export const update_article = async(updated_article: article_WID): Promise<api_return_schema<db_article|null>> => {
    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {
        const articleModel = await article_schema(connection)
        const ObjectId = mongoose.Types.ObjectId;
        const updatePayload: article_WID = {
          ...updated_article,
          mdx: (updated_article.mdx as any) instanceof ObjectId ? updated_article.mdx : new ObjectId(updated_article.mdx),
          image: (updated_article.image as any) instanceof ObjectId ? updated_article.image : new ObjectId(updated_article.image),
        };

        const art = await articleModel.findByIdAndUpdate(
          updated_article._id,
          { $set: updatePayload },
          { new: true, runValidators: true }
        );

        if (!art) throw Error()

        await art.save();

        return {data:null, error:{has_error: false, error_message:""}};
    }
    catch (err: unknown){
      console.error('Full error:', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
    });
        return {data:null, error:{has_error: true, error_message:"Internal Server Error"}};
    }
}

export const create_new_article = async(new_article: article_WID): Promise<api_return_schema<any>> => {
  const connection = await dbConnect(process.env.DB_PRIME_NAME)

  try {
      const articleModel = await article_schema(connection)

      const { _id: _, ...rest } = new_article;


      // Link the mdx_entry to the article
      const art = new articleModel( rest );

      if (!art) throw Error()

      const ret_obj = await art.save();

      return {data:ret_obj, error:{has_error: false, error_message:""}};
  }
  catch (err: unknown){
    console.error('Full error:', {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      name: err instanceof Error ? err.name : undefined
  });
      return {data:null, error:{has_error: true, error_message:"Internal Server Error"}};
  }
}

/**
 * Takes a new article in cms_data, validates it and adds it to the database
 * @param {String} article_dir_name - The name of the dir containing the article you're creating
 */
export async function create_article(article: any){

  // const article_dir_name = article

  // console.log("creating article: ", article)

  // const new_article_path = path.join(articles_dir, article_dir_name);

  // /**
  //  * This will return false, true, or an array of props.
  //  * it returns an array of props if the article has already been published AND
  //  * the meta.file doesn't match the DB entry. This means that the article has been
  //  * updated locally and this update needs to be reflected in the DB
  //  */
  // const result = await validate_article_before_publishing(new_article_path, article_dir_name)

  // // If result is false. validate_article_before_publishing() should never return an empty array
  // if(!result) return false

  // const article_meta = await readJSON(path.join(new_article_path, "meta.json"))

  // if (typeof result == "object") {
  //   console.log("This article has already been published, but there are updates to commit")
  //   console.log("The updates: ", result)
  //   await update_article(article_dir_name, result, article_meta)
  // }else {
  //   // Create a whole new article record
  //   dbConnect(process.env.DB_PRIME_NAME)
  //   .then((conn) => {
        
  //       // Create a new document
  //       const newArticle = new Article(conn)({
  //       title: article_meta.title,
  //       desc: article_meta.desc,
  //       infoText: article_meta.infoText,
  //       chips: article_meta.chips,
  //       source: article_dir_name,
  //       views: 0,
  //       publishDate: Date.now(),
  //       ready: true
  //       });
        
  //       // Save the document
  //       return newArticle.save();
  //   })
  //   .then(() => {
  //       console.log('Document inserted successfully');
  //   })
  //   .catch((err) => {
  //       console.error('Error:', err);
  //   });
  // }

  return

  // // Add the chips
  // const new_defs = await get_definitions_for_new_chips(article_meta.chips)

  // // Ensure the chips has definitions
  // for (const chip of new_defs) {
  //     await add_chip(chip.name, chip.description)
  // }
}