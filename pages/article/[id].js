import { useRouter } from 'next/router'
import Layout from '../../components/layout';
import { MDXContent } from '../../components/MDXContent'


export default function Article() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    <MDXContent home_post_obj_source={id}/>
                </div>
            </div>
        </Layout>
    );
}