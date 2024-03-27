





















export default function InputBox({onChange, valueStorage, onFocus = () => {}, onBlur = () => {}}) {
    return (
        <input
            className="bg-black h-full w-full text-white px-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
            type="text"
            value={valueStorage} // Bind the input value to the component's state
            onChange={onChange} // Update the state every time the input changes
            onFocus={onFocus}
            onBlur={onBlur}
        />    
    )
}


















