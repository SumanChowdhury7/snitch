import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})

export async function register(userData) {

   try {

      const response = await authApiInstance.post(
         "/register",
         userData
      );

      return response.data;

   } catch (error) {

      console.log(error.response?.data);

      throw error;
   }
}

export async function login(userData) {

   try {
        const response = await authApiInstance.post(
           "/login",
           userData
        );

        return response.data;
   } catch (error) {
        console.log(error.response?.data);
        throw error;
   }
}
