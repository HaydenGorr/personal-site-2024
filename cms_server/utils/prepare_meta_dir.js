import { promises as fs } from 'fs';

export async function does_temp_meta_dir_exist(path_to_temp_dir) {
  try {
    const stats = await fs.stat(path_to_temp_dir);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}
export async function make_temp_dir(path_to_meta_dir) {
    try {
        // Use path.join to ensure the correct path format
        await fs.mkdir(path_to_meta_dir, { recursive: true });
        return true;
    } catch (err) {
        console.error(err); // It's often good to log the error for debugging.
        return false;
    }
}

export async function delete_temp_dir(path_to_meta_dir) {
    try {
        // Use path.join to ensure the correct path format
        await fs.rm(path_to_meta_dir, { recursive: true });
        return true;
    } catch (err) {
        console.error(err); // It's often good to log the error for debugging.
        return false;
    }
}
