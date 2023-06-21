// Function to encrypt plaintext using RSA algorithm
function rsaEncrypt(p, e, n) {
    // Convert plaintext to ASCII codes
    const asciiCodes = [];
    for (let i = 0; i < p.length; i++) {
        asciiCodes.push(p.charCodeAt(i));
    }

    // Encrypt ASCII codes using RSA algorithm
    const encryptedCodes = asciiCodes.map((code) => BigInt(code) ** BigInt(e) % BigInt(n));

    // Convert encrypted ASCII codes back to characters
    let ciphertext = '';
    for (let i = 0; i < encryptedCodes.length; i++) {
        const encryptedChar = String.fromCharCode(Number(encryptedCodes[i]));
        ciphertext += encryptedChar;
    }

    return ciphertext;
}

// Function to decrypt ciphertext using RSA algorithm
function rsaDecrypt(c, d, n) {
    // Convert ciphertext to ASCII codes
    const asciiCodes = [];
    for (let i = 0; i < c.length; i++) {
        asciiCodes.push(c.charCodeAt(i));
    }

    // Decrypt ASCII codes using RSA algorithm
    const decryptedCodes = asciiCodes.map((code) => BigInt(code) ** BigInt(d) % BigInt(n));

    // Convert decrypted ASCII codes back to characters
    let plaintext = '';
    for (let i = 0; i < decryptedCodes.length; i++) {
        const decryptedChar = String.fromCharCode(Number(decryptedCodes[i]));
        plaintext += decryptedChar;
    }

    return plaintext;
}

// Function to calculate the modular multiplicative inverse
function modInverse(a, m) {
    const [g, x] = extendedEuclidean(a, m);
    if (g !== 1n) {
        throw new Error('Inverse does not exist');
    }
    return (x % m + m) % m;
}

// Function to perform the extended Euclidean algorithm
function extendedEuclidean(a, b) {
    if (b === 0n) {
        return [a, 1n, 0n];
    }

    const [g, x, y] = extendedEuclidean(b, a % b);
    return [g, y, x - (a / b) * y];
}

// Function to calculate the greatest common divisor (GCD) of two numbers
function gcd(a, b) {
    if (b > a) {
        [a, b] = [b, a];
    }
    // Base case
    if (b === 0) {
        return a;
    }
    // Recursive case
    return gcd(b, a % b);
}

// Function to check if a number is prime
function isPrime(number) {
    if (number < 2) {
        return false;
    }

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }

    return true;
}

// Function to get a random prime number within a range
function getRandomPrime(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    while (!isPrime(randomNum)) {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return randomNum;
}

function generateKeyPair() {
    // Define the range of prime numbers
    const minNumber = 1;
    const maxNumber = 100;

    // Generate two random prime numbers
    const p = getRandomPrime(minNumber, maxNumber);
    var x;
    do {
        x = getRandomPrime(minNumber, maxNumber);
    } while (x == p);

    const q = x;

    // Calculate n and phi(n)
    const n = p * q;
    const phi_n = (p - 1) * (q - 1);

    // Find a suitable value for e (public exponent)
    x = 2;
    while (gcd(x, phi_n) != 1 && (x < phi_n)) {
        ++x;
    }
    const e = x;

    // Calculate the modular multiplicative inverse of e (private exponent)
    x = 1;
    while (((x * phi_n) + 1) % e != 0) {
        ++x;
    }
    const d = modInverse(BigInt(e), BigInt(phi_n));
    if (e == d) generateKeyPair();
    else return [n, e, d];
}

function generateKeyListener() {
    const [n, e, d] = generateKeyPair();
    // Write the values to the textareas
    document.getElementById("privateKey").value = n + ", " + d;
    document.getElementById("publicKey").value = n + ", " + e;
}

function encryptListener() {
    const plaintext = document.getElementById("plaintext").value;
    const encryptKey = document.getElementById("encryptKey").value;
    const [n, e] = encryptKey.split(", ");
    const encryptedText = rsaEncrypt(plaintext, e, n);
    document.getElementById("encryptedText").value = encryptedText; // Set the encrypted value in the textarea
}

function decryptListener() {
    const ciphertext = document.getElementById("decryptedText").value;
    const decryptKey = document.getElementById("decryptKey").value;
    const [n, d] = decryptKey.split(", ");
    const decryptedText = rsaDecrypt(ciphertext, d, n);
    document.getElementById("decryptedMessage").value = decryptedText; // Set the encrypted value in the textarea
}

// Reset input fields on page refresh
window.onload = function() {
    document.getElementById("privateKey").value = "";
    document.getElementById("publicKey").value = "";
    document.getElementById("plaintext").value = "";
    document.getElementById("encryptKey").value = "";
    document.getElementById("encryptedText").value = "";
    document.getElementById("decryptedText").value = "";
    document.getElementById("decryptKey").value = "";
    document.getElementById("decryptedMessage").value = "";
};
