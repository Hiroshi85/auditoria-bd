export function getExceptionType(python_type : string){
    const exc_types: {[key: string]: string} = {
        'int': 'numeric',
        'str': 'alphanumeric',
        'date': 'date',
        'datetime': 'date',
    }
    return exc_types[python_type] || "";
}

export function checkAlphanumericCoincidence(str1 : string, str2: string ){
    let coincide = true 

    const regexp = /([a-zA-Z]?)(\d+)/;
    const match_1 = str1.match(regexp);
    const match_2 = str2.match(regexp);
    if (match_1 != null && match_2 != null) {
        const [letters1, digits1] = [match_1[1], match_1[2]];
        const [letters2, digits2] = [match_2[1], match_2[2]];
        if (letters1 !== letters2) 
            coincide = false;

        if (digits1.length !== digits2.length) {
            coincide = false;
        }
    }
    return coincide
}

export function getNumericPart(str: string){
    return parseInt(str.replace(/[^0-9]/g, ''));
}