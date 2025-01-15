import { useEffect } from "react";

// 1) Declare it as a component receiving props:
export default function PrecacheImages({ array_of_images = [] }) {
    // Optional: Verify it's an array to avoid errors
    if (!Array.isArray(array_of_images)) {
      return null; // or do whatever fallback you want
    }

    useEffect(()=>{
        console.log("array_of_images", array_of_images)
    })
  
    return (
      <>
        {array_of_images.map((val) => (
          <link
            key={val}
            rel="preload"
            as="image"
            href={val}
          />
        ))}
      </>
    );
  }
  