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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.content[0].text; // Make sure this is the data you want
    } catch (error) {
        console.error('Error:', error);
        return null; // Return null or an appropriate error message
    }
};
