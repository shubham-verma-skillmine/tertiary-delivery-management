type DeliveryTabsProps = {
  tabs: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DeliveryTabs = ({ tabs, activeTab, setActiveTab }: DeliveryTabsProps) => {
  return (
    <div className="flex">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setActiveTab(value)}
          className="flex-1 py-2.5 text-[13px] font-semibold relative transition-all duration-150 cursor-pointer"
          style={{
            color: activeTab === value ? "#1a1a1a" : "rgba(0,0,0,0.45)",
            borderBottom:
              activeTab === value
                ? "3px solid #1a1a1a"
                : "3px solid transparent",
            background: "none",
            //   border: "none",
          }}
        >
          {label}

          {/* {value === "invoices" && overdueCount > 0 && (
                  <span
                    className="absolute top-1.5 ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#E53935", color: "#fff" }}
                  >
                    {overdueCount}
                  </span>
                )} */}
        </button>
      ))}
    </div>
  );
};

export default DeliveryTabs;
