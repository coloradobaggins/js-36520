
let getRandomNumber = function(max){
    return Math.floor(Math.random() * max);
}

/**
 * getArrWithRandomIndexes()
 * 
 * Retorna array con numeros aletorios, que son los indices del array de origen.
 * El array retornado tiene el largo expectedLength
 * Si el largo esperado es mayor al largo del array de origen (el que tiene los indices que importan), devuelve error
 * ya que no se podria genera dicho array con indices aletorios sin que se repitan.
 * 
 * @param {Array} originArray 
 * @param {int} expectedLength 
 * @returns {Array} con largo determinado por expectedLength, con posiciones de
 */

 let getArrWithRandomIndexes = function(originArray, expectedLength){
    
    if(originArray.length < expectedLength){
        
        console.error(`se espera un largo de array mayor al largo del array en que partimos para generae los numeros aleatorios. El largo esperado debe ser menor al largo del array inicial. Largo de array de origen: ${originArray.length}, largo esperado: ${expectedLength}`);
        return;
    }

    let randomIndexesArr = [];
    let newRandomIndex;


    while(randomIndexesArr.length < expectedLength){

        newRandomIndex = getRandomNumber(originArray.length);

        if(!randomIndexesArr.some((el) => el === newRandomIndex)){

            randomIndexesArr.push(newRandomIndex);

        }

    }
    
    return randomIndexesArr;

}

/**
 * 
 * @param {Array} a Recibe un array con elementos repetidos
 * @returns array   Devuelve array con elementos sin repetir
 */
function uniq(a) {
    return Array.from(new Set(a));
}



export { getArrWithRandomIndexes, uniq };