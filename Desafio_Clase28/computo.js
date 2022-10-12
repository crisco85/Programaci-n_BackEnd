const calculo = () => {
    let iterations = 100000000;

    if(!isNaN(Number(process.argv[2]))){
        iterations = Number(process.argv[2]);
    }

    let randomArray = [];
    let count = {};

    for (i=0; i<iterations; i++){
        randomArray[i] = Math.floor(Math.random() * (1000 - 1)) + 1;
    }

    randomArray.forEach(element => {
        count[element] = (count[element] || 0) + 1;
    })
    return count
}

let result = calculo();

process.send(result);

