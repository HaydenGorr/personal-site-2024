import Layout from '../../components/layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Chip from '../../components/chip';
import MB_Button from '../../components/MB_Button';
import Image from 'next/image';

export default function Article({mdxSource}) {
    const components = {
        Chip,
        MB_Button,
        Image,
    };

    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    {/* <MDXContent home_post_obj_source={id}/> */}
                    <MDXRemote {...mdxSource} components={components}/>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps(context) {
    const { id } = context.params;
    const res = await fetch(`${process.env.CMS_ROUTE}/CMS/articles/${id}/article.mdx`);
    const mdxContent = await res.text();
    
    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    return { props: { mdxSource }, revalidate: Number(process.env.REVALIDATE_TIME_SECS), }; 
}

export async function getStaticPaths() {

    console.log("[id].js - getStaticPaths() - CMS ROUTE ENV VAR: ", process.env.CMS_ROUTE)
    
    const home_posts_response = await fetch(`${process.env.CMS_ROUTE}/meta_resources/home_posts`);

    const hprJSON = await home_posts_response.json();
    
    const paths = hprJSON.map(article => ({
      params: { id: article.source },
    }));
  
    return { paths, fallback: 'blocking' };

    // const cmsRoute = process.env.CMS_ROUTE;

    // try {
    //     const homePostsResponse = await fetch(`${cmsRoute}/meta_resources/home_posts`);
    
    //     if (!homePostsResponse.ok) {
    //       console.error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
    //       throw new Error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
    //     }
    
    //     const hprJSON = await homePostsResponse.json();
        
    //     if (!Array.isArray(hprJSON)) {
    //       console.error('Expected an array from the CMS response');
    //       throw new Error('Invalid format for home_posts response.');
    //     }
    
    //     const paths = hprJSON.map(article => {
    //       if (!article.source) {
    //         console.warn('Article without a source detected.');
    //       }
    //       return {
    //         params: { id: article.source ? article.source.toString() : '' },
    //       };
    //     })
    
    //     return { paths, fallback: 'blocking' };
    //   } catch (error) {
    //     console.error(`Error in getStaticPaths: ${error.message}`);
    
    //     return { paths: [], fallback: 'blocking' };
    //   }

  }