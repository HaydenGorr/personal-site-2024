const ui_colours = require ('./ui_colours.json')

export default function hash_colour_picker(str){
    const number_of_colours = Object.keys(ui_colours).length
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % number_of_colours-1;
}