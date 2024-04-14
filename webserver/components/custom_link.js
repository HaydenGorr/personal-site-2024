import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const CustomLink = ({ href, children }) => {
  const [imageURL, setImageURL] = useState('/images/svgs/link_icon.svg');

  useEffect(() => {
    const getImageURL = async () => {
      try {
        const url = new URL(href);
        const faviconUrl = `${url.origin}/favicon.ico`;
        const res = await fetch(faviconUrl);
        if (res.ok) {
          setImageURL(faviconUrl.toString());
        }
      } catch (e) {
        console.log(e)
        return
      }
    };

    getImageURL();
  }, [href]);


  return (
    <div className="custom-link bg-gray-200 px-1 rounded-lg">
      <div className="mr-1">
        <div className="inlineimg">
          <Image src={imageURL} width={14} height={14} />
        </div>
      </div>
      <a href={href} className="link" target="_blank">
        {children}
      </a>
    </div>
  );
};

export default CustomLink;