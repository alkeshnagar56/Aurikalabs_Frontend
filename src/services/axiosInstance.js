// to deploy uncomment below and comment above code


// import axios from "axios";

// const API = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,
//   withCredentials: true,
// });

// export default API;








// Uncoment in development

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
});

export default API;
