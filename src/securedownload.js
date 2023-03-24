/**
 *  Secure Download 
 *      Library to create password protected data on public static servers
**/

/**
 * @returns {boolean} if false js environment is unsupported
**/
function securedownload_check_environment_support(){
    try{
        const ensure = window && window.crypto && window.crypto.suble && TextEncoder && Buffer && Uint8Array;
        return !!ensure;
    } catch {
        return false;
    }
}

/**
 * Convert string to Uint8Array
 * @param {string} string 
 * @returns {Uint8Array} Uint8Array representation of string
**/
function string_to_byte_buffer(string){
    if(!string_to_byte_buffer.encoder){
        string_to_byte_buffer.encoder = new TextEncoder("utf-8");
    }
    return string_to_byte_buffer.encoder.encode(string);
}

/**
 * Validate password based on base64 passwordhash and salt
 * @param {string} attemptplaintext password attempt as a plaintext string 
 * @param {string} passwordhash base64 password hash - format returned from hashpassword
 * @param {string} salt password salt as a plaintext string
 * @returns {boolean} whether or not validation was successful
**/
async function validate_password(attemptplaintext, passwordhash, salt){
    const passwordbytes = string_to_byte_buffer(plaintext + salt);
    const hashedbuffer = await window.crypto.subtle.digest({name: "SHA-256"}, passwordbytes);
    const attempt = Buffer.from(hashedbuffer).toString("base64");
    return attempt == passwordhash;
}
