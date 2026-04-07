import { ChevronRight, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DealerCardProps = {
  name: string;
  address: string;
  load: string;
  status: "delivered" | "pending";
  onCardClick: () => void;
};

const DealerCard = ({
  name,
  address,
  load,
  status,
  onCardClick,
}: DealerCardProps) => {
  const getNameInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      key={name}
      onClick={onCardClick}
      className=" cursor-pointer transition-all duration-150 border border-gray-200 dark:border-gray-800 hover:border-[#FFC107]"
    >
      <CardContent className="flex items-center gap-4 py-1 px-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{ background: "#FFF8E1", color: "#7a5800" }}
        >
          {getNameInitials(name)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 truncate">
            {name}
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5 truncate flex items-center gap-1">
            <MapPin size={11} className="flex-shrink-0" />
            {address}
          </p>
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <Package size={11} className="flex-shrink-0" />
            {load}
          </p>
        </div>

        {status === "delivered" ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[11px] font-medium border-0">
            Delivered
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-[11px] font-medium border-0">
            Pending
          </Badge>
        )}

        <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
      </CardContent>
    </Card>
  );
};

export default DealerCard;
