/**
 * Super simple validation function, this is just a basic example of some validation definitely needs some work
 * 
 * @param   {any} objectToValidate               - Some object to be validated
 * @param   {any} expectedObjectSchema           - The schema of the object to be validated
 * @returns {boolean}                            - Returns true if object is valid, false if object is in valid
 */
 const isValidSchema = (objectToValidate: any, expectedObjectSchema: any): boolean => {
     const objectToValidateKeys: Array<string> = Object.keys(objectToValidate)
     const expectedObjectKeys: Array<string> = Object.keys(expectedObjectSchema)

     // Check all required keys are included
     for (const key of expectedObjectKeys) {

         // Check the key isn't optional
        if (!key.includes('?') && objectToValidateKeys.indexOf(key) === -1) return false
     }

     // TODO check all Objects keys are valid
     // TODO check all types are valid

    return true
}

export default isValidSchema