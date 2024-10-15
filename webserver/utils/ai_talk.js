export const get_response = async ({ai, message}) => {

    if (!["CQ", "TF"].includes(ai)) {
        return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_AI}/api/${ai}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        });

        const data = await response.json();

        if (!response.ok || data.content[0].text.length == 0) {
            // throw new Error('Network response was not ok');
            return {error: true, data: "Sorry, Claude isn't picking up at the moment"}
        }

        return {error: false, data: data.content[0].text}; // Make sure this is the data you want
    } catch (error) {
        console.error('Error', error);
        return {error: true, data: "No response. Try again or wait until I fix it"}; // Return null or an appropriate error message
    }
};


export const send_tag_query_to_ai = async (user_message, querying_ai_callback=()=>{} ) => {
    if(user_message == "") {
        return {error: true, data: "No user input given"}
    };

    querying_ai_callback(true)

    // Get response from ai
    const answer = await get_response({ai: "TF", message: user_message})

    querying_ai_callback(false)

    if (answer.error) return answer

    // The Tag query resposes are in Json format so we must parse that
    const parsed = JSON.parse(answer.data);

    // Check the generated response has the attributes we need
    if (!('logical_filter' in parsed) || !('name' in parsed)){
        return {error: true, data: "That's strange - Claude gave us a bunch of gibberish"}
    }

    return {error: false, data: parsed}
    
};

export const send_chat_message_to_ai = async (user_message, querying_ai_callback=()=>{} ) => {
    if(user_message == "") {
        return
    };

    querying_ai_callback(true)

    // Get response from ai
    const answer = await get_response({ai: "CQ", message: user_message})

    querying_ai_callback(false)

    return answer
    
};