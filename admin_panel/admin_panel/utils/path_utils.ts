import path from "path"

export const full_image_path_from_filename = (filename: string) : string => {return path.join(process.env.NEXT_PUBLIC_USER_ACCESS_CMS as string,'images',`${filename}`).toString() }
export const full_image_path_from_image_object = ({file_name}: {file_name:string}) : string => {return path.join(process.env.NEXT_PUBLIC_USER_ACCESS_CMS as string,'images',`${file_name}`).toString() }