type DataTabsProps = {
  tabs: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DataTabs = ({ tabs, activeTab, setActiveTab }: DataTabsProps) => {
  return (
    <div className="flex px-5 py-2">
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
            //   border: "none",`
          }}
        >
          {label}

          <span className="bg-[#FFC107] text-black text-[10px] font-bold px-1.5 py-0.5 ml-1 rounded-full">
            {10}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DataTabs;
