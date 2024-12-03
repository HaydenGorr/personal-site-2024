export interface api_return_schema<T> {
    data: T
    error: error
}

export interface error {
    has_error: Boolean,
    error_message: string
}

export const read_MDX_file = async (file: File): Promise<api_return_schema<string>> => {
    const readFileContent = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            
            reader.onload = (event) => {
                const content = event.target?.result
                if (typeof content === 'string') {
                    resolve(content)
                } else {
                    reject(new Error('Failed to read file as string'))
                }
            }
            
            reader.onerror = () => {
                reject(new Error('Error reading file'))
            }
            
            reader.readAsText(file)
        })
    }

    try {
        const mdxContent = await readFileContent()
        console.log('MDX content:', mdxContent)
        return {data: mdxContent, error: {has_error:false, error_message:""}}
    } catch (error) {
        console.error('Error reading MDX file:', error)
        return {data: "", error: {has_error:false, error_message:`Error reading MDX file: ${error}`}}
    }
}