import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getPrimaryColour, getSecondaryColour, getTirtaryColour, getTextColour } from '../utils/colour';

const CustomLink = ({ href, children, backgroundColour }) => {
  const [faviconUrl, setFaviconUrl] = useState("/images/svgs/link_icon.svg");

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/favicon?href=${encodeURIComponent(href)}`);
        const data = await res.json();
        if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
      } catch (e) {
        console.log(e);
      }
    };

    fetchFavicon();
  });

  return (
    <div className={`custom-link px-1 rounded-lg transition-colors duration-500`} style={{backgroundColor: getTirtaryColour(backgroundColour), color: getTextColour(backgroundColour)}}>
      <div className="mr-1">
        <div className="inlineimg">
          <Image src={faviconUrl} width={14} height={14} />
        </div>
      </div>
      <a href={href} className={`link ${getTextColour(backgroundColour)}`} target="_blank">
        {children}
      </a>
    </div>
  );
};

export default CustomLink;