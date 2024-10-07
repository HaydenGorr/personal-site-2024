function recursive_filtering_logic(parent_source, silbing_source, filter, or=false) {
    if (filter.length == 0) return {result: null, newor:null}

    const next_item_in_filter = filter[0]
    
    if (Array.isArray(next_item_in_filter)){
        let result = recursive_filtering_logic(parent_source, silbing_source, next_item_in_filter, or)
        return result
    }
    else if (typeof next_item_in_filter === 'string'){

        // It's an OR
        if (next_item_in_filter == "||"){
            const {result, newor} = recursive_filtering_logic(parent_source, silbing_source, filter.slice(1,filter.length), true)
            return {result: result, newor: true}
        }
        // It's an AND
        else if (next_item_in_filter == "&&"){
            const {result, newor} = recursive_filtering_logic(parent_source, silbing_source, filter.slice(1,filter.length), false)
            return {result: result, newor: false}
        }
        else {
            let a1= []
            a1 = silbing_source.filter(post => post.chips.includes(next_item_in_filter))
            let {result, newor} = recursive_filtering_logic(a1, silbing_source, filter.slice(1,filter.length), null)

            if (!result) {
                return {result: a1, or: null}
            }

            let a2 = []
            if (!newor){
                a2 = a1.filter(item => result.includes(item));
            }
            else {
                a2 = [...new Set([...a1, ...result])];
            }

            return a2
        }
    }
}

export default function recursive_filtering(parent_source, silbing_source, filter, or=false){
    if (filter.length == 0) return []
    
    const result = recursive_filtering_logic(parent_source, silbing_source, filter, or)

    if ('result' in result) return result.result
    else return result

}