import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import AdminContainer from "../../components/admin/admin_container";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ClosableChip from "../../components/closable_chip";
import LineBreak from '../../components/line_break'
import MB_Button from "../../components/MB_Button";
import Image from "next/image";
import EditChipModal from "../../components/modals/edit_chip_modal"
import EditArticleModal from "../../components/modals/edit_article_modal";

export const config = {
    api: {
      bodyParser: false,
    },
};

export default function Admin({setBackgroundColour}) {

    const [articles, setArticles] = useState([]);
    const [chips, setChips] = useState([]);
    const [whichModal, setWhichModal] = useState(null);
    const [whichChip, setWhichChip] = useState(null);
    const [whichArticle, setWhichArticle] = useState(null);

    useEffect(() => {
        setBackgroundColour("WhiteBackgroundColour")
        get_articles();
        get_chips();
    }, []); 

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
            console.log("response is OKAY");
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
            console.log("response is OKAY");
            const data = await res.json();
            if (data.error) {}
            setChips(data.data);
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

    const set_create_chip = () => {
        document.getElementById("modalID").showModal()
        setWhichModal("edit_chip")
    }

    const set_create_article = () => {
        document.getElementById("modalID").showModal()
        setWhichModal("edit_article")
    }

    return (
        <Layout>
            <h1 className='mt-5 mb-2 text-center font-extrabold text-4xl'>ADMIN PAGE</h1>



            <dialog id={"modalID"} className="modal modal-bottom sm:modal-middle shadow-MB p-6 Neo-Brutal-White">

                {whichModal == "edit_chip" && <EditChipModal
                    inID={"modalID"}
                    refreshChips={() => {get_chips()}}
                    closeModalCallback={() => setWhichChip(-1)}
                    chip={whichChip > -1 ? chips[whichChip] : null}/>}

                {whichModal == "edit_article" && <EditArticleModal
                    inID={"modalID"}
                    refreshArticles={() => {get_articles()}}
                    closeModalCallback={() => setWhichArticle(-1)}
                    home_post_obj={whichChip > -1 ? articles[whichArticle] : null}/>}

            </dialog>

            <div className="mx-3">
                <div className={`mx-3`}>
                    <div className={`flex flex-wrap mt-2`}>
                        {chips.map((chip, index) => (
                            <div className={`mr-3 mt-3 flex`} onClick={()=>{setWhichChip(index); set_create_chip();}}>
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
                    <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
                        <Masonry gutter="0px">
                            {articles.length > 0 && articles.map((item, index) => (
                                <AdminContainer
                                    editButtonCallback={() => {set_create_article(); setWhichArticle(index)}}
                                    key={item.id}
                                    home_post_obj={item}
                                    add_keywords_to_filter={() => {}}
                                    remove_keyword_from_filer={() => {}}
                                    selectedKeywords={[]}
                                    all_chips={chips.map((chip, index) => {return chip.name})}
                                    refreshArticlesCallback={async () => {await get_articles()}}/>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                </div>

            </div>
        </Layout>
    );
  }