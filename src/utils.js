module.exports = {
    tokens: {
        generate: () => {
            let token = "";
            const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

            for(let i = 0; i < 64; i++) {
                token += alphabet.charAt(Math.round(Math.random() * (alphabet.length - 1)));
            }
 
            return token;
        }
    }
}