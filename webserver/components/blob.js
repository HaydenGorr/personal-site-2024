import { useEffect, useRef, useState } from 'react';

const Blob = () => {
  const rectangleCount = 2;
  const rectangles = Array.from({ length: rectangleCount });

  // Initialize blob position and velocity
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 });
  const blobVelocity = useRef({ x: 1, y: 1 }); // Use refs to avoid re-renders

// Initialize rectangles within the blob with random offsets
    const initialRectangles = rectangles.map(() => ({
        x: Math.random() * 100 - 50 + (Math.random() - 0.5) * 20, // Random position within the blob with an offset
        y: Math.random() * 100 - 50 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2 + (Math.random() - 0.5) * 0.5, // Random velocity with an additional offset
        vy: (Math.random() - 0.5) * 2 + (Math.random() - 0.5) * 0.5,
    }));

  const [rects, setRects] = useState(initialRectangles);
  const [color, setColor] = useState('bg-dg-300');

  // Set initial blob position after component mounts
  useEffect(() => {
    setBlobPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
  }, []);

  useEffect(() => {
    const BLOB_SIZE = 200; // Approximate blob size
    let animationFrameId;

    const animate = () => {
      setBlobPosition((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = blobVelocity.current;

        x += vx;
        y += vy;

        // Get viewport dimensions
        const maxX = window.innerWidth;
        const maxY = window.innerHeight;

        // Bounce off left and right boundaries
        if (x - BLOB_SIZE / 2 <= 0 || x + BLOB_SIZE / 2 >= maxX) {
          vx = -vx;
          blobVelocity.current.x = vx;
        }

        // Bounce off top and bottom boundaries
        if (y - BLOB_SIZE / 2 <= 0 || y + BLOB_SIZE / 2 >= maxY) {
          vy = -vy;
          blobVelocity.current.y = vy;
        }

        return { x, y };
      });

      const blob_boundary = 100

      // Update rectangles positions within the blob
      setRects((prevRects) =>
        prevRects.map((rect) => {
          let { x, y, vx, vy } = rect;

          x += vx;
          y += vy;

          // Bounce off blob boundaries (-50 to 50)
          if (x > blob_boundary || x < -blob_boundary) vx = -vx;
          if (y > blob_boundary || y < -blob_boundary) vy = -vy;

          return { x, y, vx, vy };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Clean up on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle color changes
  useEffect(() => {
    const colors = ['bg-dg-300', 'bg-dr-300', 'bg-dy-300', 'bg-dpi-300', 'bg-dpu-300'];
    let index = 0;

    const colorInterval = setInterval(() => {
      index = (index + 1) % colors.length;
      setColor(colors[index]);
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(colorInterval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {rects.map((rect, index) => (
        <div
          key={index}
          className={`absolute w-80 h-80 ${color} blur-3xl mix-blend-multiply rounded-full transition-colors duration-3000 opacity-30`}
          style={{
            left: 0,
            top: 0,
            transform: `translate(${blobPosition.x + rect.x}px, ${blobPosition.y + rect.y}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default Blob;
