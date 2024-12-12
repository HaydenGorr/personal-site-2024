

async function compare_meta_to_DB_entry(article_meta_json, DB_entry){
    
    var filteredEntries2 = {}
    
    Object.entries(article_meta_json).map(([key, value]) => {
        let differs = true
        if (key == "chips"){
            // If the chips don't match
            if (value.every((element => DB_entry[key].includes(element)))){
                differs = false
            }
        }

        if (DB_entry[key] == value ) differs = false
        
        if (differs) filteredEntries2[key] = value
    })

    return filteredEntries2
}


module.exports = {
    compare_meta_to_DB_entry
};
