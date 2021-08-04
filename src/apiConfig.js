export const API_URL = process.env.NODE_ENV === "production"
    ? 'https://todo-amp.herokuapp.com'
    : 'http://localhost:3001'