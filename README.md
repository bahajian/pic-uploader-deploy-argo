# pic-uploader

This project is a simple picture uploader application. It consists of two main folders:
1. **BE** (Backend)
2. **FE** (Frontend)

---

## Backend Setup (BE)
1. Log in to cPanel and create a Node.js server with the following settings:
   - **Domain**: `pic.ibstorm.com`
   - **Server File**: `server.js`
2. Copy all the files from the **BE** folder to the host server.

---

## Frontend Setup (FE)
1. Navigate to the **FE** folder on your local machine.
2. Install dependencies and build the project:
   ```bash
   npm install
   npm run build

- copy all of the files inside the build folder to the public folder inside the host.

---
- copy the .htaccess file to the pic.ibstorm.com folder beside the server.js file.


---
after stop and run npm install, in host and start the server, evary thing should work properly.



---
for checking the BE, you can use the postman or curl command.

- for getting file list you can use this command:
   ```bash
   curl -X GET https://pic.ibstorm.com/files 

- or using in browser:
   ```bash
   https://pic.ibstorm.com/files

- for file upload test you can use this command:
   ```bash
   curl -X POST -F "file=@/Users/bahramhajian/Desktop/1.png" https://pic.ibstorm.com/upload
