const userModel = require("../models/users");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { promisify } = require("util");
const UserModel = require("../models/users");
const { BookedHotels } = require("./hotel");
const HotelModel = require("../models/hotel");
const RoomsModel = require("../models/room");

const saltRounds = 10;
let bodywithHashedPasw;



const createUser = async (req, res, next) => {
  let body = req.body;

  let validatingUsername = await userModel.find({ username: body.username });

  if (validatingUsername.length !== 0) {
    next({ message: "Username Already Exist" });
    return;
  }

  let validatingEmail = await userModel.find({ email: body.email });

  if (validatingEmail.length !== 0) {
    next({ message: "Email Already Exist" });
    return;
  }

  try {
    let userPassword = body.password;

  

    const genSaltAsync = promisify(bcrypt.genSalt);
    const hashAsync = promisify(bcrypt.hash);

    const salt = await genSaltAsync(saltRounds);
    const hash = await hashAsync(userPassword, salt);
    body.password = hash;
    bodywithHashedPasw = body;

    let newUser = new userModel(bodywithHashedPasw);

    let saveUser = await newUser.save();

    return res.status(200).send(saveUser);
  } catch (err) {
    next(err);
  }
};


//validate the userdetails before update


const validateUserDetails = async(req , res , next)=>{
try{


  let body=req.body;
  let enteredUsername=body.username;
  let enteredEmail=body.email

  let validateUsername= await UserModel.find({username:enteredUsername})

  if (validateUsername.length !== 0) {
    next({ message: "Username Already Exist" });
    return ;
  }
  let validatingEmail = await userModel.find({ email: body.email });

  if (validatingEmail.length !== 0) {
    next({ message: "Email Already Exist" });
    return ;
  }
  else {
   
    return res.status(200).send({})
  }

}
catch(error){
next(error)
}



}






//update a user

const updateUser = async function (req, res, next) {
  let body = req.body;
  let userBookingdetails = req.body.userBookingdetails;
  let hotelId = req.body.BookedHotelid;
  let userid = req.params.id;
  let userFavHotel = req.body.hotelID;

  try {
    let updateUser = await userModel.findByIdAndUpdate(
      userid,
      {username:body?.username,
        email:body?.email,
        password:body.password,
        $addToSet: {
          BookedHotels: hotelId,
          BookingDetails: userBookingdetails,
          userFavHotels: [],
        },
      },
      { new: true }
    );
    return res.status(200).send(updateUser);
  } catch (err) {
    next({ message: "Something went wrong" });
  }
};

// get all users

const allUsers = async function (req, res, next) {
  try {
    let all = await userModel.find({});

    return res.status(200).send(all);
  } catch (err) {
    next(err);
  }
};

// get a single user

const singleUser = async function (req, res, next) {
  let id = req.params.id;

  try {
    let singlUserr = await userModel.findById(id);

    return res.status(200).send(singlUserr);
  } catch (err) {
    next(err);
  }
};

//  delete a specific user

const deleteUser = async function (req, res, next) {
  let id = req.params.id;

  try {
    let deletedUser = await userModel.findByIdAndDelete(id);

    return res.status(200).send(deletedUser);
  } catch (err) {
    next(err);
  }
};


const UserLogin = async function (req, res, next) {
  let body = req.body;
  try {
    let user = await UserModel.find({ username: body.username });

    if (user.length === 0) {
      next({ status: 401, message: "user not found" });
      return;
    }
    const isPasswordVerified = await bcrypt.compare(
      body.password,
      user[0].password
    );

    if (!isPasswordVerified) {
      next({ status: 401, message: "Invalid Password" });
      return;
    }

    return res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

// authentication

const authenticate = async function (req, res, next) {
  const token = req.cookies.access_token;
 

  if (!token) {
    return res.status(404).send("you are not authenticated");
  }

  jwt.verify(token, "kishor", (err, user) => {
    if (err) {
      return res.status(404).send("invalid Token");
    }

    if (user.isAdmin) {
      return next(); // if there is no next middleware then it throws an error , if there is any middle ware it call the next middle ware
    }
    if (!user.isAdmin) {
      return res.send("you are not an admin");
    }
  });
};

const updatefavHotelId = async (req, res, next) => {
  let body = req.body;
  let userId = req.params.userid;
  let favHotel = req.body.hotelid;
  try {
    let user = await userModel.findById(userId);

    if (!user) {
      next("no user exist");
      return;
    }

    if (!user.userFavHotels.includes(favHotel)) {
      
      let updatedUser = await userModel.findByIdAndUpdate(userId, {
        $addToSet: {
          userFavHotels: favHotel,
        },

        // $set: { userFavHotels: [] },
      });

      return res.send(updatedUser);
    } else {
      
      let updatedUserFav = await userModel.findByIdAndUpdate(userId, {
        $pull: { userFavHotels: favHotel },

        // $set: { userFavHotels: [] },
      });
      return res.send(updatedUserFav);
    }
  } catch (err) {
    
    next(err);
  }
};

const getCompletedBookings = async (req, res, next) => {
  let date = new Date();
  date = date.toLocaleDateString("en-GB");

  let userId = req.params.id;
  try {
    let user = await UserModel.findById(userId);
    let userBookedHotelIds = user.BookedHotels;
    let completedBookings = await Promise.all(
      user.BookingDetails.map((each) => {
        //console.log(each.unavailableDates);
        let parts =
          each.unavailableDates[each.unavailableDates.length - 1].split("/");
        let BookingEndDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // the reason we are formating this is date should be in MM/DD/YYYY format
        

        if (new Date(BookingEndDate).getTime() < new Date().getTime()) {
          return each;
        } else return null;
      })
    );

    completedBookings = completedBookings.filter((booking) => booking !== null);
    return res.send(completedBookings);
  } catch (err) {
    return next();
  }
};

const getUpComingBookings = async (req, res, next) => {
  let date = new Date();
  date = date.toLocaleDateString("en-GB");
 
  let userId = req.params.id;
  try {
    let user = await UserModel.findById(userId);
    let userBookedHotelIds = user.BookedHotels;
    let UpComingBookings = await Promise.all(
      user.BookingDetails.map((each) => {
      
        let parts =
          each.unavailableDates[each.unavailableDates.length - 1].split("/");
        let BookingEndDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // the reason we are formating this is date should be in MM/DD/YYYY format
     
        if (new Date(BookingEndDate).getTime() > new Date().getTime()) {
          return each;
        } else return null;
      })
    );

    UpComingBookings = UpComingBookings.filter((booking) => booking !== null);
    return res.send(UpComingBookings);
  } catch (err) {
    return next();
  }
};

const uploadprofileimage = async (req, res, next) => {
  let body = req.body;
  let userId = req.params.id;

  try {
    let user = await userModel.findById(userId);
    if (user) {
      let user = await userModel.findByIdAndUpdate(userId, body, { new: true });
      return res.send(user);
    }
    next("usernot found");
  } catch (err) {
    next(err);
  }

  return res.send(req.body);
};

module.exports = {
  createUser,
  updateUser,
  allUsers,
  singleUser,
  deleteUser,
  UserLogin,
  authenticate,
  updatefavHotelId,
  getCompletedBookings,
  getUpComingBookings,
  uploadprofileimage,
  validateUserDetails
};
