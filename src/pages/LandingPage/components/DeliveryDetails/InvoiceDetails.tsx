import { AlertCircle } from "lucide-react";
import type { Invoice } from "@/schemas/invoiceSchema";

type InvoiceDetailsProps = {
  invoice: Invoice;
};

const InvoiceDetails = ({ invoice }: InvoiceDetailsProps) => {
  const total = 100;
  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      <div className="bg-card border border-border rounded-md px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[15px] font-bold">{invoice.id}</p>
            <p className="text-[12px] text-muted-foreground mt-1">
              {invoice.date}
            </p>
          </div>
          <div className="text-right">
            {/* <p className="text-[22px] font-bold" style={{ color: s.bar }}>
                ₹{total.toLocaleString("en-IN")}
              </p> */}
            {/* <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: s.bg, color: s.text }}
              >
                {s.label}
              </span> */}
          </div>
        </div>
        {invoice.status === "overdue" && invoice.overdueDays && (
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-md text-[12px] font-semibold"
            style={{ background: "#FFEBEE", color: "#C62828" }}
          >
            <AlertCircle size={13} />
            {invoice.overdueDays} days overdue — collect payment immediately
          </div>
        )}
      </div>

      {/* Payment info */}
      <div className="bg-card border border-border rounded-md overflow-hidden">
        <p
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest
                          px-4 py-2.5 border-b border-border bg-muted"
        >
          Payment info
        </p>
        {[
          { label: "Payment mode", value: invoice.paymentMode },
          { label: "Due date", value: invoice.dueDate },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0"
          >
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <span className="text-[13px] font-semibold text-foreground">
              {value}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-[13px] text-muted-foreground">Status</span>
          {/* <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: s.bg, color: s.text }}
            >
              {s.label}
            </span> */}
        </div>
        {invoice.note && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <span className="text-[13px] text-muted-foreground">Note</span>
            <span className="text-[13px] text-muted-foreground text-right max-w-[55%]">
              {invoice.note}
            </span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-card border border-border rounded-md overflow-hidden">
        <p
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest
                          px-4 py-2.5 border-b border-border bg-muted"
        >
          Items ({invoice.items.length})
        </p>
        {invoice.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center
                                text-[10px] font-bold flex-shrink-0"
              style={{ background: "#FFF8E1", color: "#7a5800" }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">
                {item.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {item.qty} {item.unit} × ₹{item.unitPrice}
              </p>
            </div>
            <p className="text-[13px] font-bold text-foreground">
              ₹{(item.qty * item.unitPrice).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
        {/* Total */}
        <div
          className="flex justify-between items-center px-4 py-3.5 border-t-2"
          style={{ background: "#FFFBEB", borderColor: "#FFC107" }}
        >
          <span className="text-[13px] font-bold text-foreground">Total</span>
          <span className="text-[16px] font-bold text-foreground">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
