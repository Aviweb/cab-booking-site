"use client";
import BookingScreen from "./components/BookingScreen";
import HomeScreen from "./components/HomeScreen";
import RouteScreen from "./components/RouteScreen";
import FeatureScreen from "./components/FeatureScreen";
import CarScreen from "./components/CarScreen";
import Footer from "./components/Footer";
// import Cookies from "universal-cookie";

export default function Home() {
  // const cookies = new Cookies();
  // const user_uuid = cookies.get("uuid");

  return (
    <>
      <HomeScreen />
      <BookingScreen />
      <RouteScreen />
      <FeatureScreen />
      <CarScreen />
      <Footer />
    </>
  );
}
