import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const CustomLink = ({ href, children }) => {
  const [faviconUrl, setFaviconUrl] = useState("/images/svgs/link_icon.svg");

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/favicon?href=${encodeURIComponent(href)}`);
        const data = await res.json();
        console.log("\n\n\nimported SVG: ", data)
        if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
      } catch (e) {
        console.log(e);
      }
    };

    fetchFavicon();
  });


  return (
    <div className="custom-link bg-gray-200 px-1 rounded-lg">
      <div className="mr-1">
        <div className="inlineimg">
          <Image src={faviconUrl} width={14} height={14} />
        </div>
      </div>
      <a href={href} className="link" target="_blank">
        {children}
      </a>
    </div>
  );
};

export default CustomLink;