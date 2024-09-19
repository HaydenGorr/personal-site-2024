import Image from "next/image";
import { useState, useEffect } from "react";
import MB_Button from "../MB_Button";

export default function EditChipModal({refreshChips, closeModalCallback, inID, chip=null}) {

    const [original_chip_edit_name, set_original_chip_edit_name] = useState(null);
    const [chip_edit_name, set_chip_edit_name] = useState(null);
    const [chip_edit_desc, set_chip_edit_desc] = useState(null);
    const [chip_edit_image_url, set_chip_edit_image_url] = useState("");

    useEffect(() => {
        console.log(chip)
        if (chip) {
            set_original_chip_edit_name(chip.name);
            set_chip_edit_name(chip.name);
            set_chip_edit_desc(chip.description);
            set_chip_edit_image_url(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip.name.toLowerCase()}.svg`);
        }
    }, [chip]); 

    /**
     * FOR UPLOADING CHIPS
     */
    // For uploading chip CSVs
    const [image, setImage] = useState(null);

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

            close_modal_and_reset_vars()
        } catch (error) {
            console.error('Error uploading chip', error);
        }
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

    const close_modal_and_reset_vars = () => {

        set_original_chip_edit_name("");
        set_chip_edit_name("");
        set_chip_edit_desc("");
        set_chip_edit_image_url("");
        setImage(null);

        refreshChips();
        closeModalCallback();

        document.getElementById(inID).close()
    }

    return (
        <div>

            
           
            <div>
                <div className="flex justify-center items-center flex-col">
                    <Image 
                        className="mb-3"
                        src={chip_edit_image_url}
                        width={20}
                        height={20}/>
                </div>
                
                <div>
                    <label for="chip_name" class=" mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input type="text"
                        id="chip_name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={chip_edit_name}
                        onChange={(e) => set_chip_edit_name(e.target.value)} 
                        required />
                </div>

                <div>
                    <label for="chip_name" class=" mb-2 text-sm font-medium text-gray-900">Description</label>
                    <input type="text"
                        id="chip_name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

            </div>
            
        </div>
    )
}