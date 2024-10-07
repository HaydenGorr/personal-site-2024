const getTypeColour = (type) => {
    let lower_type = type.toLowerCase().split(" ").join("_")

    if (lower_type === "short_story") {
        return "bg-blue-300"
    }
    else if (lower_type === "script") {
        return "bg-orange-300"

    }
    return "bg-gray-300"
}

const getTypeImage = (type) => {
    let lower_type = type.toLowerCase().split(" ").join("_")

    if (lower_type === "short_story") {
        return "/images/svgs/portfolio/short_story.svg"
    }
    else if (lower_type === "script") {
        return "/images/svgs/portfolio/script.svg"
    }
    return "/images/svgs/portfolio/misc.svg"
}

const getTypeTitle = (type) => {
    let lower_type = type.toLowerCase().split(" ").join("_")

    if (lower_type === "short_story") {
        return "Short Story"
    }
    else if (lower_type === "script") {
        return "Script"
    }
    return "Misc."
}
  
  
  
  
  module.exports = { getTypeColour, getTypeImage, getTypeTitle };