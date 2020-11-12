var variables = []
var variableCopy = []
var data = []
var mintermArray = []
var minterms
var selectedInput
var controlInputs = []
var result = []


const show = () => {
    data = []
    mintermArray = []
    controlInputs = []
    result = []


    variables = formatData('variables')
    minterms = formatData('minterms', 'int')
    const variableLength = variables.length
    variableCopy = [...variables]
    const multiplexerType = getValues('type')

    if (!validateInput(multiplexerType)) {
        alert('Number of variables exceed input lines \n Change multiplexer type')
        return
    }
    constructarray()
    generateTruthTables()
    separateInputs()
    compare()
    buildFinalArray(multiplexerType)
    createTable(data[0].length, variableLength, 'truthTable')
    createTable(controlInputs.length, 1, 'selectLines')
    createTable(result.length, 1, 'inputs')

    console.log(result, controlInputs)

}

const getValues = elementID => document.getElementById(elementID).value.trim();
const formatData = (elementID, type) => {

    var string = getValues(elementID)
    while (string.includes(' ')) {
        string = string.replace(" ", ",")
    }

    if (type === 'int') {

        return string.split`,`.map((x) => parseInt(x));

    }
    else {
        return string.split`,`.map((x) => x);

    }

}


const validateInput = (multiplexerType) => {

    if (Math.pow(2, variables.length - 1) > parseInt(multiplexerType)) {
        return false
    }
    return (true)
}

const generateTruthTables = () => {
    var toEnter = 0
    data.forEach((array, i) => {
        var writing = 0;
        while (writing != array.length) {
            const times = Math.pow(2, i)
            for (var j = 0; j < times; j++) {
                array[writing] = toEnter
                writing++

            }
            toEnter === 0 ? toEnter = 1 : toEnter = 0
        }
    });
}
const constructarray = () => {
    for (i = 0; i < variables.length; i++) {
        data.push(new Array(Math.pow(2, variables.length)))
    }
    generateMintermArray()
}
const generateMintermArray = () => {
    for (i = 0; i < Math.pow(2, variables.length,); i++) {
        mintermArray.push(minterms.includes(i) ? 1 : 0)
    }
}

const separateInputs = () => {
    selectedInput = variables.pop()
    const multiplexerType = document.getElementById("type").value;
    for (i = 1; i < Math.log2(multiplexerType); i++) {
        controlInputs.push(0)
    }
    var count = controlInputs.length;
    while (variables.length > 0) {
        const variable = variables.pop()
        controlInputs[count] = variable
        count--
    }

}
const compare = () => {

    for (i = 0; i < data[0].length; i += 2) {
        const tableValue1 = data[0][i]
        const tableValue2 = data[0][i + 1]
        const resultValue1 = mintermArray[i]
        const resultValue2 = mintermArray[i + 1]
        if (resultValue1 == 1 && resultValue2 == 1) {
            result.push(1)
        }
        else if (resultValue1 == 0 && resultValue2 == 0) {

            result.push(0)
        }
        else if ((resultValue1 === tableValue1) && (resultValue2 === tableValue2)) {

            result.push(selectedInput)
        }
        else {

            result.push(null)
        }
    }

}

const buildFinalArray = (multiplexerType) => {

    result.reverse()
    const length = result.length
    for (i = multiplexerType; i > length; i--) {
        result.unshift(0)
    }
}



const createTable = (rows, cols, parent) => {
    const table = document.getElementById(parent)
    const caption = document.createElement('caption')
    caption.innerHTML = titleCase(parent)

    removeAllChildNodes(table)
    table.appendChild(caption)
    data.reverse()

    if (parent === 'truthTable') {
        showHeaders(table, cols)
    }

    for (i = 0; i < rows; i++) {
        const row = document.createElement('tr')

        for (j = 0; j <= cols; j++) {
            const col = document.createElement('td')

            if (parent === 'truthTable') {
                if (j === cols) {

                    col.innerHTML = mintermArray[i]
                }

                else {
                    col.innerHTML = data[j][i];
                }

                if (j === cols - 1) {
                    col.setAttribute('class', 'select')
                }


            }

            if (parent === 'selectLines') {
                if (j === 0) {
                    col.innerHTML = `S${rows - i - 1}`
                }
                else {
                    col.innerHTML = controlInputs[i]
                }
            }

            if (parent === 'inputs') {
                if (j === 0) {
                    col.innerHTML = `I${rows - i - 1}`
                }
                else {
                    if (result[i] === null) {
                        col.innerHTML = selectedInput + "'"
                        col.style.color = 'red'
                    }
                    else {
                        col.innerHTML = result[i]
                    }

                }
            }


            row.appendChild(col)
        }
        table.appendChild(row)
    }
}

const titleCase = (text) => {
    var result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const showHeaders = (table, cols) => {
    const tr = document.createElement('tr')
    for (i = 0; i <= cols; i++) {
        const th = document.createElement('th')
        th.innerHTML = i === cols ? 'F(' + variableCopy.join() + ')' : variableCopy[i]

        if (i === cols - 1) {
            th.setAttribute('class', 'select')
        }
        tr.appendChild(th)

    }
    table.appendChild(tr)
}

