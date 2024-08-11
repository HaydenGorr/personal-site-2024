import { useState } from "react"

export default function Dropdown({ title="", dropdownOptions=[], callback={}}) {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div>
            <div>
            <button
                id="dropdownDefaultButton"
                onClick={() => setShowDropdown(!showDropdown)} 
                data-dropdown-toggle="dropdown" 
                className="text-white Neo-Brutal-White focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button">{title}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            
            <div id="dropdown" className={`absolute z-10 bg-white ${showDropdown ? '' : 'hidden'} divide-y divide-gray-100 rounded-lg shadow w-44 Neo-Brutal-White`} >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    {dropdownOptions.map((option, index) => (
                        <li key={index}>
                            <a className="block px-4 py-2 hover:bg-gray-100 text-center text-" onClick={() => {callback(title, option)}}>
                                {option}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
    )
}
