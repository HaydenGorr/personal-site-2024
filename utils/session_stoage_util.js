export function get_messages() {
    // Retrieve the existing messages from sessionStorage
    const msgsString = window.sessionStorage.getItem('msgs');

    // Parse the string back into an object, or initialize as an empty array if null
    const msgs = msgsString ? JSON.parse(msgsString) : [];

    if (msgs.length < 1) msgs.push({ incoming: true, text: 'Hey feel free to ask anything about Hayden' });

    return msgs
}

export function store_chat_message({is_incoming, message}) {
    var msgs = get_messages()
    
    // Add the new message to the array of messages
    msgs.push({ incoming: is_incoming, text: message });
    
    // Convert the updated msgs array back into a string
    const updatedMsgsString = JSON.stringify(msgs);
    
    // Store the updated string in sessionStorage
    window.sessionStorage.setItem('msgs', updatedMsgsString);
}
