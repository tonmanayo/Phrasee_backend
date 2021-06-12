/**
 * A function to set the context of a request, because I kept havig to repeat code
 * @param {any} context - The context to be returned
 * @param {any} payload - what to append to the context
 * @returns The context to the request for Azure
*/
const setContext = (context: any, payload: any) => {
    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        ...payload
    }
    return context
}

export default setContext