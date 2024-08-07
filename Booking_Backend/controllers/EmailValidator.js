// const request = require('request');
const axios = require('axios')


const validateEmail = async(email)=>{
try{
let response = await axios(`https://growtheye.com/API/email_verifier.php?email=${email}`)
return response.data
}
catch(error){
return 0
}

}

 module.exports = {validateEmail}