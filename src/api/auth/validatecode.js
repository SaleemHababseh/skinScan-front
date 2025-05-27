import { baseURL } from "../config.js";
export const validatecode = async({email , code})=>{
    try {
        const response=await fetch(`${baseURL}/auth/validate-verification-code`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify ({
                email:email,
                validate_code:code,
            })
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "networkerror");
        }
        return data;
    }
    catch(error){
        console.log("error",error)
        throw error;
    }
}
validatecode({email:"alhababsahs@gmail.com",code:"090286"})