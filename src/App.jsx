import React, { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [rawCodes, setRawCodes] = useState("");
  const [expiry, setExpiry] = useState("July 31");
  const [memberLine, setMemberLine] = useState("For Pogo CIM members only");
  const [rewardLine, setRewardLine] = useState(
    "Contains 1 Raid Pass, 1 Star Piece, 1 Egg Incubator, and 1 Incense"
  );

  const codes = useMemo(() => {
    return rawCodes
      .split(/[\s,;]+/)
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
  }, [rawCodes]);

  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < codes.length; i += 9) {
      result.push(codes.slice(i, i + 9));
    }
    return result;
  }, [codes]);

  const redeemUrl = (code) =>
    `https://store.pokemongo.com/offer-redemption?passcode=${encodeURIComponent(code)}`;

  const sampleCodes =
    "GY5LXK4F6DRDD, GY5MKC6P39RAZ, GY6A52MU8BSXG, GY6LUVM2K2G7F, GY6S6UD9FYTL4, GY6UC6L9AN732, GY6Z656HGG6GC, GY76EZN4YVG33, GY7DJSR3Y67U6";

  return (
    <main className="app">
      <section className="control-panel no-print">
        <div className="title-row">
          <div>
            <h1>Pogo CIM QR Sheet Generator — V4</h1>
            <p>
              Paste Pokémon GO promo codes below. Each QR opens the redemption
              page with the code already filled in.
            </p>
          </div>
          <div className="stats">
            <span>{codes.length} codes</span>
            <span>{pages.length || 0} pages</span>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Expiry
            <input value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </label>
          <label>
            Member line
            <input
              value={memberLine}
              onChange={(e) => setMemberLine(e.target.value)}
            />
          </label>
        </div>

        <label>
          Reward line
          <input
            value={rewardLine}
            onChange={(e) => setRewardLine(e.target.value)}
          />
        </label>

        <label>
          Codes
          <textarea
            placeholder="Paste comma, space, or line-separated codes here..."
            value={rawCodes}
            onChange={(e) => setRawCodes(e.target.value)}
          />
        </label>

        <div className="button-row">
          <button className="primary" onClick={() => window.print()} disabled={!codes.length}>
            Print / Save as PDF
          </button>
          <button onClick={() => setRawCodes(sampleCodes)}>Load sample 9 codes</button>
          <button onClick={() => setRawCodes("")}>Clear</button>
        </div>
      </section>

      {codes.length === 0 ? (
        <section className="empty-state no-print">
          Paste codes to preview printable V4 QR sheets.
        </section>
      ) : (
        <section className="preview">
          {pages.map((pageCodes, pageIndex) => (
            <div className="sheet" key={pageIndex}>
              <div className="grid9">
                {Array.from({ length: 9 }).map((_, i) => {
                  const code = pageCodes[i];
                  return (
                    <article className="qr-card" key={i}>
                      {code ? (
                        <>
                          <div className="qr-wrap">
                            <QRCodeCanvas
                              value={redeemUrl(code)}
                              size={181}
                              level="M"
                              includeMargin={true}
                            />
                          </div>
                          <div className="code-text">{code}</div>
                          <div className="small-text">
                            <div>{memberLine}</div>
                            <div>{rewardLine}</div>
                          </div>
                          <div className="expiry-text">Expiry: {expiry}</div>
                        </>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
