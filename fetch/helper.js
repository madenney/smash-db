

export const removeExtraSymbols = (s) => {
    if(s){
        while(s.indexOf("'") > -1){
            s = s.slice(0, s.indexOf("'")) + s.slice(s.indexOf("'") + 1)
        }
    }
    return s
}

export const containsNonUnicodeCharacters = (s) => {
    for (var i = 0; i < s.length; i++) {
        if (s.charCodeAt( i ) > 255) { return true; }
    }
    return false;
}