import { getTirtaryColour } from "../utils/colour"

export default function LineBreak({ className, colour }) {
    return (
        <div class={`h-px ${className}`} style={{backgroundColor: getTirtaryColour(colour)}}/>
    )
}


















