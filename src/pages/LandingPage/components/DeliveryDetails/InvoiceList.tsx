import { useState } from "react";
import InvoiceCard from "./InvoiceCard";
import type { Invoice } from "@/schemas/invoiceSchema";
import type { Dealer } from "@/schemas/dealerSchema";
import dummyInvoices from "@/mocks/invoices.json";

type InvoiceListProps = {
  dealer: Dealer;
  openInvoiceDetails: (invoice: Invoice) => void;
};

const InvoiceList = ({ openInvoiceDetails }: InvoiceListProps) => {
  const [invoices] = useState<Invoice[]>(dummyInvoices as Invoice[]);

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((d) => d.id === invoiceId);
    if (invoice) openInvoiceDetails(invoice);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2.5">
      {invoices.map((inv) => {
        return (
          <InvoiceCard invoice={inv} onInvoiceClick={handleInvoiceSelect} />
        );
      })}

      {invoices.length === 0 && (
        <p className="text-center py-16 text-sm text-muted-foreground">
          No invoices for this dealer
        </p>
      )}
    </div>
  );
};

export default InvoiceList;
