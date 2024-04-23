import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import AdminContainer from "../../components/admin/admin_container";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ClosableChip from "../../components/closable_chip";
import LineBreak from '../../components/line_break'
import MB_Button from "../../components/MB_Button";
import InputBox from "../../components/inputBox";

export const config = {
    api: {
      bodyParser: false,
    },
};

export default function Admin() {

    const [addChip, setAddChip] = useState(false);
    const [articles, setArticles] = useState([]);
    const [chips, setChips] = useState([]);

    /**
     * FOR UPLOADING CHIPS
     */
    // Chips name
    const [addChipText, setAddChipText] = useState([]);
    // Chips description
    const [addChipDescText, setAddChipDescText] = useState([]);
    // For uploading chip CSVs
    const [image, setImage] = useState(null);

    useEffect(() => {
        get_articles();
        get_chips();
    }, []); 

    const update_chip_name_text = (e) => {
        setAddChipText(e.target.value)
    }

    const update_chip_desc_text = (e) => {
        setAddChipDescText(e.target.value)
    }

    const uploadNewChip = async () => {

        const formData = new FormData();

        if( !addChipText || !addChipDescText || !image ) { return; }

        formData.append('name', addChipText);
        formData.append('description', addChipDescText);
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
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    }

    const get_articles = async () => {
        // This gets all of the articles, even unpublished ones
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`, {
            method:'GET',
            credentials: 'include'
        });
        if (res.ok) {
            console.log("response is OKAY");
            const data = await res.json();
            setArticles(data);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    const get_chips = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/get_unique_chips`);
        if (res.ok) {
            console.log("response is OKAY");
            const data = await res.json();
            if (data.error) {}
            setChips(data.data);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    return (
        <Layout>
            <h1 className='mt-5 mb-2 text-center font-extrabold text-4xl'>ADMIN PAGE</h1>
            <div className="">

            <div className={`mx-3`}>
                <div className={`flex flex-wrap mt-2`}>
                    {chips.map((chip, index) => (
                        <div className={`mr-3 mt-3`}>
                            <ClosableChip
                                key={index}
                                chip_text={chip.name}
                                remove_keywords={() => {}}
                                svg_path={`images/svgs/star.svg`}
                            />
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 flex">
                    <MB_Button type={"submit"} text={'add chip'} btnAction={() => uploadNewChip()}></MB_Button>
                    <InputBox 
                        className={"max-w-36 h-full p-2 ml-6 self-center"}
                        onKeyPress={() => {}}
                        onChange={update_chip_name_text} 
                        valueStorage={addChipText} 
                        onFocus={() => {}} 
                        defaultText={"Chip name"}
                    />
                    <InputBox 
                        className={"ml-6 w-full h-full p-2  self-center"}
                        onKeyPress={() => {}}
                        onChange={update_chip_desc_text} 
                        valueStorage={addChipDescText} 
                        onFocus={() => {}} 
                        defaultText={"Chip description"}
                    />
                    <input
                        type="file"
                        id="image"
                        accept=".svg"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="ml-6 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
            

            <LineBreak className="my-12"/>
            <div className="mx-3">
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
                    <Masonry gutter="0px">
                        {articles.length > 0 && articles.map((item, index) => (
                            <AdminContainer
                                home_post_obj={item}
                                add_keywords_to_filter={() => {}}
                                remove_keyword_from_filer={() => {}}
                                selectedKeywords={[]}/>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
            </div>
        </Layout>
    );
  }