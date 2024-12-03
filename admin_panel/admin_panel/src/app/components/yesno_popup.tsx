interface props {
    isOpen: Boolean;
    setIsOpen: (value: Boolean) => void;
    onConfirm: () => void;
    message: string;
    styled_item: string;
  }
  
  export default function YesNoPopup({ isOpen, setIsOpen, onConfirm, message, styled_item }: props) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
        <div className=" bg-neutral-900 p-6 rounded-lg shadow-lg max-w-sm">
          <p className="mb-4">{`${message} `}<span className="text-neutral-300 font-semibold bg-neutral-800 px-2 py-1 rounded-lg">{`${styled_item}`}</span></p>
          <div className="flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              No
            </button>
            <button
              onClick={() => {
                onConfirm();
                setIsOpen(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }