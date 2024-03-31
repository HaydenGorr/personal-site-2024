import { useRouter } from 'next/router'
import Layout from '../../components/layout';
import dynamic from 'next/dynamic';

export default function Article() {
    const router = useRouter();
    const { id } = router.query;

    const MDXContent = dynamic(() => import(`../../articles/${id}.mdx`).catch(err => () => <p>Failed to load</p>), {
      loading: () => <p>Loading...</p>,
    });
  

    if (router.isFallback) {
        return <div>Loading...</div>;
    }
  
    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6'>
                {/* <div className="prose max-w-prose" dangerouslySetInnerHTML={{ __html: post }}></div> */}
                <div className="prose max-w-prose">
                    <MDXContent></MDXContent>
                </div>
            </div>
        </Layout>
        
    );
}

// export async function getServerSideProps({ params }) {
//     const { id } = params;
  
//     // Construct the file path
//     const filePath = path.join(process.cwd(), 'public', 'articles', `${id}.md`);

//     // Read the markdown file content
//     const markdown = fs.readFileSync(filePath, 'utf8');
    
//     // Convert the markdown to HTML
//     const html = marked(markdown);

//     return {
//         props: { post: html},
//     };
//   }