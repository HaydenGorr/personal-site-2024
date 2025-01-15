




export function find_image_links_in_mdx(inMDX: string): string[] {

    const image_url_regex = RegExp(/https?:\/\/[^\s)]+?\.(jpg|jpeg|png)(\?[^\s)]+)?/g)

    return Array.from(inMDX.matchAll(image_url_regex), (m) => m[0]);

}