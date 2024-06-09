import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NoPage from "./Pages/Nopage";
import List from "./Pages/List";
import Hotel from "./Pages/Hotel";
import User from "./components/User";
import "bootstrap/dist/css/bootstrap.min.css";
import Bookings from "./Pages/Bookings";
import Profile from "./Pages/Profile";
import UserFavorites from "./components/User/UserFavorites";
import Analytics from "./Pages/Analytics";
import i18n from "./common/Lg_Translations/i18n";
import { I18nextProvider } from "react-i18next";
import UnderProgressComponetn from './Pages/UnderDevelopment'
// import { format } from "date-fns";
// import { ToastContainer, toast } from "react-toastify";
// import { DateContext } from "./Context/DateContext";

function App() {
  localStorage.removeItem("i18nextLng");
  let userLanguage = localStorage.getItem("userLanguage");
  localStorage.setItem("i18nextLng", userLanguage ? userLanguage : "en");
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path="/Booking.com" index element={<Home />} />
          {/* <Route path="/Booking.com/stays" element={<List />} /> */}
          <Route path="/Booking.com/flights" element={<UnderProgressComponetn />} />
          <Route path="/Booking.com/car-rentals" element={<UnderProgressComponetn />} />
          <Route path="/Booking.com/attractions" element={<UnderProgressComponetn />} />
          <Route path="/Booking.com/airport-taxis" element={<UnderProgressComponetn />} />
          <Route path="/Booking.com/hotels" element={<List />} />
          <Route path="/Booking.com/hotel/:hotelname/:id" element={<Hotel />} />
          <Route path="/Booking.com/user/:name/profile" element={<User />}>
            <Route path="bookings" element={<Bookings />} />
            <Route path="" element={<Profile />} />
            <Route path="MyFavourite" element={<UserFavorites />} />
            <Route path="Analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
