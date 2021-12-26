
var isUsernameValid = false;
var isEmailValid = false;
var isPasswordValid = false;
var isConfirmPassword = false;

function startsWithLetter(str) {

    if (str.length > 3 && str[0].match(/[a-zA-Z]/i)) {
        document.getElementById("nameErrorId").innerText = "";
        isUsernameValid = true;
    }

    else {
        document.getElementById("nameErrorId").innerText = "Must start with a letter. \n Must be greater than 3 letters.";
        isUsernameValid = false
    }
}


function showPassMsg() {
    document.getElementById("passwordMessageId").style.display = "block";
}

function hidePassMsg() {
    document.getElementById("passwordMessageId").style.display = "none";
}

function handlePassword(str) {
    let lengthEight = document.getElementById("isEightCharsId");
    let upperCaseletterMsg = document.getElementById("isUpperId");
    let numberMsg = document.getElementById("isNumberId");
    let specialMsg = document.getElementById("isSpecialId");

    let isUpperCase = false;
    let isDigit = false;
    let isSpecial = false;
    let isLengthEight = false;

    let special = /[/*-+!@#$^&*]/g;
    let digit = /[0-9]/g;
    let upper = /[A-Z]/g;

    if (str.match(special)) {
        specialMsg.classList.remove("error");
        specialMsg.classList.add("valid");
        isSpecial = true;
    }

    else {
        specialMsg.classList.remove("valid");
        specialMsg.classList.add("error");
        isSpecial = false;
    }

    if (str.match(digit)) {
        numberMsg.classList.remove("error");
        numberMsg.classList.add("valid");
        isDigit = true;
    }

    else {
        numberMsg.classList.remove("valid");
        numberMsg.classList.add("error");
        isDigit = false;
    }

    if (str.match(upper)) {
        upperCaseletterMsg.classList.remove("error");
        upperCaseletterMsg.classList.add("valid");
        isUpperCase = true;
    }

    else {
        upperCaseletterMsg.classList.remove("valid");
        upperCaseletterMsg.classList.add("error");
        isUpperCase = false;
    }

    if (str.length >= 8) {
        lengthEight.classList.remove("error");
        lengthEight.classList.add("valid");
        isLengthEight = true;
    }

    else {
        lengthEight.classList.remove("valid");
        lengthEight.classList.add("error");
        isLengthEight = false;
    }

    let confirmPassword = document.getElementById("confirmPassId").value;
    if(str == confirmPassword){
        isConfirmPassword = true;
    }

    else{
        isConfirmPassword = false;
    }

    if (isUpperCase && isDigit && isSpecial && isLengthEight) {
        isPasswordValid = true;
        document.getElementById("psErrorId").innerText = "";
    }

    else {
        isPasswordValid = false;
    }
}

function handleEmail(str) {
    if (str.length == 0) {
        isEmailValid = false;
    }

    else {
        isEmailValid = true;
        document.getElementById("emailErrorId").innerText = "";
    }
}

function confirmPassword(str) {
    let password = document.getElementById("pswordId").value;
    if (str == password) {
        isConfirmPassword = true;
        document.getElementById("confirmPasswordErrorId").innerText = "";
    }

    else{
        isConfirmPassword = false;
    }
}


function isValidForm() {
    //e.preventDefault();


    if (isPasswordValid && isUsernameValid && isConfirmPassword && isEmailValid) {
        //reset booleans
        isUsernameValid = false;
        isEmailValid = false;
        isPasswordValid = false;
        isConfirmPassword = false;

        return true;
    }

    if (!isUsernameValid) {
        document.getElementById("nameErrorId").innerText = "Error in username";
    }

    if (!isPasswordValid) {
        document.getElementById("psErrorId").innerText = "Error in password";
    }

    if (!isConfirmPassword) {
        document.getElementById("confirmPasswordErrorId").innerText = "Passwords don't match";
    }

    if (!isEmailValid) {
        document.getElementById("emailErrorId").innerText = "email cannot be empty";
    }

    alert("Wrong Input, check for errors.");
    return false;
}
