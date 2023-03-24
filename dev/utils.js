/**
 *  Utils to generate content to manually bake into static site
**/

// assert window.crypto.subtle exists
if(!window || !window.crypto || !window.crypto.subtle){
    throw new Error("window.crypto.subtle must be supported to use securedownload.js");
}

/**
 * Convert string to Uint8Array
 * ! Will fail on IE and Opera Mini as of 23/03/2023 - depends on TextEncoder
 * @param {string} string 
 */
function string_to_byte_buffer(string){
    if(!string_to_byte_buffer.encoder){
        string_to_byte_buffer.encoder = new TextEncoder("utf-8");
    }
    return string_to_byte_buffer.encoder.encode(string);
}

/**
 * 
 * @param {string} plaintext plaintext password you wish to bake into page
 * @param {string} salt salt string
 * @returns {string} base64 hash string to bake into static page
**/
function bake_password_to_string(plaintext, salt){
    const passwordbytes = string_to_byte_buffer(plaintext + salt);
    const hashedbuffer = await window.crypto.subtle.digest({name: "SHA-256"}, passwordbytes);
    return Buffer.from(hashedbuffer).toString("base64");
}
