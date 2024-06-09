

const urlsList={
    login:'users/login',
    register:'users/register',
    "hotels-countbycity":"hotels/countbycity",
    'hotels-countbytype':"hotels/countbytype",
    'hotels-city':'hotels/city'  ,   // hotels in a city
    'hotels-find':"hotels/find/",
    'users-validate':"users/validate",
    'hotels-OverAllcountbytypeandcity':"hotels/OverAllcountbytypeandcity",
    'users':"users/",
    'hotels-review':"hotels/review/",
    'users-update':"users/update/",
    "users-update-uploadProfile":"users/update/uploadProfile/",
    'users-bookings-completed':'users/bookings/completed/',
    'users-bookings-upcoming':'users/bookings/upcoming/',
    'rooms':"rooms/",
    "rooms-cancel":"rooms/cancel",
    'rooms-book-email':"rooms/book/email",
    "rooms-book":"rooms/book/"
}





const getApiUrl= async (urlinfo , id='')=>{
  if(!id){
   
    return `${process.env.REACT_APP_URL}`+urlsList[urlinfo]       
  }
    else{
        return `${process.env.REACT_APP_URL}`+urlsList[urlinfo]+id
    }
      
    
}

export default getApiUrl