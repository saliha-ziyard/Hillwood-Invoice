import React, { useState } from "react";

interface LineItem {
  id: string;
  description: string;
  date: string;
  debit: string;
  credit: string;
}

interface InvoiceData {
  guestName: string;
  nationality: string;
  registerNo: string;
  folioNo: string;
  voucherNo: string;
  roomNo: string;
  arrival: string;
  arrivalTime: string;
  departure: string;
  departureTime: string;
  persons: string;
  cashier: string;
  agent: string;
  page: string;
  company: string;
  windowNo: string;
  items: LineItem[];
}

const newItem = (): LineItem => ({
  id: Date.now().toString() + Math.random(),
  description: "",
  date: "",
  debit: "",
  credit: "",
});

const defaults: InvoiceData = {
  guestName: "",
  nationality: "",
  registerNo: "",
  folioNo: "1",
  voucherNo: "00",
  roomNo: "",
  arrival: "",
  arrivalTime: "",
  departure: "",
  departureTime: "",
  persons: "",
  cashier: "",
  agent: "FIT",
  page: "1",
  company: "",
  windowNo: "1",
  items: [newItem()],
};

const parseNum = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) => {
  if (!s) return "";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-GB");
};

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
      {label}
    </label>
    {children}
  </div>
);

const inp =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition";

