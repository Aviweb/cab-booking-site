"use client";
import BookingScreen from "./components/BookingScreen";
import HomeScreen from "./components/HomeScreen";
import RouteScreen from "./components/RouteScreen";
import FeatureScreen from "./components/FeatureScreen";
import CarScreen from "./components/CarScreen";
import Footer from "./components/Footer";

export default function Home() {
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
