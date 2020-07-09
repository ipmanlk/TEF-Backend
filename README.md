## Setup Guide

### Prerequisites
- MySQL (XAMPP / WAMP / MYSQL Server)
- Node.js 12 or newer.
- Mysql Workbench.
- VSCodium.
  
### Setting up DB
1. Start MySQL Server. 
1. Download ``SmartAttendance-ER`` repository.
2. Open .mwb file with MySQL workbench.
3. If you already have a database named smart_attendnace delete it using phpmyadmin or mysql console.
4. Select ``Database --> Forward Engineer`` in the toolbar.
5. Click `Next` & tick ``Generate INSERT statements for tables``.
6. Keep hitting ``Next`` until forward engineering is complete.

### Instructions
1. Download both ``SmartAttendance-Backend`` and ``SmartAttendance-UI`` repos.
2. Place them inside a singe direcotry.
3. Rename ``SmartAttendance-Backend`` to `Backend`.
4. Rename ``SmartAttendance-UI`` to ``Frontend``.
   
ex,
```
-SmartAttendnace/
    -Frontend/
    -Backend/
```
5. Navigate to ``Backend`` directory in your terminal / commandline.
6. Run npm install.
7. Run npm start.
8. Navigate to ``http://localhost:3000``.