

// Only works on ios
const updateThemeColor = (color) => {
  let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMetaTag) {
    themeColorMetaTag = document.createElement('meta');
    themeColorMetaTag.name = 'theme-color';
    document.head.appendChild(themeColorMetaTag);
  }
  themeColorMetaTag.content = color;
};


const colour_array = ["WhiteBackgroundColour", "CreamBackgroundColour", "GreyBackgroundColour", "DarkGreyBackgroundColour"]

const getPrimaryColour = (backgroundColour) => {
  if (backgroundColour === 'WhiteBackgroundColour') return "#fafafa"
  else if (backgroundColour === 'CreamBackgroundColour')  return "#f6f2e6"
  else if (backgroundColour === 'GreyBackgroundColour')  return "#4a494d"
  else if (backgroundColour === 'DarkGreyBackgroundColour') return "#121212"
  else return "#fafafa"
}


const getSecondaryColour = (backgroundColour) => {
  if (backgroundColour === 'WhiteBackgroundColour') return "#262626"
  else if (backgroundColour === 'CreamBackgroundColour')  return "#262626"
  else if (backgroundColour === 'GreyBackgroundColour')  return "#f5f5f5"
  else if (backgroundColour === 'DarkGreyBackgroundColour') return "#f5f5f5"
  else return "#262626"
}

const getTirtaryColour = (backgroundColour) => {
  if (backgroundColour === 'WhiteBackgroundColour') return "rgb(230, 230, 230)"
  else if (backgroundColour === 'CreamBackgroundColour')  return "rgb(195, 191, 182)"
  else if (backgroundColour === 'GreyBackgroundColour')  return "rgb(60, 60, 63)"
  else if (backgroundColour === 'DarkGreyBackgroundColour') return "rgb(56, 56, 56)"
  else return "rgb(230, 230, 230)"
}

const getTextColour = (backgroundColour) => {
  if (backgroundColour === 'WhiteBackgroundColour') return "rgb(38, 38, 38)"
  else if (backgroundColour === 'CreamBackgroundColour')  return "rgb(38, 38, 38)"
  else if (backgroundColour === 'GreyBackgroundColour')  return "rgb(230, 230, 230)"
  else if (backgroundColour === 'DarkGreyBackgroundColour') return "rgb(242, 242, 242)"
  else return "rgb(18, 18, 18)"
}


const getDarkerColour = (backgroundColour) => {
  if (backgroundColour === 'WhiteBackgroundColour') return "rgb(219, 219, 219)"
  else if (backgroundColour === 'CreamBackgroundColour')  return "rgb(212, 203, 178)"
  else if (backgroundColour === 'GreyBackgroundColour')  return "rgb(51, 50, 54)"
  else if (backgroundColour === 'DarkGreyBackgroundColour') return "rgb(36, 36, 36)"
  else return "rgb(18, 18, 18)"
}







module.exports = { getPrimaryColour, getSecondaryColour, getTirtaryColour, getTextColour, updateThemeColor, getDarkerColour, colour_array };