"use strict";

// Check authenticity of the login process
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.replace("/inc-monitoring-system/html-files/login-files/login.html");
}

/*Retrieve Instructor name*/
const instructorNumber = localStorage.getItem("accountNumber");
const nameContainer = document.querySelector("#instructor-name");

(async () => {
  try {
    const res = await fetch("../../php-files/admin-dashboard-files/get-instructor-name.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `instructorNumber=${encodeURIComponent(instructorNumber)}`,
    });
    const data = await res.json();
    const instructorName = data.instructorName;
    nameContainer.textContent = instructorName;
  } catch (err) {
    console.log("An error occured", err);
  }
})();

//######################################################################################

/*Add The subjects button*/
window.addEventListener("DOMContentLoaded", getSubjectNames);

async function getSubjectNames() {
  try {
    const res = await fetch("../../php-files/admin-dashboard-files/get-subject-names.php", {
      method: "POST",
    });
    const data = await res.json();
    
    for (let i = 0; i < data.length; i++) {
      const buttonContainer = document.querySelector(".subjects-container");
      const button = document.createElement("button");
      button.classList.toggle("btns");
      button.textContent = data[i].replaceAll("_", " ").toUpperCase();
      buttonContainer.appendChild(button);
    }

    //Add event listeners
    addEventListenerToTheButtons();
    //generate a login button
    createLogoutButton();
    //Display the right side dashboard
    rightSideDashboard(data);
  } catch (err) {
    console.error("Fetch Error", err);
  }
}

//Add event listener to the generated subject buttons
function addEventListenerToTheButtons() {
  const subjectButtons = document.querySelectorAll(".btns");
  const studentList = document.querySelector(".student-inc-dashboard");
  const exitButton = document.querySelector(".fa-solid");
  //Subject name container in INC DASHBOARD
  const subjectName = document.querySelector(".subject-name");

  for (let i = 0; i < subjectButtons.length; i++) {
    subjectButtons[i].addEventListener("click", function () {
      if (!studentList.classList.contains("hidden")) {
        studentList.classList.add("hidden");
      }

      //Remove all the students info if there's one
      removeContents();
      subjectName.textContent = subjectButtons[i].textContent;
      studentList.classList.remove("hidden");

      //Return the subject nname to sql column name to be passed to the fetch function
      const subjectNameToQuery = subjectButtons[i].textContent
        .replaceAll(" ", "_")
        .toLowerCase();
      console.log(subjectNameToQuery);
      getSubjectStudentInfos(subjectNameToQuery);
    });
  }

  exitButton.addEventListener("click", function () {
    studentList.classList.add("hidden");
  });
}

//Add function when the student clicked the subject button
//View The masterlist and update a student's status

