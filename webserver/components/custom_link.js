import React from 'react';
import Image from 'next/image';

const CustomLink = ({ href, children }) => {

  const getImageURL = () => {
    try {
      const url = new URL(href);
      const faviconUrl = `${url.origin}/favicon.ico`;
      return faviconUrl.toString();
    } catch (e) {
      return '/images/svgs/link.svg';
    }
  };

  return (
    <div className="custom-link bg-gray-200 px-1 rounded-lg">
      <div className="mr-1">
        <div className="inlineimg">
          <Image src={getImageURL()} width={14} height={14} />
        </div>
      </div>
      <a href={href} className="link">
        {children}
      </a>
    </div>
  );
};

export default CustomLink;