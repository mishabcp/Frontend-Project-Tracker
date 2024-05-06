#  Project Tracker


This project is a full stack application that includes a frontend built with React, a backend built with Spring Boot, and a MySQL database for data storage.

## Prerequisites
Before running the project, ensure you have the following software installed on your system:
- Node.js and npm (for React development)
- Java Development Kit (JDK) and IntelliJ IDEA (for Spring Boot development)
- MySQL Server and MySQL Workbench (for database management)
- Apache Tomcat or another servlet container (for running the Spring Boot backend)


## Steps to Run the Project

### Database Setup
1. **Install MySQL Server:** If MySQL Server is not already installed on your system, download and install it from the [official MySQL website](https://dev.mysql.com/downloads/mysql/).
2. **Open MySQL Workbench:** Launch MySQL Workbench and connect to your MySQL Server using the username and password as `root`.

3. **Create Database Schema:**
   - In MySQL Workbench, after connecting to your server, click on the "Create a new schema" button or go to File -> New Model to create a new schema.
   - Name the schema as `fullstackprojectdb`.
   - Note: Tables are not required to be manually created as Hibernate will automatically generate tables based on your entity classes in the Spring Boot application.


### Setting Up the Project Environment
1. **Clone the Repository:**
   - Open your terminal or command prompt.
   - Clone the GitHub repository using the following command:

     ```
     git clone https://github.com/mishabcp/Project-Tracker.git
     ```
   
2. **Set Up Backend (IntelliJ IDEA):**
   - Open IntelliJ IDEA.
   - open the backend folder ( foldername - demo ) as a project in IntelliJ IDEA.
  
   
3. **Set Up Frontend (VSCode):**
   - Open Visual Studio Code (VSCode).
   - Open the frontend folder ( foldername - frontend ) as a project in VSCode.
   - Open a terminal in VSCode and run the following command to install dependencies:

     ```
     npm install
     ```
   
4. **Run the Project:**
   - Start the backend server in IntelliJ IDEA.
   - Start the frontend development server by running the command `npm start` in the terminal within the frontend project folder. The application will automatically open in your default web browser.

5. **Access the Application:**
   - Ensure that both the backend and frontend servers are running for full functionality.