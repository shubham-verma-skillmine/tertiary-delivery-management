import jkTyreLogo from "@/assets/images/jktyreLogo.png";
import { useTripDetail } from "@/contexts/tripDetail";

const TopBar = () => {
  const { tripId = "-" } = useTripDetail();
  return (
    <div className="flex-shrink-0">
      <div style={{ background: "#FFC107" }} className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-black/50 uppercase">
              Trip ID
            </p>
            <h1 className="text-xl font-bold text-black">{tripId}</h1>
          </div>
          <img src={jkTyreLogo} alt="Logo" className="w-15 h-12" />
          {/* <span className="text-xs font-semibold bg-black/10 text-black px-3 py-1 rounded-full">
            Active
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
