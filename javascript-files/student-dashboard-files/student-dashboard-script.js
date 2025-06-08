// Check authenticity of the login process
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.replace("/inc-monitoring-system/html-files/login-files/login.html");
}

// Fetch the student data from the database once the page is loaded
window.addEventListener("DOMContentLoaded", getStudentData);

async function getStudentData() {
  const accountNumber = localStorage.getItem("accountNumber");

  try {
    const response = await fetch("../../php-files/student-dashboard-files/get-student-record.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: accountNumber=${encodeURIComponent(accountNumber)},
    });

    if (!response.ok) {
      throw new Error(HTTP error! status: ${response.status});
    }

    const studentData = await response.json();

    // Get the subjects of the student
    const subjects = studentData.subjects;

    // Update the dashboard
    updateDashboard(subjects, studentData.studentName);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function updateDashboard(subjects, studentName) {
  const statusContainer = document.getElementById("main-content");
  const studentNameEl = document.querySelector(".student-name");

  studentNameEl.textContent = studentName;

  subjects.forEach((subject) => {
    const subjectContainer = document.createElement("div");
    const subjectName = document.createElement("h3");
    const status = document.createElement("p");

    subjectName.textContent = subject.name;

    if (subject.status) {
      status.textContent = "Complete";
      status.classList.add("complete");
    } else {
      status.textContent = "Incomplete";
      status.classList.add("incomplete");
    }

    subjectContainer.appendChild(subjectName);
    subjectContainer.appendChild(status);
    subjectContainer.classList.add("subject-entry");
    statusContainer.appendChild(subjectContainer);
  });
}

// Add a function to the logout button
const logoutButton = document.querySelector(".logout-button");

const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accountNumber");
  window.location.replace(
    "/inc-monitoring-system/html-files/login-files/login.html"
  );
};

logoutButton.addEventListener("click", logout);