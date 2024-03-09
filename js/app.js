let encryptKey = document.getElementById("encryptKey");
let decryptKey = document.getElementById("decryptKey");
let encryptedMsg = document.getElementById("encryptedMsg");
let matrixEn = document.getElementById("matrixEn");
let matrixDe = document.getElementById("matrixDe");

const input = document.getElementById("inputMsg");
const output = document.getElementById("outputMsg");

input.addEventListener("input", updateOutput);
encryptKey.addEventListener("input", updateOutput);
decryptKey.addEventListener("input", updateOutput);

function setMatrixEn(matrix, key) {
    matrixtext = "";
    for(i = 0; i < 5; i++) {
	matrixtext += "[ ";
        for(j = 0; j < 5; j++) {
	    if(5*i + j < key.length) {
		matrixtext += "<span class=\"keyletters\">" + mat[i][j] + "</span> ";
	    }
	    else {
		matrixtext += mat[i][j] + " ";
	    }
	}
	matrixtext += "]<br>";
    }

    matrixEn.innerHTML = matrixtext;
}

function setMatrixDe(matrix, key) {
    matrixtext = "";
    for(i = 0; i < 5; i++) {
	matrixtext += "[ ";
        for(j = 0; j < 5; j++) {
	    if(5*i + j < key.length) {
		matrixtext += "<span class=\"keyletters\">" + mat[i][j] + "</span> ";
	    }
	    else {
		matrixtext += mat[i][j] + " ";
	    }
	}
	matrixtext += "]<br>";
    }

    matrixDe.innerHTML = matrixtext;
}

function updateOutput() {
    encryptKey.value = encryptKey.value.toUpperCase();
    decryptKey.value = decryptKey.value.toUpperCase();
    input.value = input.value.toUpperCase();
    let inputValue = input.value;
    let encryptKeyValue = encryptKey.value;
    let decryptKeyValue = decryptKey.value;

    encrypt(inputValue, encryptKeyValue);
}

function encrypt(message, keyword) {
    
    keyword = keyword.toUpperCase();
    let excluded = "J";
    let alphabet = new Array();
    
    for(i = 0; i < 26; i++) {
        alphabet.push(String.fromCharCode(i + 65));
    }
    
    key = "";
    
    for(i = 0; i < keyword.length; i++) {
        if(!key.includes(keyword[i]) && keyword[i] != excluded) {
            key += keyword[i];
        }
    }
    
    mat = new Array()

    for(i = 0; i < 5; i++) {
    	mat.push(new Array());
        for(j = 0; j < 5; j++) {
        	mat[i].push("")
        }
    }
    
    mapping = {}
    
    for(i = 0; i < key.length; i++) {
        mat[Math.floor(i/5)][i%5] = key[i];
        mapping[key[i]] = [Math.floor(i/5), i%5]
    }
    
    idx = key.length;
    for(i = 0; i < alphabet.length; i++) {
        if(!key.includes(alphabet[i]) && alphabet[i] != excluded) {
            mat[Math.floor(idx/5)][idx%5] = alphabet[i];
            mapping[alphabet[i]] = [Math.floor(idx/5), idx%5]
            idx += 1
        }
    }
    
    message = message.toUpperCase();
    encrypted = "";
    
    i = 0;
    while (i < message.length) {
        if (i+1 < message.length) {
            a = message[i];
            b = message[i+1];
            if(a != b)
                digram = a+b;
            else {
                digram = a+"X";
                i -= 1;
            }
        }
        else {
            digram = message[i] + "X";
        }
        
        i+=2;
        
        row1 = mapping[digram[0]][0]
    	col1 = mapping[digram[0]][1]
        row2 = mapping[digram[1]][0]
    	col2 = mapping[digram[1]][1]
    
        // if in same row, take the adjacent letters to the right in that row (%5 for wrapping around the row)
        if (row1 == row2) {
          encrypted += mat[(row1 + 1)%5][col1]
          encrypted += mat[(row2 + 1)%5][col2]
	}
    
        // if in same row, take the adjacent letters below in that row (%5 for wrapping around the row)
        else if (col1 == col2) {
          encrypted += mat[row1][(col1 + 1)%5]
          encrypted += mat[row2][(col2 + 1)%5]
	}
    
       // else take the letter in the same row of one letter and the column of the other letter in the digram
        else {
          encrypted += mat[row1][col2]
          encrypted += mat[row2][col1]
	}
    }
    
    setMatrixEn(mat, key);
    
    decrypt(encrypted, decryptKey.value);
}

function decrypt(encrypted, keyword) {
    encrypted = encrypted.toUpperCase();
    keyword = keyword.toUpperCase();
    let excluded = "J";
    let alphabet = new Array();
    
    for(i = 0; i < 26; i++) {
        alphabet.push(String.fromCharCode(i + 65));
    }
    
    key = "";
    
    for(i = 0; i < keyword.length; i++) {
        if(!key.includes(keyword[i]) && keyword[i] != excluded) {
            key += keyword[i];
        }
    }
    
    mat = new Array()

    for(i = 0; i < 5; i++) {
    	mat.push(new Array());
        for(j = 0; j < 5; j++) {
        	mat[i].push("")
        }
    }
    
    mapping = {}
    
    for(i = 0; i < key.length; i++) {
        mat[Math.floor(i/5)][i%5] = key[i];
        mapping[key[i]] = [Math.floor(i/5), i%5]
    }
    
    idx = key.length;
    for(i = 0; i < alphabet.length; i++) {
        if(!key.includes(alphabet[i]) && alphabet[i] != excluded) {
            mat[Math.floor(idx/5)][idx%5] = alphabet[i];
            mapping[alphabet[i]] = [Math.floor(idx/5), idx%5]
            idx += 1
        }
    }
    
    decrypted = "";

    for(i = 0; i < encrypted.length; i+=2) {
        a = encrypted[i];
        b = encrypted[i+1];
	    digram = a + b;
        row1 = mapping[digram[0]][0]
    	col1 = mapping[digram[0]][1]
        row2 = mapping[digram[1]][0]
    	col2 = mapping[digram[1]][1]

        if (row1 == row2) {
          decrypted += mat[(row1 - 1)%5][col1]
          decrypted += mat[(row2 - 1)%5][col2]
	}
    
        else if (col1 == col2) {
          decrypted += mat[row1][(col1 - 1)%5]
          decrypted += mat[row2][(col2 - 1)%5]
	}
    
        else {
          decrypted += mat[row1][col2]
          decrypted += mat[row2][col1]
	}
    }
    setMatrixDe(mat, key);
    
    updateData(decrypted, encrypted);
}

function updateData(decryptedMsgText, encryptedMsgText) {
    output.value = decryptedMsgText;
    encryptedMsg.innerHTML = encryptedMsgText;
}
