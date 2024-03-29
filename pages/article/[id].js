import { useRouter } from 'next/router'
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Layout from '../../components/layout';

export default function Article({post}) {
    const router = useRouter()

    if (router.isFallback) {
        return <div>Loading...</div>;
    }
  
    return (
        <Layout>
            <div className='flex justify-center pt-3'>
                <div className="prose max-w-prose" dangerouslySetInnerHTML={{ __html: post }}></div>
            </div>
        </Layout>
        
    );
}

export async function getServerSideProps({ params }) {
    const { id } = params;
  
    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'articles', `${id}.md`);

    // Read the markdown file content
    const markdown = fs.readFileSync(filePath, 'utf8');
    
    // Convert the markdown to HTML
    const html = marked(markdown);

    return {
        props: { post: html},
    };
  }