import { ChevronRight, File } from "lucide-react";
import type { Invoice } from "@/schemas/invoiceSchema";

type InvoiceCardProps = {
  invoice: Invoice;
  onInvoiceClick: (id: string) => void;
};

const InvoiceCard = ({ invoice, onInvoiceClick }: InvoiceCardProps) => {
  return (
    <div
      key={invoice.id}
      onClick={() => onInvoiceClick(invoice.id)}
      className="bg-card border border-border rounded-md cursor-pointer overflow-hidden hover:border-[#FFC107] transition-colors duration-150"
    >
      <div className="flex items-center gap-3 px-4 py-3.5 text-muted-foreground">
        <div>
          <File size={25} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold tracking-wide">{invoice.id}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {invoice.date} · {invoice.itemCount} items · {invoice.paymentMode}
            {invoice.status === "overdue" && invoice.overdueDays && (
              <span className="text-red-600 font-semibold">
                {" "}
                · {invoice.overdueDays} days late
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-[15px] font-bold">
            ₹{invoice.amount.toLocaleString("en-IN")}
          </p>
          {/* <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: s.bg, color: s.text }}
          >
            {s.label}
          </span> */}
        </div>
        <ChevronRight
          size={15}
          className="text-muted-foreground flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default InvoiceCard;