async function getSubjectStudentInfos(subjectName) {
  try {
    const res = await fetch("../../php-files/admin-dashboard-files/get-students-masterlist.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `subjectName=${encodeURIComponent(subjectName)}`,
    });
    const data = await res.json();
    
    const totalNoOfStudents = data.totalNumOfStudents;
    const studentInfos = data.studentInfos;
    const studentListContainer = document.querySelector(".student-lists");

    for (let i = 0; i < totalNoOfStudents; i++) {
      //Loop logic
      const statusContainer = document.createElement("div");
      const studentName = document.createElement("h3");
      const gradeStatus = document.createElement("p");
      gradeStatus.classList.add("dash-status");

      studentName.textContent = studentInfos[i].name;
      gradeStatus.textContent = studentInfos[i].status
        ? "Complete"
        : "Incomplete";
      statusContainer.appendChild(studentName);
      statusContainer.appendChild(gradeStatus);
      statusContainer.classList.add("student-info-container");

      studentListContainer.appendChild(statusContainer);
    }

    //Add event listerners to the containers
    const studentEntity = document.querySelectorAll(
      ".student-info-container"
    );

    console.log(studentEntity);
    for (let j = 0; j < studentEntity.length; j++) {
      studentEntity[j].addEventListener("click", function () {
        //Grab the element to be displayed
        const popup = document.querySelector(".student-status-container");
        const studentNameElement = document.querySelector(".s-name");
        //P element
        const studentStatusElement = document.querySelector(".status-bar");
        const updateButton = document.querySelector(".mark");

        //Close button
        const closeButton = document.querySelector(".close-btn");
        //Using the same studentinfo array since the order of which the querySelectorAll selects elements is in the same order of the loop above
        const studentName = studentInfos[j].name;
        const gradeStatus = studentInfos[j].status;
        //Show it
        popup.classList.remove("hidden");

        studentNameElement.textContent = studentName;
        studentStatusElement.textContent = gradeStatus
          ? "Complete"
          : "Incomplete";

        studentStatusElement.textContent === "Complete"
          ? studentStatusElement.classList.add("complete")
          : studentStatusElement.classList.add("incomplete");

        if (studentStatusElement.textContent !== "Incomplete") {
          updateButton.classList.add("hidden");
        }

        updateButton.onclick = () =>
          sendConfirmation(studentName, subjectName);

        closeButton.onclick = function () {
          closePopup(studentStatusElement);
          if (studentStatusElement.classList.contains("complete")) {
            studentStatusElement.classList.toggle("complete");
            updateButton.classList.toggle("hidden");
          } else {
            studentStatusElement.classList.toggle("incomplete");
          }
        };
      });
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

//Remove info
function removeContents() {
  const allStudentsInfo = document.querySelectorAll(".student-info-container");
  for (let i = 0; i < allStudentsInfo.length; i++) {
    allStudentsInfo[i].remove();
  }
}

//Close button function for popup
function closePopup(statusElement) {
  const popup = document.querySelector(".student-status-container");
  popup.classList.add("hidden");
}

//Tell database that a student is complete
async function sendConfirmation(studentName, subjectName) {
  const completed = 1;
  try {
    const res = await fetch("../../php-files/admin-dashboard-files/update-student-status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `studentName=${encodeURIComponent(
        studentName
      )}&subjectName=${encodeURIComponent(
        subjectName
      )}&status=${encodeURIComponent(completed)}`,
    });
    const data = await res.json();
    
    if (data.success) {
      const studentStatusElement = document.querySelector(".status-bar");
      const dashStatus = document.querySelector(".dash-status");
      const updateButton = document.querySelector(".mark");
      studentStatusElement.classList.add("complete");
      studentStatusElement.textContent = "Complete";
      dashStatus.textContent = "Complete";
      updateButton.classList.toggle("hidden");
      location.reload();
    } else {
      console.error("Failed to update student:", data.error);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

//############################################################################
//generate a logout button
function createLogoutButton() {
  const subjectsContainer = document.querySelector(".subjects-container");

  //create button
  const logoutButton = document.createElement("button");
  logoutButton.classList.toggle("logout");
  logoutButton.textContent = "Logout";

  subjectsContainer.appendChild(logoutButton);

  logoutButton.addEventListener("click", logoutUser);
}

//Logout Function
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("studentNumber");
  window.location.replace(
    "/inc_monitoring_system/html-files/login-files/login.html"
  );
}

//#################################################################################
//Display

function rightSideDashboard(subjects) {
  // subjects is an array of subjects
  for (let i = 0; i < subjects.length; i++) {
    getSubjectData(subjects[i]);
  }
}

// Support function for displaying subject data
async function getSubjectData(subjectName) {
  try {
    const res = await fetch("../../php-files/admin-dashboard-files/get-passed-and-total-students.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `subjectName=${encodeURIComponent(subjectName)}`,
    });
    const data = await res.json();
    
    const passed = data.passedStudents;
    const total = data.totalStudents;

    // Create HTML elements dynamically
    const infoContainer = document.querySelector(".info-container");
    const subContainer = document.createElement("div");
    subContainer.classList.add("subject-info-container");

    const subName = document.createElement("h3");
    const studentsEnrolled = document.createElement("p");

    subName.textContent = subjectName.replaceAll("_", " ").toUpperCase();
    studentsEnrolled.textContent = `Students Passed: ${passed} / ${total}`;

    subContainer.appendChild(subName);
    subContainer.appendChild(studentsEnrolled);
    infoContainer.appendChild(subContainer);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

//######################################################################################

//Notification System


// Notification System

const bellIcon = document.querySelector(".fa-bell");

bellIcon.addEventListener("click", function () {
  const container = createNotificationContainer(); // Create a new one each time
  getNotifications(container.querySelector(".notifications"), container);
});

// Get the notifications
async function getNotifications(notificationsElement, containerElement) {
  try {
    const response = await fetch("../../php-files/admin-dashboard-files/get-notifications.php");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const totalNotifications = data.totalNotifications;
    const isRead = data.allRead;
    const notifications = data.notifications;

    console.log(totalNotifications, isRead, notifications);

    notifications.forEach((notification) => {
      const studentName = notification.student_name;
      const subject = notification.subject_name;
      createNotifactions(studentName, subject, notificationsElement);
    });

    // Handle close just for this panel
    const closeButton = containerElement.querySelector(".fa-times");
    closeButton.addEventListener("click", () => {
      containerElement.remove(); // Remove only this panel
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

// Create notification container elements and return the container
function createNotificationContainer() {
  const notificationsContainer = document.createElement("section");
  const notifications = document.createElement("div");
  const header = document.createElement("h3");
  const icon = document.createElement("i");

  notificationsContainer.classList.add("notifications-container");
  notifications.classList.add("notifications");
  header.classList.add("n-message");
  icon.classList.add("fas", "fa-times");

  header.textContent = "Notifications";

  notificationsContainer.appendChild(notifications);
  notifications.appendChild(header);
  notifications.appendChild(icon);

  document.body.append(notificationsContainer);

  return notificationsContainer; // So we can use it later
}

// Create notification elements
function createNotifactions(studentname, subject, parentElement) {
  const notificationContainer = document.createElement("div");
  const notificationElement = document.createElement("div");
  const studentName = document.createElement("h3");
  const subjectName = document.createElement("p");

  notificationContainer.classList.add("notification-container");
  notificationElement.classList.add("notification");

  studentName.textContent = studentname;
  subjectName.textContent = subject;

  notificationElement.appendChild(studentName);
  notificationElement.appendChild(subjectName);
  notificationContainer.appendChild(notificationElement);
  parentElement.appendChild(notificationContainer);
}


