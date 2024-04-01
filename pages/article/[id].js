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
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    <MDXContent></MDXContent>
                </div>
            </div>
        </Layout>
    );
}