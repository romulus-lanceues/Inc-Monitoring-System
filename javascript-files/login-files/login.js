const loginForm = document.getElementById("login-form");
const studentId = document.querySelector(".student-number");
const passwordInput = document.querySelector(".password");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const accountNumber = studentId.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("../../php-files/login-files/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `accountNumber=${encodeURIComponent(
        accountNumber
      )}&password=${encodeURIComponent(password)}`,
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      //Store the Student Number in the local storage
      localStorage.setItem("accountNumber", accountNumber);
      //Store a value that the login process is successful
      localStorage.setItem("isLoggedIn", "true");
      if (result.account_type === "admin") {
        window.location.replace(
          "/inc-monitoring-system/html-files/admin-dashboard-files/admin-dashboard.html"
        );
      } else {
        window.location.replace(
          "/inc-monitoring-system/html-files/student-dashboard-files/student-dashboard.html"
        );
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Network error. Please try again.");
  }
});

//Show hide password logic
const toggleIcon = document.getElementById("toggle-button");

toggleIcon.addEventListener("click", function () {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";

  //toggle eye icon to change
  toggleIcon.classList.toggle("uil-eye");
  toggleIcon.classList.toggle("uil-eye-slash");
});