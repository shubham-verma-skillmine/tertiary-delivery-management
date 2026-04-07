import { TripDetailContextProvider } from "./contexts/tripDetail";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <TripDetailContextProvider>
      <LandingPage />
    </TripDetailContextProvider>
  );
}

export default App;