export default function App() {
  const [data, setData] = useState<InvoiceData>(defaults);
  const [view, setView] = useState<"form" | "preview">("form");

  const set = (f: keyof InvoiceData, v: string) =>
    setData((p) => ({ ...p, [f]: v }));

  const setItem = (id: string, f: keyof LineItem, v: string) =>
    setData((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, [f]: v } : i)),
    }));

  const addRow = () =>
    setData((p) => ({ ...p, items: [...p.items, newItem()] }));

  const removeRow = (id: string) => {
    if (data.items.length === 1) return;
    setData((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));
  };

  const totalDr = data.items.reduce((s, i) => s + parseNum(i.debit), 0);
  const totalCr = data.items.reduce((s, i) => s + parseNum(i.credit), 0);
  const balance = totalDr - totalCr;

  const handleReset = () => {
    if (window.confirm("Clear all data and start a new invoice?"))
      setData({ ...defaults, items: [newItem()] });
    setView("form");
  };

  /* ════════════════════ FORM ════════════════════ */
  if (view === "form")
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <div>
              <h1 className="font-serif text-xl font-bold text-teal-700">Hillwood Resort</h1>
              <p className="text-xs text-stone-400">Guest Invoice</p>
            </div>
            <button onClick={handleReset} className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-50 transition">
              New Invoice
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-teal-600">Guest Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Guest Name" className="col-span-2 sm:col-span-1">
                <input className={inp} value={data.guestName} onChange={(e) => set("guestName", e.target.value)} placeholder="Mr. & Mrs. J Rushan Sumanaweera" />
              </Field>
              <Field label="Nationality" className="col-span-2 sm:col-span-1">
                <input className={inp} value={data.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. Sri Lankan" />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-teal-600">Booking Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Register No"><input className={inp} value={data.registerNo} onChange={(e) => set("registerNo", e.target.value)} placeholder="10148" /></Field>
              <Field label="Folio No"><input className={inp} value={data.folioNo} onChange={(e) => set("folioNo", e.target.value)} /></Field>
              <Field label="Voucher No"><input className={inp} value={data.voucherNo} onChange={(e) => set("voucherNo", e.target.value)} /></Field>
              <Field label="Room No"><input className={inp} value={data.roomNo} onChange={(e) => set("roomNo", e.target.value)} placeholder="Valley View" /></Field>
              <Field label="Persons"><input className={inp} value={data.persons} onChange={(e) => set("persons", e.target.value)} placeholder="3" /></Field>
              <Field label="Cashier"><input className={inp} value={data.cashier} onChange={(e) => set("cashier", e.target.value)} placeholder="679 - ZZ" /></Field>
              <Field label="Agent"><input className={inp} value={data.agent} onChange={(e) => set("agent", e.target.value)} /></Field>
              <Field label="Company"><input className={inp} value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="(optional)" /></Field>
              <Field label="Window No"><input className={inp} value={data.windowNo} onChange={(e) => set("windowNo", e.target.value)} /></Field>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Arrival Date"><input type="date" className={inp} value={data.arrival} onChange={(e) => set("arrival", e.target.value)} /></Field>
              <Field label="Arrival Time"><input type="time" className={inp} value={data.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} /></Field>
              <Field label="Departure Date"><input type="date" className={inp} value={data.departure} onChange={(e) => set("departure", e.target.value)} /></Field>
              <Field label="Departure Time"><input type="time" className={inp} value={data.departureTime} onChange={(e) => set("departureTime", e.target.value)} /></Field>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-teal-600">Charges &amp; Payments</h2>
            <div className="mb-2 hidden grid-cols-[2fr_1.5fr_1fr_1fr_32px] gap-2 sm:grid">
              {["Description", "Date", "Charge (Dr)", "Payment (Cr)", ""].map((h, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{h}</span>
              ))}
            </div>
            <div className="space-y-2">
              {data.items.map((item) => (
                <div key={item.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_32px] gap-2 items-center">
                  <input className={inp} value={item.description} onChange={(e) => setItem(item.id, "description", e.target.value)} placeholder="Room, Dinner, Breakfast…" />
                  <input type="date" className={inp} value={item.date} onChange={(e) => setItem(item.id, "date", e.target.value)} />
                  <input className={`${inp} text-right`} value={item.debit} onChange={(e) => setItem(item.id, "debit", e.target.value)} placeholder="0.00" />
                  <input className={`${inp} text-right`} value={item.credit} onChange={(e) => setItem(item.id, "credit", e.target.value)} placeholder="0.00" />
                  <button onClick={() => removeRow(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-xs text-red-400 hover:bg-red-100 transition">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addRow} className="mt-4 rounded-lg border border-dashed border-teal-400 px-4 py-2 text-xs font-semibold text-teal-600 hover:bg-teal-50 transition">+ Add Row</button>
            <div className="mt-6 border-t border-stone-100 pt-4">
              <div className="ml-auto w-64 space-y-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Total Charges</span>
                  <span className=" font-semibold text-stone-700">{fmt(totalDr)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Total Payments</span>
                  <span className=" font-semibold text-stone-700">{fmt(totalCr)}</span>
                </div>
                <div className={`flex justify-between rounded-lg px-3 py-2 font-bold ${balance > 0 ? "bg-red-50 text-red-600" : balance < 0 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                  <span>Balance</span>
                  <span className="">{fmt(Math.abs(balance))}{balance > 0 ? " owing" : balance < 0 ? " overpaid" : " ✓"}</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <div className="no-print fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/95 backdrop-blur px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <button onClick={() => setView("preview")} className="w-full rounded-xl bg-teal-600 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-200 hover:bg-teal-700 active:scale-[0.99] transition">
              Preview &amp; Print →
            </button>
          </div>
        </div>
      </div>
    );

  /* ════════════════════ PRINT PREVIEW ════════════════════ */

  // Shared cell style for right meta column labels (right-aligned like image 2)
  const metaFont: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "13px",
  };

  const boldLabel: React.CSSProperties = {
    ...metaFont,
    fontWeight: "bold",
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <div className="no-print sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button onClick={() => setView("form")} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition">
            ← Back to Edit
          </button>
          <button onClick={() => window.print()} className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-100 hover:bg-teal-700 transition">
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 print:p-0 print:max-w-full">
        <div
          className="bg-white shadow-xl print:shadow-none"
          style={{
  fontFamily: "'Times New Roman', Times, serif",
}}
>
          {/* ── HEADER: Logo + Resort name ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "36px", paddingBottom: "8px" }}>
            <img
              src="/assets/logo.png"
              alt="Hillwood Resort"
              style={{ height: "60px", width: "auto", marginBottom: "8px" }}
            />
            <div style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "4px",
              color: "#3d7a6a",
            }}>
              HILLWOOD RESORT
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{ flex: 1, padding: "0 56px 32px" }}>

            {/* Guest name block */}
            <div style={{ marginTop: "28px", marginBottom: "20px", lineHeight: "1.6" }}>
              <div style={{ fontWeight: 400 }}>{data.guestName || "—"}</div>
              {data.nationality && <div>{data.nationality}</div>}
            </div>

            {/* ── META SECTION: two columns ── */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>

              {/* LEFT column */}
              <table style={{ borderCollapse: "collapse", fontSize: "13px", width: "52%" }}>
                <tbody>
                  <tr>
                    <td style={{ ...boldLabel, paddingBottom: "6px", paddingRight: "6px", whiteSpace: "nowrap" }}>
                      Register <span style={{ textDecoration: "underline" }}>No</span>
                    </td>
                    <td style={{ ...metaFont, paddingBottom: "6px" }}>: {data.registerNo}</td>
                  </tr>
                  <tr>
                    <td style={{ ...boldLabel, paddingBottom: "6px", paddingRight: "6px", whiteSpace: "nowrap" }}>
                      <span style={{ textDecoration: "underline" }}>Voucher No</span>
                    </td>
                    <td style={{ ...metaFont, paddingBottom: "6px" }}>: {data.voucherNo}</td>
                  </tr>
                  <tr>
                    <td style={{ ...boldLabel, paddingBottom: "6px", paddingRight: "6px", verticalAlign: "top" }}>Arrival</td>
                    <td style={{ ...metaFont, paddingBottom: "6px" }}>
                      : {fmtDate(data.arrival)}{data.arrivalTime ? ` @ ${data.arrivalTime} hrs` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...boldLabel, paddingBottom: "6px", paddingRight: "6px", verticalAlign: "top" }}>Departure</td>
                    <td style={{ ...metaFont, paddingBottom: "6px" }}>
                      : {fmtDate(data.departure)}{data.departureTime ? ` @ ${data.departureTime} hrs` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...boldLabel, paddingBottom: "6px", paddingRight: "6px" }}>Agent</td>
                    <td style={{ ...metaFont, paddingBottom: "6px" }}>: {data.agent}</td>
                  </tr>
                  <tr>
                    <td style={{ ...boldLabel, paddingRight: "6px" }}>Company</td>
                    <td style={{ ...metaFont }}>: {data.company}</td>
                  </tr>
                </tbody>
              </table>

              {/* RIGHT column — labels right-aligned, values left-aligned after colon */}
              <div style={{ width: "44%", fontSize: "13px" }}>
                {/* "INVOICE" top-right */}
                {/* <div style={{ textAlign: "right", marginBottom: "6px", fontWeight: 400 }}>INVOICE</div> */}
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <tbody>
                    {[
                      ["Folio No", data.folioNo],
                      ["Room No", data.roomNo],
                      ["Person(s)", data.persons],
                      ["Cashier", data.cashier],
                      ["Page", data.page],
                      ["Window No", data.windowNo],
                    ].map(([label, value], i) => (
                      <tr key={i}>
                        <td style={{
                          ...boldLabel,
                          textAlign: "right",
                          paddingBottom: "6px",
                          paddingRight: "8px",
                          whiteSpace: "nowrap",
                          textDecoration: label === "Room No" ? "underline" : "none",
                        }}>
                          {label}
                        </td>
                        <td style={{ ...metaFont, paddingBottom: "6px", whiteSpace: "nowrap" }}>
                          : {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── LINE ITEMS TABLE ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ border: "1px solid #999" }}>
                  <th style={{ textAlign: "left", padding: "6px 10px", fontWeight: 400, width: "36%" }}>Description</th>
                  <th style={{ textAlign: "center", padding: "6px 10px", fontWeight: 400, width: "22%" }}>Date</th>
                  <th style={{ textAlign: "right", padding: "6px 10px", fontWeight: 400, width: "21%" }}>Debit</th>
                  <th style={{ textAlign: "right", padding: "6px 10px", fontWeight: 400, width: "21%" }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {data.items.filter((i) => i.description).map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "5px 10px" }}>{item.description}</td>
                    <td style={{ padding: "5px 10px", textAlign: "center" }}>{fmtDate(item.date)}</td>
                    <td style={{ padding: "5px 10px", textAlign: "right" }}>
                      {item.debit ? fmt(parseNum(item.debit)) : "0.00"}
                    </td>
                    <td style={{ padding: "5px 10px", textAlign: "right" }}>
                      {item.credit ? fmt(parseNum(item.credit)) : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "1px solid #777" }}>
                  <td colSpan={2} style={{ padding: "6px 10px", textAlign: "center" }}>Total</td>
                  <td style={{ padding: "6px 10px", textAlign: "right" }}>{fmt(totalDr)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right" }}>{fmt(totalCr)}</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ padding: "6px 10px", textAlign: "center" }}>Balance</td>
                  <td
    colSpan={2}
    style={{
      borderBottom: "1px solid #333",
      padding: "6px 10px",
      textAlign: "right",
    }}
  >
    {fmt(Math.abs(balance))}
  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── FOOTER ── */}
          <div
            className="print-footer"
            style={{
              borderTop: "1px solid #ddd",
              padding: "12px 0",
              textAlign: "center",
              fontSize: "11.5px",
              color: "#3d7a6a",
              // fontFamily: "Arial, sans-serif",
              lineHeight: "1.6",
            }}
          >
            <div>Hillwood Estate, Daraoya, Handawalapitiya, Sri Lanka</div>
            <div>E-mail: hillwoodresorts@gmail.com</div>
            <div>Tel: +94-767154321</div>
          </div>
        </div>
      </div>
    </div>
  );
}