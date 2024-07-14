import { useEffect, useRef, useState } from "react";

export default function FilterPreset({background_img, onClick, title}) {

  return (
    <div 
        style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/image/${background_img}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
        }}
        className={`p-4 text-wrap flex font-medium cursor-pointer Neo-Brutal-White bg-slate-800 text-center`}
        onClick={ () => onClick() }>
        { title }
    </div>
  );

}
