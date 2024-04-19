export default function InputBox({onKeyPress, onChange, valueStorage, onFocus = () => {}, onBlur = () => {}, defaultText="default text", className}) {
    return (
        <input
            className={`Neo-Brutal h-full w-full px-3 focus:outline-none ${className}`}
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


















