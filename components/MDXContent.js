import React, { useEffect, useState } from 'react';

export const MDXContent = ({ home_post_obj_source }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3002/CMS/articles/${home_post_obj_source}/article.mdx`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((mdxContent) => {
        setContent(mdxContent);
        // Here you would parse and possibly render the MDX content
        // This step is highly dependent on your setup and tools
      })
      .catch((err) => {
        console.error("Failed to fetch MDX content:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [home_post_obj_source]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  // Render the MDX content directly as text, or parsed content as needed
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};
