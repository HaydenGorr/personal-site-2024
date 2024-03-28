export function generateUniqueChips(posts) {
    const allChips = posts.flatMap(post => post.chips);
    return [...new Set(allChips)];
}