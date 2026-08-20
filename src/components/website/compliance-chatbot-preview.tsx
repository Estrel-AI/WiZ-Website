const complianceChatbotFrame = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>IT Ops Correlation Assistant</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <style>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      html,
      body {
        width: 100%;
        height: 100%;
        background: #5b1436;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        font-family: "Inter", sans-serif;
      }
      .shell {
        width: min(420px, 100%);
        height: min(680px, 100%);
        min-height: 0;
        background: #14070e;
        border-radius: 16px;
        border: 1px solid rgba(255, 143, 194, 0.24);
        box-shadow:
          0 0 60px rgba(255, 143, 194, 0.12),
          0 40px 100px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .topbar {
        background: #2a1722;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
      }
      .top-inner {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .top-icon {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: linear-gradient(135deg, #912059, #d87aaa);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .top-labels {
        flex: 1;
      }
      .top-title {
        font-size: 13.5px;
        font-weight: 600;
        color: #fff5d6;
      }
      .top-sub {
        font-size: 10px;
        color: #b9a7b0;
        margin-top: 2px;
      }
      .top-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
      }
      .live-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #25101b;
        border: 0.5px solid rgba(255, 143, 194, 0.25);
        border-radius: 20px;
        padding: 3px 8px;
      }
      .ldot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ff8fc2;
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.3;
        }
      }
      .ltext {
        font-size: 9px;
        font-weight: 600;
        color: #ffb7d8;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
      .icnt {
        font-size: 9px;
        color: #8b7a84;
        font-family: "JetBrains Mono", monospace;
      }
      .chat {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
      }
      .chat::-webkit-scrollbar {
        display: none;
      }
      .ci {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 16px 8px;
        width: 100%;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .row.bot {
        align-items: flex-start;
      }
      .row.usr {
        align-items: flex-end;
      }
      .lp {
        font-size: 9.5px;
        font-weight: 600;
        letter-spacing: 0.5px;
        padding: 2px 7px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .lp.bl {
        background: #271920;
        color: #ffb7d8;
        border: 0.5px solid rgba(255, 255, 255, 0.1);
      }
      .lp.ul {
        background: #271920;
        color: #b9a7b0;
        border: 0.5px solid rgba(255, 255, 255, 0.1);
      }
      .bub {
        border-radius: 4px 13px 13px 13px;
        padding: 11px 13px;
        font-size: 12.5px;
        line-height: 1.65;
        max-width: 92%;
        overflow-wrap: anywhere;
      }
      .bb {
        background: #fffefe;
        border: 0.5px solid rgba(255, 255, 255, 0.8);
        color: #32242c;
        opacity: 0;
        transform: translateY(5px);
        transition:
          opacity 0.35s,
          transform 0.35s;
      }
      .bb.vis {
        opacity: 1;
        transform: translateY(0);
      }
      .ub {
        background: #271920;
        border: 0.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 13px 4px 13px 13px;
        color: #eee1e7;
        opacity: 0;
        transform: translateY(5px) scale(0.98);
        transition:
          opacity 0.3s,
          transform 0.3s;
      }
      .ub.vis {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .hb {
        color: #ff8fc2;
        font-weight: 500;
      }
      .hr {
        color: #ff7aa8;
        font-weight: 500;
      }
      .ha {
        color: #fff5d6;
        font-weight: 500;
      }
      .hg {
        color: #d87aaa;
        font-weight: 500;
      }
      .hm {
        font-family: "JetBrains Mono", monospace;
        font-size: 10.5px;
        color: #ffb7d8;
        background: #25101b;
        padding: 1px 5px;
        border-radius: 3px;
      }
      .thk {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 0 4px;
      }
      .thk span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ff8fc2;
        animation: td 1.2s ease-in-out infinite;
      }
      .thk span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .thk span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes td {
        0%,
        80%,
        100% {
          transform: scale(0.5);
          opacity: 0.3;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .chips {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 6px;
        opacity: 0;
        transform: translateY(3px);
        transition:
          opacity 0.4s,
          transform 0.4s;
      }
      .chips.show {
        opacity: 1;
        transform: translateY(0);
      }
      .chip {
        background: #25101b;
        border: 0.5px solid rgba(255, 143, 194, 0.24);
        border-radius: 7px;
        padding: 7px 10px;
        font-size: 10.5px;
        color: #ffb7d8;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .chip::before {
        content: "";
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #ff8fc2;
        flex-shrink: 0;
      }
      .mrow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
        margin-top: 9px;
        opacity: 0;
        transform: translateY(4px);
        transition:
          opacity 0.4s,
          transform 0.4s;
      }
      .mrow.show {
        opacity: 1;
        transform: translateY(0);
      }
      .mc {
        background: #1d0c14;
        border: 0.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 9px;
      }
      .mcl {
        font-size: 8.5px;
        color: #8b7a84;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        font-weight: 600;
      }
      .mcv {
        font-size: 14px;
        font-weight: 600;
        margin-top: 2px;
        font-family: "JetBrains Mono", monospace;
      }
      .mcv.r {
        color: #ff7aa8;
      }
      .mcv.a {
        color: #fff5d6;
      }
      .mcv.g {
        color: #d87aaa;
      }
      .dv {
        text-align: center;
        font-size: 9px;
        color: #8b7a84;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      .ibar {
        padding: 10px 14px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: #14070e;
        flex-shrink: 0;
      }
      @media (max-width: 480px) {
        body {
          padding: 8px;
        }
        .shell {
          width: 100%;
          border-radius: 14px;
        }
        .topbar {
          padding: 12px 14px;
        }
        .top-title {
          font-size: 12.5px;
        }
        .top-sub,
        .icnt {
          font-size: 9px;
        }
        .ci {
          padding: 12px 12px 8px;
        }
        .bub {
          max-width: 96%;
          font-size: 12px;
        }
        .ibar {
          padding: 9px 12px 12px;
        }
      }
      .iw {
        background: #25101b;
        border: 1px solid rgba(255, 143, 194, 0.2);
        border-radius: 24px;
        padding: 9px 9px 9px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: border-color 0.2s;
      }
      .iw.act {
        border-color: #ff8fc2;
      }
      .ifield {
        flex: 1;
        font-size: 12.5px;
        color: #b9a7b0;
        font-family: "Inter", sans-serif;
        line-height: 1.5;
        word-break: break-word;
        min-height: 16px;
      }
      .ifield.typ {
        color: #fff0f7;
      }
      .cur {
        display: inline-block;
        width: 1.5px;
        height: 13px;
        background: #ff8fc2;
        border-radius: 1px;
        vertical-align: middle;
        margin-left: 1px;
        animation: blink 0.9s step-end infinite;
      }
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
      .sbtn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #912059;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: none;
        cursor: pointer;
        transition:
          transform 0.15s,
          opacity 0.15s;
      }
      .sbtn.dim {
        opacity: 0.35;
        transform: scale(0.88);
      }
    </style>
  </head>
  <body>
    <div class="shell" id="sh">
    
      <div class="topbar">
        <div class="top-inner">
          <div class="top-icon">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect
                x="2"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <rect
                x="11"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <rect
                x="2"
                y="11"
                width="7"
                height="7"
                rx="1.5"
                stroke="#FF8FC2"
                stroke-width="1.3"
              />
              <circle cx="14.5" cy="14.5" r="2.5" fill="#FF8FC2" />
            </svg>
          </div>
          <div class="top-labels">
            <div class="top-title"> IT NOC / SOC Agent </div>
            <div class="top-sub">
             Ask me about your infrastructure
            </div>
          </div>
          <div class="top-right">
            <div class="live-badge">
              <div class="ldot"></div>
              <div class="ltext">Live</div>
            </div>
            <div class="icnt">161 incidents</div>
          </div>
        </div>
      </div>
      <div class="chat" id="chat"><div class="ci" id="ci"></div></div>
      <div class="ibar">
        <div class="iw" id="iw">
          <div class="ifield" id="ifield">
            <span class="cur" id="cur"></span>
          </div>
          <button class="sbtn" id="sbtn">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M8 3L13 8L8 13"
                stroke="#fff"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <script>
      const sl = (ms) => new Promise((r) => setTimeout(r, ms));
      function mk(t, c) {
        const e = document.createElement(t);
        if (c) e.className = c;
        return e;
      }
      function pill(type) {
        const p = mk("div", "lp " + (type === "bot" ? "bl" : "ul"));
        if (type === "bot") {
          p.innerHTML = '<svg width="8" height="8" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/><rect x="5.5" y="1" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/><rect x="1" y="5.5" width="3.5" height="3.5" rx="0.8" stroke="#FF8FC2" stroke-width="1"/></svg> Bot';
        } else p.textContent = "You";
        return p;
      }
      function scrollUp() {
        const chat = document.getElementById("chat");
        chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
      }
      const syncScroll = () => requestAnimationFrame(scrollUp);
      const INTRO = [
        'Hello! I am your <span class="hb">L1 IT Ops Correlation Assistant</span>.',
        'I can answer questions about <span class="hb">161 incidents</span> across your infrastructure from <span class="hb">October 2025 to February 2026</span>. I correlate across <span class="hb">Assets, Alerts, KPIs</span> and <span class="hb">Hourly data</span> automatically.',
        'The right panel updates with full correlated details when I find relevant incidents. Select a suggestion or type your own.',
      ].join("<br><br>");
      const Q = "What happened on web-01 on Oct 1, 2025?";
      const PARTS = [
        { t: "n", v: "Found " },
        { t: "m", v: "INC-202510-web-01-001" },
        { t: "n", v: " on " },
        { t: "b", v: "web-01" },
        { t: "n", v: " — a " },
        { t: "r", v: "P1 Network incident" },
        { t: "n", v: " on the " },
        { t: "b", v: "public-site" },
        { t: "n", v: " service.\n\n" },
        { t: "n", v: "Runtime: " },
        { t: "b", v: "16:00 to 16:30" },
        { t: "n", v: " (30 min). Platform: " },
        { t: "b", v: "VM" },
        { t: "n", v: ", Role: " },
        { t: "b", v: "Web Server" },
        { t: "n", v: ".\n\n" },
        { t: "n", v: "Root cause: " },
        { t: "a", v: "NIC driver failure" },
        { t: "n", v: " on " },
        { t: "m", v: "eth0" },
        { t: "n", v: ". Linked alerts: " },
        { t: "b", v: "3 correlated" },
        { t: "n", v: ". Latency spiked " },
        { t: "r", v: "840ms" },
        { t: "n", v: ". Recovery at " },
        { t: "g", v: "16:34" },
        { t: "n", v: "." },
      ];
      const SUGGS = [
        "Show all P1 incidents in November 2025",
        "Which hosts had the most alerts?",
        "Correlate KPI drops with network alerts",
      ];
      const METRICS = [
        { l: "Incidents", v: "1", c: "r" },
        { l: "Alerts", v: "3", c: "a" },
        { l: "Downtime", v: "34m", c: "r" },
        { l: "MTTR", v: "16m", c: "g" },
      ];
      async function stream(container, parts) {
        for (const p of parts) {
          const sp =
            p.t === "m"
              ? mk("span", "hm")
              : p.t === "b"
                ? mk("span", "hb")
                : p.t === "r"
                  ? mk("span", "hr")
                  : p.t === "a"
                    ? mk("span", "ha")
                    : p.t === "g"
                      ? mk("span", "hg")
                      : mk("span");
          container.appendChild(sp);
          for (let i = 0; i < p.v.length; i++) {
            if (p.v[i] === "\n") {
              sp.appendChild(document.createElement("br"));
              if (p.v[i + 1] === "\n") {
                sp.appendChild(document.createElement("br"));
                i++;
              }
            } else sp.appendChild(document.createTextNode(p.v[i]));
            await sl(22);
            scrollUp();
          }
        }
      }
      async function run() {
        const ci = document.getElementById("ci"),
          ifield = document.getElementById("ifield"),
          cur = document.getElementById("cur"),
          iw = document.getElementById("iw"),
          sbtn = document.getElementById("sbtn"),
          sh = document.getElementById("sh");
        document.getElementById("chat").scrollTop = 0;
        await sl(600);
        const r1 = mk("div", "row bot");
        r1.appendChild(pill("bot"));
        const b1 = mk("div", "bub bb");
        b1.innerHTML = INTRO;
        r1.appendChild(b1);
        ci.appendChild(r1);
        await sl(20);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            b1.classList.add("vis");
            scrollUp();
          }),
        );
        await sl(500);
        const ch = mk("div", "chips");
        SUGGS.forEach((s) => {
          const c = mk("div", "chip");
          c.textContent = s;
          ch.appendChild(c);
        });
        b1.appendChild(ch);
        await sl(80);
        ch.classList.add("show");
        scrollUp();
        await sl(2000);
        iw.classList.add("act");
        ifield.classList.add("typ");
        for (let i = 0; i < Q.length; i++) {
          ifield.insertBefore(document.createTextNode(Q[i]), cur);
          await sl(40);
        }
        await sl(480);
        sbtn.classList.add("dim");
        iw.classList.remove("act");
        await sl(180);
        const dv = mk("div", "dv");
        dv.textContent = "Oct 1, 2025 · 09:41 AM";
        ci.appendChild(dv);
        scrollUp();
        const ru = mk("div", "row usr");
        ru.appendChild(pill("user"));
        const ub = mk("div", "bub ub");
        ub.textContent = Q;
        ru.appendChild(ub);
        ci.appendChild(ru);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ub.classList.add("vis");
            scrollUp();
          }),
        );
        while (ifield.firstChild !== cur) ifield.removeChild(ifield.firstChild);
        ifield.classList.remove("typ");
        sbtn.classList.remove("dim");
        await sl(420);
        const r2 = mk("div", "row bot");
        r2.appendChild(pill("bot"));
        const b2 = mk("div", "bub bb");
        const thk = mk("div", "thk");
        thk.innerHTML = "<span></span><span></span><span></span>";
        b2.appendChild(thk);
        const td = mk("div");
        td.style.display = "none";
        b2.appendChild(td);
        const mr = mk("div", "mrow");
        METRICS.forEach((m) => {
          const c = mk("div", "mc");
          const l = mk("div", "mcl");
          l.textContent = m.l;
          const v = mk("div", "mcv " + m.c);
          v.textContent = m.v;
          c.append(l, v);
          mr.appendChild(c);
        });
        b2.appendChild(mr);
        r2.appendChild(b2);
        ci.appendChild(r2);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            b2.classList.add("vis");
            scrollUp();
          }),
        );
        await sl(1400);
        thk.style.display = "none";
        td.style.display = "";
        await stream(td, PARTS);
        await sl(280);
        mr.classList.add("show");
        scrollUp();
        await sl(4000);
        sh.style.transition = "opacity 0.7s";
        sh.style.opacity = "0";
        await sl(800);
        ci.innerHTML = "";
        while (ifield.firstChild !== cur) ifield.removeChild(ifield.firstChild);
        ifield.classList.remove("typ");
        iw.classList.remove("act");
        sbtn.classList.remove("dim");
        sh.style.opacity = "1";
        await sl(350);
        run();
      }
      window.addEventListener("resize", syncScroll);
      window.addEventListener("orientationchange", syncScroll);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", syncScroll);
      }
      run();
    </script>
  </body>
</html>`;

export function ComplianceChatbotPreview() {
  return (
    <div className="flex-1 overflow-hidden rounded-[1.25rem] border border-[#ff8fc2]/20 bg-[#4b1230] shadow-[0_24px_70px_rgba(45,5,25,0.45)] min-h-[560px] sm:min-h-[620px] lg:min-h-0">
      <iframe
        title="Consumer protection compliance chatbot preview"
        srcDoc={complianceChatbotFrame}
        sandbox="allow-scripts"
        scrolling="no"
        loading="lazy"
        referrerPolicy="no-referrer"
        tabIndex={-1}
        className="pointer-events-none block h-full min-h-[560px] w-full border-0 sm:min-h-[620px] lg:min-h-0"
      />
    </div>
  );
}
