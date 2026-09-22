type TabValue = "pending" | "completed";

type DataTabsProps = {
  tabs: { label: string; value: TabValue; count: number }[];
  activeTab: string;
  setActiveTab: (tab: TabValue) => void;
};

const DataTabs = ({ tabs, activeTab, setActiveTab }: DataTabsProps) => {
  return (
    <div className="flex px-5 py-2">
      {tabs.map(({ label, value, count }) => (
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
            //   border: "none",`
          }}
        >
          {label}

          {count > 0 && (
            <span className="bg-[#FFC107] text-black text-[10px] font-bold px-1.5 py-0.5 ml-1 rounded-full">
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default DataTabs;
