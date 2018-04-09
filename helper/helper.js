
import jsStringEscape from "js-string-escape"

export const removeExtraSymbols = (s) => {
    if(s){
        while(s.indexOf("'") > -1){
            s = s.slice(0, s.indexOf("'")) + s.slice(s.indexOf("'") + 1)
        }
        while(s.indexOf("\\") > -1){
            s = s.slice(0, s.indexOf("\\")) + s.slice(s.indexOf("\\") + 1)
        }
        while(s.indexOf(";") > -1){
            s = s.slice(0, s.indexOf(";")) + s.slice(s.indexOf(";") + 1)
        }
    }
    return s
}

export const removeNonUnicode = (s) => {
    if(s){
       for(var i = 0; i < s.length; i++){
            if(s.charCodeAt(i) > 255){
                s = s.slice(0,i) + s.slice(i+1)
                i--
            }
        } 
    }  
    return s
}

export const recursiveStringEscape = (obj) => {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === "object") {
                recursiveStringEscape(obj[property]);
            } else {
                obj[property] = jsStringEscape(obj[property]);
            }
        }
    }
};

export const checkForHugeStrings = (obj) => {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === "object") {
                if(checkForHugeStrings(obj[property])){
                    return true;
                }
            } else {
                if(property.length > 500){
                    return true;
                }
                if(obj[property].length > 500){
                    return true;
                }
            }
        }
    }
    return false;
};