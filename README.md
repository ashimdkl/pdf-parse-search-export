# PDF Keyword Analyzer

This project is a web application built with [Create React App](https://github.com/facebook/create-react-app) for analyzing PDF documents and locating specific keywords within them. The application provides two main functionalities: a main page for uploading and searching keywords across multiple PDF files, and a locate specifics page for detailed keyword occurrences on individual pages of a PDF.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Main Page Functionality

The main page allows users to upload PDF files and search for specific keywords within those files. The results show the occurrences of the keywords on each page of the PDFs.

### `onDrop`

Handles file drop and reads the PDF files. Extracts text content from each page and stores it in the state.

### `handleSearch`

Prompts the user for keywords and searches for those keywords in the uploaded PDF files. Counts the occurrences of each keyword on each page.

### `handleDownload`

Downloads the search results as an Excel file for further analysis or record-keeping.

### `handleKeywordClick`

Allows users to view the specific page of a PDF where a keyword is found.

## Locate Specifics Page Functionality

The locate specifics page allows users to upload a single PDF file and search for specific keywords. It displays the number of occurrences of each keyword on the current page being viewed.

### `onDrop`

Handles file drop and reads the PDF file. Extracts text content from each page and stores it in the state.

### `renderAnnotations`

Displays the annotations for the current page, showing how many times each keyword occurs on that page.

### `nextPage` and `prevPage`

Controls for navigating through the pages of the PDF.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
