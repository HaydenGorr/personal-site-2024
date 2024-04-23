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
    const [addChipText, setAddChipText] = useState([]);
    const [addChipDescText, setAddChipDescText] = useState([]);

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
                <MB_Button text={`${addChip ? 'close' : 'add chip'}`} btnAction={() => setAddChip(!addChip)}></MB_Button>
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