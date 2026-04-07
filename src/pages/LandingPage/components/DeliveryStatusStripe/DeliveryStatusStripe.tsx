type DeliveryStatusStripeProps = {
  totalDeliveries: number;
  delivered: number;
  distanceCovered: number;
};

const DeliveryStatusStripe = ({
  totalDeliveries = 0,
  delivered = 0,
  distanceCovered = 0,
}: DeliveryStatusStripeProps) => {
  return (
    <div
      style={{ background: "#FFB300" }}
      className="px-4 py-3 grid grid-cols-4 gap-2 text-center"
    >
      {[
        { val: totalDeliveries, lbl: "Total Deliveries" },
        { val: delivered, lbl: "Delivered" },
        { val: totalDeliveries - delivered, lbl: "Remaining" },
        { val: distanceCovered, unit: "km", lbl: "Distance" },
      ].map(({ val, unit, lbl }) => (
        <div key={lbl}>
          <p className="text-xl font-semibold text-black leading-none">
            {val}
            <span className="text-base font-medium">{unit}</span>
          </p>
          <p className="text-[11px] text-black/55 mt-1">{lbl}</p>
        </div>
      ))}
    </div>
  );
};

export default DeliveryStatusStripe;
