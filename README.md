This repository is for exercises in Part 5 of Full Stack Open (FSO), "Testing React apps" - https://fullstackopen.com/en/part5

The exercises for this part build a front-end for the back-end server developed in Part 4, which is available in my respository FSO_04: https://github.com/djanyreason/FSO_04

The front-end is built in React, and is built off of the application in the github repository located at: https://github.com/fullstack-hy2020/bloglist-frontend

The frontend application is connected to the backend server and MongoDB database. Upon loading the react app, it presents a login screen. Upon successful login, the token is stored in local storage. After logging in, the page shows:
* A button to show or hide a form for adding a new blog
* A list of all blogs, with a button to toggle a more detailed view
* In the more detailed view, a button to add a "like" to the blog
* In the more detailed view, if the logged in user added the blog, a button to delete the blog from the database; doing this prompts an alert window to confirm

Status messages are displayed on the page based on failed or successful API calls (e.g., failed or successful login, successfully adding a new blog, a server error deleting a blog, etc.).

This project also includes testing the front-end using jest, contained in the subfolder /blogList_frontend/src/tests/; and end-to-end testing using Cypress, constained in the subfolder /blogList_frontend/cypress/.

The API also handles token-based user authentication.

The project also includes testing through jest - tests are included in the /blogList/tests subfolder.

Topics covered in this project include React, components, contrilling state with the useState hook, modifying state with the useRef hook, connecting front-end and back-end, local storage, PropTypes, linting, testing react apps with jest, end-to-end testing with Cypress.
