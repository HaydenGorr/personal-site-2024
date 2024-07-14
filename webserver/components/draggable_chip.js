import ClosableChip from "./closable_chip";
import { useEffect, useRef, useState } from "react";

export default function DraggableChip({ id, draggedCallback, chip_text, remove_keywords, index = 0, svg_path = "" }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isReset, setIsReset] = useState(false);
  const draggableRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX,
      y: e.clientY,
    });

    document.body.style.userSelect = 'none';

    if (draggedCallback) draggedCallback(id);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    console.log(e.clientY)

    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;
    if (draggableRef.current) {
      draggableRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    handleResetPosition();
    document.body.style.userSelect = 'auto';
    if (draggedCallback) draggedCallback(null);
  };

  const handleResetPosition = () => {
    setIsReset(true);
    if (draggableRef.current) {
      draggableRef.current.style.transform = "";
      draggableRef.current.style.left = "";
      draggableRef.current.style.top = "";
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  useEffect(() => {
    if (isReset) {
      // Reset position styles
      if (draggableRef.current) {
        draggableRef.current.style.transform = "";
        draggableRef.current.style.left = "";
        draggableRef.current.style.top = "";
      }
      setIsReset(false);
    }
  }, [isReset]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="z-40 h-8 absolute"
        style={{ cursor: 'grab', width: 'calc(100% - 2rem)' }}
        onMouseDown={handleMouseDown}
      />
      <div ref={draggableRef}>
        <ClosableChip chip_text={chip_text} remove_keywords={remove_keywords} index={index} svg_path={svg_path} />
      </div>
    </div>
  );
}
