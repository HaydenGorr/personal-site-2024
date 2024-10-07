export default function InputBox({onKeyPress, onChange, valueStorage, onFocus = () => {}, onBlur = () => {}, defaultText="default text", className}) {
    return (
        <input
            className={`bg-dg-600 text-dg-50 h-full w-full px-3 focus:outline-none rounded-md shadow-strong-drop ${className} placeholder-dg-300 placeholder-italic placeholder-opacity-75`}
            type="text"
            value={valueStorage} // Bind the input value to the component's state
            onChange={onChange} // Update the state every time the input changes
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={defaultText}
            onKeyPress={onKeyPress}
        />    
    )
}


















