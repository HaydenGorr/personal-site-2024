import { useState, useEffect, useRef } from 'react';
import DraggableChip from '../draggable_chip';
import ToggleButton from '../toggle_button';
import MB_Button from '../MB_Button';

class ChipPosition {
    constructor(index) {
        this.index = index;
        this.and = null;
    }
}

export default function ChipFiltering({ selectedKeywords, reorderChipsCallback, remove_keywords, setMatchAnyChip, matchAnyChip }) {
    const [currentlyDraggedChip, setCurrentlyDraggedChip] = useState(null);
    const [chipArrangement, setChipArrangement] = useState([]);
    const [chipPositions, setChipPositions] = useState([]);

    const chipRefs = useRef([]);

    const replaceChip = (draggedChipIndex) => {
        const draggedChipPosition = chipPositions[draggedChipIndex];
        const newPositions = chipRefs.current.map(ref => ref.getBoundingClientRect());
        setChipPositions(newPositions);

        let newIndex = draggedChipIndex;
        for (let i = 0; i < newPositions.length; i++) {
            console.log("prescription")
            if (i !== draggedChipIndex && newPositions[i].left > draggedChipPosition.left) {
                newIndex = i;
                break;
            }
        }

        console.log("woah", chipRefs)

        if (newIndex !== draggedChipIndex) {
            const reorderedKeywords = [...chipArrangement];
            const [movedChip] = chipArrangement.splice(draggedChipIndex, 1);
            reorderedKeywords.splice(newIndex, 0, movedChip);
            setChipArrangement(reorderedKeywords);
        }
    };

    useEffect(() => {
        // const positions = chipRefs.current.map(ref => ref.getBoundingClientRect());
        // setChipPositions(positions);

        // chipRefs.current = chipRefs.current.slice(0, selectedKeywords.length);

        const newChipArrangement = selectedKeywords.map((item, index) => new ChipPosition(index));
        setChipArrangement(newChipArrangement);
    }, [selectedKeywords]);

    return (
        <div className={``}>
            {chipArrangement.length > 0 && (
                <div className="mx-3">
                    <div className="h-px prose mx-auto" />
                    <div className="flex flex-wrap justify-center">
                        {chipArrangement.map((item, index) => (
                            <div className="mr-3 mt-3 flex" key={index}>
                                <DraggableChip
                                    ref={el => (chipRefs.current[index] = el)}
                                    id={index}
                                    mouseDown={() => setCurrentlyDraggedChip(index)}
                                    mouseUp={() => {
                                        replaceChip(index);
                                        setCurrentlyDraggedChip(null);
                                    }}
                                    key={index}
                                    chip_text={selectedKeywords[item.index]}
                                    remove_keywords={remove_keywords}
                                    svg_path={"images/svgs/cancel.svg"}
                                />
                                {matchAnyChip === "custom" && selectedKeywords.length > 1 &&
                                    <div className={`flex ml-3 ${currentlyDraggedChip === index ? 'invisible' : ''}`}>
                                        <MB_Button key={index} text='or' />
                                    </div>
                                }
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-center items-center mt-6'>
                        <div className='m3-1'>{"match"}</div>

                        <div className='mx-1 w-fit over'>
                            <ToggleButton text={"any"} lowercase="true" btnAction={() => setMatchAnyChip("any")} toggled={matchAnyChip === "any"} />
                        </div>
                        <div className='mx-1'>
                            <ToggleButton text={"all"} lowercase="true" btnAction={() => setMatchAnyChip("all")} toggled={matchAnyChip === "all"} />
                        </div>

                        <div className='ml-1'>{"of the tags. Or "}</div>

                        <div className='mx-1'>
                            <ToggleButton text={"custom"} lowercase="true" btnAction={() => setMatchAnyChip("custom")} toggled={matchAnyChip === "custom"} />
                        </div>

                        <div className='ml-1'>{"filtering"}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
