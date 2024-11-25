import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import AdminContainer from "../../components/admin/admin_container";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ClosableChip from "../../components/closable_chip";
import LineBreak from '../../components/line_break'
import MB_Button from "../../components/MB_Button";
import Image from "next/image";

export const config = {
    api: {
      bodyParser: false,
    },
};

export default function Admin({setBackgroundColour}) {

    const [original_chip_edit_name, set_original_chip_edit_name] = useState("");
    const [chip_edit_name, set_chip_edit_name] = useState("");
    const [chip_edit_desc, set_chip_edit_desc] = useState("");
    const [chip_edit_image_url, set_chip_edit_image_url] = useState("");
    const [articles, setArticles] = useState([]);
    const [chips, setChips] = useState([]);
    const [categories, setCategories] = useState([]);

    /**
     * FOR UPLOADING CHIPS
     */
    // For uploading chip CSVs
    const [image, setImage] = useState(null);

    useEffect(() => {
        setBackgroundColour("WhiteBackgroundColour")
        get_articles();
        get_chips();
        get_categories();
    }, []); 

    const close_modal_and_reset_vars = () => {
        document.getElementById('default-modal').close()

        set_original_chip_edit_name("");
        set_chip_edit_name("");
        set_chip_edit_desc("");
        set_chip_edit_image_url("");
        setImage(null);
    }

    /**
     * Upload a new chip to the CMS
     */
    const uploadNewChip = async () => {

        const formData = new FormData();

        if( !chip_edit_name || !chip_edit_desc || !image ) { return; }

        formData.append('name', chip_edit_name);
        formData.append('description', chip_edit_desc);
        formData.append('image', image);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_chip`, {
              method: 'POST',
              body: formData,
              credentials: 'include'
            });
        
            if (response.ok) {
              // Handle successful response
              console.log('Chip uploaded successfully');
            } else {
              // Handle error response
              console.error('Error uploading chip');
            }

            await get_chips();
            close_modal_and_reset_vars()
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    }

    /**
     * edit a chip in the CMS
     */
    const commitChipEdits = async () => {

        const formData = new FormData();

        if( !chip_edit_name || !chip_edit_desc ) { return; }

        formData.append('original_name', original_chip_edit_name);
        formData.append('name', chip_edit_name);
        formData.append('description', chip_edit_desc);
        formData.append('image', image || "");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/edit_chip`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
        
            if (response.ok) {
                // Handle successful response
                console.log('Chip uploaded successfully');
            } else {
                // Handle error response
                console.error('Error uploading chip');
            }

            await get_chips();

            close_modal_and_reset_vars()
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    }

    /**
     * Populate the admin page with article containers
     */
    const get_articles = async () => {
        // This gets all of the articles, even unpublished ones
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`, {
            method:'GET',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setArticles(data);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    /**
     * Populate the admin page with all of the chips
     */
    const get_chips = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/get_unique_chips`);
        if (res.ok) {
            const data = await res.json();
            if (data.error) {}
            setChips(data.data);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    /**
     * Populate the admin page with all of the chips
     */
    const get_categories = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_categories`, {
            method: 'GET',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();

            const cleaned_data = data.map(obj => obj.name);
            
            setCategories(cleaned_data || []);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    /**
     * Add a new unpublished article to DB
     */
    const add_unpublished_article = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/add_unpublished_article`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                // Handle successful response
                console.log('Chip uploaded successfully');
            } else {
                // Handle error response
                console.error('Error uploading chip');
            }
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    };

    const set_edit_chip = (chip_index) => {
        set_original_chip_edit_name(chips[chip_index].name)
        set_chip_edit_name(chips[chip_index].name)
        set_chip_edit_desc(chips[chip_index].description)
        set_chip_edit_image_url(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chips[chip_index].name.toLowerCase()}.svg`)

        document.getElementById('default-modal').showModal()
    }

    const set_create_chip = () => {
        set_original_chip_edit_name("")
        set_chip_edit_name("")
        set_chip_edit_desc("")
        set_chip_edit_image_url("")

        document.getElementById('default-modal').showModal()
    }

    const deleteChip = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_chip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: original_chip_edit_name }),
                credentials: 'include'
            });

                    
            if (response.ok) {
                // Handle successful response
                console.log('Chip uploaded successfully');
                await get_chips();
            } else {
                // Handle error response
                console.error('Error uploading chip');
            }

            close_modal_and_reset_vars()

        }
        catch {
            console.log("error deleting chip")
        }
    }

    return (
        <Layout>
            <h1 className='mt-5 mb-2 text-center font-extrabold text-4xl'>ADMIN PAGE</h1>

            {/** CHIP EDIT MODAL */}
            <dialog id="default-modal" className="modal modal-bottom sm:modal-middle shadow-MB p-6 Neo-Brutal-White">
                <div className="flex justify-center items-center flex-col">
                    <Image 
                        className="mb-3"
                        src={chip_edit_image_url}
                        width={20}
                        height={20}/>
                </div>

                <div>
                    <label for="chip_name" className=" mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input type="text"
                        id="chip_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={chip_edit_name}
                        onChange={(e) => set_chip_edit_name(e.target.value)} 
                        required />
                </div>

                <div>
                    <label for="chip_name" className=" mb-2 text-sm font-medium text-gray-900">Description</label>
                    <input type="text"
                        id="chip_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={chip_edit_desc}
                        onChange={(e) => set_chip_edit_desc(e.target.value)} 
                        required />
                </div>

                <div className="mt-3 flex justify-center">
                    <input
                        type="file"
                        id="image"
                        accept=".svg"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="ml-6 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>

                <div className="mt-3 flex justify-between">
                    <MB_Button text="save" btnAction={()=> original_chip_edit_name == "" ? uploadNewChip() : commitChipEdits()}></MB_Button>
                    <MB_Button text="delete" btnAction={()=>deleteChip()}></MB_Button>
                    <MB_Button text="close" btnAction={()=>close_modal_and_reset_vars()}></MB_Button>
                </div>

            </dialog>

            <div className="mx-3">
                <div className={`mx-3`}>
                    <div className={`flex flex-wrap mt-2`}>
                        {chips.map((chip, index) => (
                            <div className={`mr-3 mt-3 flex`} onClick={()=>set_edit_chip(index)}>
                                <ClosableChip
                                    key={index}
                                    chip_text={chip.name}
                                    remove_keywords={() => {}}
                                    svg_path={`images/svgs/star.svg`}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="mr-3 mt-3 flex justify-center"><MB_Button type={"submit"} text={'add chip'} btnAction={()=>{set_create_chip();}}/></div>

                </div>

                <LineBreak className="mb-16 mt-6"/>

                <div className="mb-12">
                    <MB_Button text="Create New Article" btnAction={async () => {await add_unpublished_article(); get_articles();}}/>
                </div>

                <div className="">
                    {articles.length > 0 && articles.map((item, index) => (
                        <AdminContainer
                            categories={categories}
                            refresh_categories={()=>{
                                get_articles();
                                get_chips();
                                get_categories();
                            }}
                            key={item.id}
                            home_post_obj={item}
                            add_keywords_to_filter={() => {}}
                            remove_keyword_from_filer={() => {}}
                            selectedKeywords={[]}
                            all_chips={chips.map((chip, index) => {return chip.name})}
                            refreshArticlesCallback={async () => {await get_articles()}}/>
                    ))}
                </div>

            </div>
        </Layout>
    );
  }