import Cookies from 'js-cookie'

export default function StyleCustomiserHeader({}) {
    return (
        <div className='flex justify-center items-center px-4'>
            <div className={`h-6 w-6 rounded-md transition-colors duration-500 mr-2 ${Cookies.get('backgroundColour') || "DarkGreyBackgroundColour"}`}/> 
            <div className={`${Cookies.get('user_font') || "font-Josefin"}`}>typeface</div>
        </div>
    );

  }