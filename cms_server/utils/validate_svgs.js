import { promises as fs } from 'fs';
import path from 'path';
import { svg_dir } from './path_consts.js';

/**
 * Reads the unique chips file and ensures every chips has an svg
 * @param {string} path_to_svgs - The path to the svg directors.
 * @param {string} path_to_unique_chips - The path to the unique_chips json file.
 * @returns {string} The SVG file name in lowercase.
 */
export async function validate_chips_have_svgs(path_to_svgs, path_to_unique_chips) {
    try {
        var passed = true;
        const jsonData = await fs.readFile(path_to_unique_chips, 'utf8');
        const uniqueChips = JSON.parse(jsonData);
    
        for (const chipPath of uniqueChips) {
            const svgFileName = `${path.basename(chipPath)}.svg`.toLowerCase();
            const svgFilePath = path.join(path_to_svgs, svgFileName);
  
            try {
                await fs.access(svgFilePath);
            } catch (error) {
                passed = false;
                console.error(`SVG file not found for chip: ${chipPath}`);
            }
        }
  
        console.log('SVG validation completed.');
        return passed
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return false
    }
}


export async function validate_chips_in_article(chips_array, chip_path) {
    try {
        var passed = true;
        
        for (const chipPath of chips_array) {
            const svgFileName = `${path.basename(chipPath)}.svg`.toLowerCase();
            const svgFilePath = path.join(svg_dir, svgFileName);
  
            try {
                await fs.access(svgFilePath);
            } catch (error) {
                passed = false;
                console.error(`SVG file not found for chip: ${chipPath}`);
            }
        }
  
        console.log('SVG validation completed.');
        return passed
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return false
    }
}
