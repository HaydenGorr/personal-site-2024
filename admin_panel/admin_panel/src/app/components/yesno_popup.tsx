interface props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onConfirm: () => void;
    message: string;
  }
  
  export default function YesNoPopup({ isOpen, setIsOpen, onConfirm, message }: props) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-2">
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