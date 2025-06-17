// Check authenticity of the login process
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.replace("/inc-monitoring-system/html-files/login-files/login.html");
}

// Fetch the student data from the database once the page is loaded
window.addEventListener("DOMContentLoaded", getStudentData);
// window.addEventListener("DOMContentLoaded", createPopUpElements);

let studentSubjectArray =[];
let studentName = null;


async function getStudentData() {
  const accountNumber = localStorage.getItem("accountNumber");

  try {
    const response = await fetch("../../php-files/student-dashboard-files/get-student-record.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `accountNumber=${encodeURIComponent(accountNumber)}`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

function updateDashboard(subjects, studentNameValue) {
  const statusContainer = document.getElementById("main-content");
  const studentNameEl = document.querySelector(".student-name");

  studentSubjectArray = [];
  studentName = studentNameValue;
  studentNameEl.textContent = studentNameValue;

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

    studentSubjectArray.push(subjectContainer);
  });

  addListenersToEntries();
}

//Get all the entries create

function addListenersToEntries(){
for(let i = 0; i < studentSubjectArray.length; i++){
  const subjectName = studentSubjectArray[i].querySelector("h3").textContent;
  const studentStatus = studentSubjectArray[i].querySelector("p").textContent;
  studentSubjectArray[i].addEventListener("click", () => createPopUpElements(subjectName, studentStatus));
}
}

//Create the popup
function createPopUpElements(name, status){
  const checkSubjectContainer = document.createElement("section");
  const checkSubjectPanel = document.createElement("div");
  const closebuttonElement = document.createElement("button");
  const notifyButton = document.createElement("button");
  const studentNameElement = document.createElement("h3");
  const statusElement =  document.createElement("p");

  checkSubjectPanel.classList.add("check-subject-panel");
  checkSubjectContainer.classList.add("check-subject-container");
  closebuttonElement.classList.add("close-button");
  notifyButton.classList.add("notify-button");

  //Fixed Texts
  closebuttonElement.textContent = "X";
  notifyButton.textContent = "Notify Instructor";


  checkSubjectContainer.appendChild(checkSubjectPanel);
  checkSubjectPanel.appendChild(closebuttonElement);
  checkSubjectPanel.appendChild(studentNameElement);
  checkSubjectPanel.appendChild(statusElement);
  checkSubjectPanel.appendChild(notifyButton);

  //To be changed once database connection is set up
  studentNameElement.textContent = name;
  statusElement.textContent = status;

  if(statusElement.textContent !== "Incomplete"){
    notifyButton.remove();
    const mainElement = document.querySelector("main");
   mainElement.appendChild(checkSubjectContainer);
  closePopUp(checkSubjectContainer);
  }
  else{
    // //Close button for the notify instructor tab
    const mainElement = document.querySelector("main");
     mainElement.appendChild(checkSubjectContainer);
    closePopUp(checkSubjectContainer);
      notifyInstructor(checkSubjectContainer);
  }
}

function notifyInstructor(popup){
  const notifyButton = popup.querySelector(".notify-button");
  //Get the student info 
  const infoContainer = popup.querySelector("div");
  const subjectName = infoContainer.querySelector("h3").textContent;
  notifyButton.addEventListener("click", () => sendNotification(studentName, subjectName));
}
function closePopUp(popup){
  const closeButton = popup.querySelector(".close-button");
  closeButton.addEventListener("click", function(){
    popup.remove();
  })
}

async function sendNotification(studentName, subject) {
  console.log(studentName, subject);
    try {
        const response = await fetch('../../php-files/student-dashboard-files/notify-instructor.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName: studentName,
                subjectName: subject
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Notification sent successfully:', result.message);
            return { success: true, data: result };
        } else {
            console.error('Failed to send notification:', result.error);
            return { success: false, error: result.error };
        }
        
    } catch (error) {
        console.error('Network error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}


// Add a function to the logout button
const logoutButton = document.querySelector(".logout-button");

const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accountNumber");
  window.location.replace(
    "/inc_monitoring_system/html-files/login-files/login.html"
  );
};

logoutButton.addEventListener("click", logout);