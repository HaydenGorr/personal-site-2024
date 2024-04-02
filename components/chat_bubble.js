
export default function ChatBubble({key, incoming, inText="Example text"}) {

    const baseClasses = "p-4 my-2 border-black border-2";
    const incomingClasses = "bg-black self-start default_text_colour_white";
    const outgoingClasses = "default_colour self-end text-black";
  
    const classes = `${baseClasses} ${incoming === false ? outgoingClasses : incomingClasses}`;

    return (
        <div className={`p-3 my-2 border-2 shadow-MB prose ${incoming === false ? "Neo-Brutal-White self-end ml-3" : "self-start Neo-Brutal mr-3"}`}>
            {inText}
        </div>
    );
  }