export default async function does_the_article_file_exist(source_folder){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/CMS/articles/${source_folder}/article.mdx`);
        const mdxContent = await res.text();
    
        if (mdxContent.length == 0) return false
    
        return mdxContent
    }
    catch{
        return false
    }

}