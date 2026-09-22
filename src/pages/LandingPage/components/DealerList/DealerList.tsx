import type { DealersList } from "@/schemas/dealerSchema";
import DealerCard from "./DealerCard";
import NoDealersState from "../NoDealersState";

type DealerListProps = {
  dealers: DealersList;
  onDealerSelect: (dealerId: string) => void;
  onRefresh: () => void;
};

const DealerList = ({
  dealers = [],
  onDealerSelect,
  onRefresh,
}: DealerListProps) => {
  if (dealers.length < 1) {
    return <NoDealersState onRefresh={onRefresh} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
      {dealers.map(({ CustName, Kunnr, OthN2, RtTime, RtDate, BeatFreq }) => (
        <DealerCard
          key={Kunnr}
          name={CustName}
          completedAt={BeatFreq === "Y" ? `${RtDate}  ${RtTime}` : null}
          load={`${OthN2} units`}
          status="pending"
          onCardClick={() => onDealerSelect(Kunnr)}
        />
      ))}
    </div>
  );
};

export default DealerList;
