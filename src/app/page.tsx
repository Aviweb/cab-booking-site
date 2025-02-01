import BookingScreen from "./components/BookingScreen";
import HomeScreen from "./components/HomeScreen";
import RouteScreen from "./components/RouteScreen";
import FeatureScreen from "./components/FeatureScreen";
import CarScreen from "./components/CarScreen";
import FooterScreen from "./components/FooterScreen";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <HomeScreen />

      <BookingScreen />
      <RouteScreen />
      <FeatureScreen />
      <CarScreen />
      <FooterScreen />
    </>
  );
}
