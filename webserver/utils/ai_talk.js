export const get_response = async ({ai, message}) => {

    if (!["CQ", "TF"].includes(ai)) {
        return;
    }

    try {
        console.log("LOCAL CMS", process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS)
        console.log("USER CMS", process.env.NEXT_PUBLIC_USER_ACCESS_CMS)
        console.log("LOCAL AI", process.env.NEXT_PUBLIC_LOCAL_ACCESS_AI)
        console.log("USER AI", process.env.NEXT_PUBLIC_USER_ACCESS_AI)
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_AI}/api/${ai}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("AI RESPONSE: ", data)
        return data.content[0].text; // Make sure this is the data you want
    } catch (error) {
        console.error('Error:', error);
        return null; // Return null or an appropriate error message
    }
};
