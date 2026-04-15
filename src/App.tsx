import { Toaster } from "sonner";
import { TripDetailContextProvider } from "./contexts/tripDetail";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <TripDetailContextProvider>
      <LandingPage />
      <Toaster
        position="top-center"
        duration={5000}
        invert
        richColors
        closeButton
        visibleToasts={1}
        toastOptions={{
          style: {
            fontSize: "16px",
          },
          classNames: {
            toast: "flex items-center pr-4",
            closeButton:
              "!absolute !right-2 !top-1/2 !transform !-translate-y-1/2 !left-auto !z-10 !border-none",
          },
        }}
      />
    </TripDetailContextProvider>
  );
}

export default App;
