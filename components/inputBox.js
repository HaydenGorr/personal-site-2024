export default function InputBox({onKeyDown, onChange, valueStorage, onFocus = () => {}, onBlur = () => {}, defaultText="default text"}) {
    return (
        <input
            className="Neo-Brutal h-full w-full px-3 focus:outline-none"
            type="text"
            value={valueStorage} // Bind the input value to the component's state
            onChange={onChange} // Update the state every time the input changes
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={defaultText}
            onKeyDown={onKeyDown}
        />    
    )
}


















