
//Retrieve Data
const userFullNameInput = document.querySelector("#fullName");
const accountNumberInput = document.querySelector("#studentNumber");
const passwordInput = document.querySelector("#password");
const submitButton =document.querySelector(".signup-button");


submitButton.addEventListener("click", async function(e) {
    e.preventDefault();

    const userFullNameValue = userFullNameInput.value;
    const accountNumberInputValue = parseInt(accountNumberInput.value);
    const passwordInputValue = passwordInput.value;

    console.log(typeof(accountNumberInputValue));

    try {
        const response = await fetch("../../php-files/login-files/signup.php", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `name=${encodeURIComponent(userFullNameValue)}&accountNumber=${encodeURIComponent(accountNumberInputValue)}&password=${encodeURIComponent(passwordInputValue)}`
        });

        const data = await response.json();
        console.log(data);
        
        // Handle success/error based on your PHP response
        if (data.success) {
            // Handle successful signup

            //Store the accountNumber to the localStorage
            localStorage.setItem("accountNumber", accountNumberInputValue);
            localStorage.setItem("isLoggedIn", "true");
            window.location.replace("/inc_monitoring_system/html-files/login-files/login.html");
        } else {
            // Handle signup error
            alert("Unsuccessful Signup Attempt");
        }
        
    } catch (error) {
        console.error("Network error:", error);
        // Handle network errors
        alert("Unsuccessful Signup Attempt");
    }
});
