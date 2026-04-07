import type { DealersList } from "@/schemas/dealerSchema";
import DealerCard from "./DealerCard";

type DealerListProps = {
  dealers: DealersList;
  onDealerSelect: (dealerId: string) => void;
};

const DealerList = ({ dealers = [], onDealerSelect }: DealerListProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-10">
      {dealers.map(({ CustName, Kunnr }) => (
        <DealerCard
          key={Kunnr}
          name={CustName}
          address="15-B, Industrial Area Phase 2"
          load="5 crates · 40 units"
          status="pending"
          onCardClick={() => onDealerSelect(Kunnr)}
        />
      ))}
    </div>
  );
};

export default DealerList;
