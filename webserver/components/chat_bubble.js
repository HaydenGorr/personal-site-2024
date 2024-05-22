import ReactMarkdown from 'react-markdown';

export default function ChatBubble({key, incoming, inText="Example text"}) {

    return (
        <div className={`Neo-Brutal-White p-3 my-2 border-2 shadow-MB prose ${incoming === false ? "self-end ml-6" : "self-start mr-6"}`}>
            <ReactMarkdown children={inText} />
        </div>
    );
  }