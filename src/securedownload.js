/**
 *  Secure Download 
 *      Library to create password protected data on public static servers
**/

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

class SecureDownloadCryptoUtil {
    /**
     *  Attempt to initialize window.crypto for maximum support
    **/
    static initialize(){
        window.crypto = window.crypto || window.msCrypto; //for IE11
        if(window.crypto.webkitSubtle){
            window.crypto.subtle = window.crypto.webkitSubtle; //for Safari
        }
    }
    
    /**
     * Hash password with salt using SHA256
     * ! Depends on window.crypto
     * ! Will fail on IE and Opera Mini as of 23/03/2023 - string_to_byte_buffer
     * @param {string} plaintext password plaintext
     * @param {string} salt password salt
     * @returns {string} base64 encoded hash buffer
     */
    static async hashpassword(plaintext, salt){
        const passwordbytes = string_to_byte_buffer(plaintext + salt);
        const hashedbuffer = await window.crypto.subtle.digest({name: "SHA-256"}, passwordbytes);
        return Buffer.from(hashedbuffer).toString("base64");
    }

    /**
     * Validate password based on base64 passwordhash and salt
     * @param {string} attemptplaintext password attempt as a plaintext string 
     * @param {string} passwordhash base64 password hash - format returned from hashpassword
     * @param {string} salt password salt as a plaintext string
     * @returns {boolean} whether or not validation was successful
    **/
    static async validate(attemptplaintext, passwordhash, salt){
        const attempt = await SecureDownloadCryptoUtil.hashpassword(attemptplaintext, salt);
        return attempt == passwordhash;
    }
};

SecureDownloadCryptoUtil.initialize();
