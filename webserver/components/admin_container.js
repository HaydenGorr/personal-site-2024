import Container from "./container";

export default function AdminContainer({ home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer}) {

    return (
        <div className="my-3 flex justify-center mx-3">
            <Container home_post_obj={home_post_obj} btnAction={btnAction} colour={colour} add_keywords_to_filter={add_keywords_to_filter} selectedKeywords={selectedKeywords} remove_keyword_from_filer={remove_keyword_from_filer}></Container>
        </div>
    );

  }