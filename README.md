# 📝 INC Monitoring System

A simple web-based system for monitoring student completion statuses (**Complete** or **Incomplete**) per subject. It allows students to check their status and gives instructors/admins the ability to update statuses in a secure admin dashboard.

---

## 📌 Features

- 🔐 Login & Signup for Students and Admins
- 🎓 Student Dashboard to view subject statuses
- 🧑‍🏫 Admin Dashboard to update statuses (Incomplete ➝ Complete)
- 📊 Subject-based status tracking and student list overview
- 🗃️ MySQL integration via PHP backend (XAMPP)

---

## 💻 Technologies Used

| Layer    | Tech Stack            |
| -------- | --------------------- |
| Frontend | HTML, CSS, JavaScript |
| Backend  | PHP                   |
| Database | MySQL (via XAMPP)     |

---

## 👤 User Roles

### 👨‍🎓 Student

- Log in via `login.html`
- View subjects and their current status in `student-dashboard.html`

### 🧑‍🏫 Admin / Instructor

- Log in via `login.html`
- Manage student statuses in `admin-dashboard.html`
- View subject lists and student performance breakdown

---

## 📁 Folder Structure

<pre> <code>```plaintext INC-MONITORING-SYSTEM/ ├── css-files/ │ ├── admin-dashboard-files/ │ │ └── admin-dashboard-style.css │ ├── login-files/ │ │ ├── login.css │ │ └── signup.css │ └── student-dashboard-files/ │ └── student-dashboard-style.css │ ├── html-files/ │ ├── admin-dashboard-files/ │ │ └── admin-dashboard.html │ ├── login-files/ │ │ ├── login.html │ │ └── signup.html │ └── student-dashboard-files/ │ └── student-dashboard.html │ ├── javascript-files/ │ ├── admin-dashboard-files/ │ │ └── admin-dashboard-script.js │ ├── login-files/ │ │ ├── login.js │ │ └── sign-up.js │ └── student-dashboard-files/ │ └── student-dashboard-script.js │ ├── php-files/ │ ├── admin-dashboard-files/ │ │ ├── get-instructor-name.php │ │ ├── get-passed-and-total-students.php │ │ ├── get-students-masterlist.php │ │ ├── get-subject-names.php │ │ └── update-student-status.php │ ├── login-files/ │ │ ├── login.php │ │ └── signup.php │ ├── shared-files/ │ │ └── db_configurations.php │ └── student-dashboard-files/ │ └── get-student-record.php ```</code> </pre>

## 🛠️ Setup Instructions

### 1. Clone or Download the Project

```bash
git clone https://github.com/yourusername/inc-monitoring-system.git
```

2. Set up XAMPP
   Start Apache and MySQL

Place the project folder inside C:\xampp\htdocs

3. Configure the Database
   Open http://localhost/phpmyadmin

Create a new database (e.g. inc_monitoring)

Import your .sql file containing the schema and sample data

4. Update DB Connection
   Open php-files/shared-files/db_configurations.php and check:
   $host = "localhost";
$username = "root"; // your MySQL username
   $password = "";     // your MySQL password
$database = "inc_monitoring";

5. Run the Application
   Visit http://localhost/INC-MONITORING-SYSTEM/html-files/login-files/login.html

Use a test student/admin account to log in

Lance Jade A. Buela
Jerrald Cliff Ramirez
Balmist Balansag
Jayvee Lumagbas
Mark Aries Akiatan
