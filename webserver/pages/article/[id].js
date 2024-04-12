import Layout from '../../components/layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Chip from '../../components/chip';
import MB_Button from '../../components/MB_Button';
import Image from 'next/image';
import ImageWrapper from '../../components/image_wrapper';
// import CustomLink from '../../components/custom_link';
import dynamic from 'next/dynamic';

const CustomLink = dynamic(() => import('../../components/custom_link'), {
  ssr: false,
});

export default function Article({mdxSource}) {
    const components = {
        Chip,
        MB_Button,
        Image,
        ImageWrapper,
        a: CustomLink
    };

    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    <MDXRemote {...mdxSource} components={components}/>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps(context) {
    const { id } = context.params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/CMS/articles/${id}/article.mdx`);
    const mdxContent = await res.text();
    
    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    return { props: { mdxSource }, revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS), }; 
}

export async function getStaticPaths() {

    try {
        const homePostsResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/meta_resources/home_posts`);
    
        if (!homePostsResponse.ok) {
          console.error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
          throw new Error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
        }
    
        const hprJSON = await homePostsResponse.json();
        
        if (!Array.isArray(hprJSON)) {
          console.error('Expected an array from the CMS response');
          throw new Error('Invalid format for home_posts response.');
        }
    
        const paths = hprJSON.map(article => {
          if (!article.source) {
            console.warn('Article without a source detected.');
          }
          return {
            params: { id: article.source ? article.source.toString() : '' },
          };
        })
    
        return { paths, fallback: 'blocking' };
      } catch (error) {
        console.error(`Error in getStaticPaths: ${error.message}`);
    
        return { paths: [], fallback: 'blocking' };
      }

  }