"use client";

import LegalPage, { Section } from "@/components/legal/LegalPage";
import { useT } from "@/lib/i18n";

function DataCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-abelec-cream-light border border-abelec-cream-line rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-abelec-orange/10 flex items-center justify-center text-abelec-orange shrink-0">
          {icon}
        </div>
        <p className="font-slab text-abelec-navy text-[14px] font-semibold">{title}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-abelec-muted">
            <span className="text-abelec-orange mt-0.5 shrink-0">›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightCard({ right, desc }: { right: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 bg-abelec-cream-light rounded-xl border border-abelec-cream-line">
      <div className="w-2 h-2 rounded-full bg-abelec-orange mt-2 shrink-0" />
      <div>
        <p className="font-slab text-abelec-navy text-[14px] font-semibold mb-1">{right}</p>
        <p className="text-[13px] text-abelec-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CookieRow({ name, purpose, duration, optional, labelRequired, labelOptional }: {
  name: string; purpose: string; duration: string; optional: boolean;
  labelRequired: string; labelOptional: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-4 items-center py-3 border-b border-abelec-cream-line last:border-none text-[13px]">
      <span className="font-mono text-abelec-navy font-semibold">{name}</span>
      <span className="text-abelec-muted">{purpose}</span>
      <span className="text-abelec-muted-2 whitespace-nowrap">{duration}</span>
      <span className={`text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${
        optional
          ? "bg-abelec-orange/10 text-abelec-orange"
          : "bg-abelec-navy/8 text-abelec-navy"
      }`}>
        {optional ? labelOptional : labelRequired}
      </span>
    </div>
  );
}

export default function PolitiqueConfidentialitePage() {
  const t = useT();

  const SECTIONS = [
    { id: "collecte",     title: t("privacy.s1") },
    { id: "utilisation",  title: t("privacy.s2") },
    { id: "conservation", title: t("privacy.s3") },
    { id: "droits",       title: t("privacy.s4") },
    { id: "cookies",      title: t("privacy.s5") },
    { id: "dpo",          title: t("privacy.s6") },
  ];

  const labelRequired = t("privacy.s5Required");
  const labelOptional = t("privacy.s5Optional");

  return (
    <LegalPage
      eyebrow={t("privacy.eyebrow")}
      title={t("privacy.title")}
      subtitle={t("privacy.subtitle")}
      lastUpdated="1er mai 2025"
      sections={SECTIONS}
    >
      <div className="mb-8 bg-abelec-navy/5 border border-abelec-navy/10 rounded-xl p-5 flex gap-4">
        <svg className="text-abelec-navy shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[13.5px] text-abelec-navy/80 leading-relaxed">
          {t("privacy.gdprDisclaimer")}
        </p>
      </div>

      <Section id="collecte" title={t("privacy.s1")}>
        <p>{t("privacy.s1Intro")}</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            title={t("privacy.s1Card1Title")}
            items={[t("privacy.s1Card1Item1"), t("privacy.s1Card1Item2"), t("privacy.s1Card1Item3"), t("privacy.s1Card1Item4")]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
            title={t("privacy.s1Card2Title")}
            items={[t("privacy.s1Card2Item1"), t("privacy.s1Card2Item2"), t("privacy.s1Card2Item3"), t("privacy.s1Card2Item4")]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            title={t("privacy.s1Card3Title")}
            items={[t("privacy.s1Card3Item1"), t("privacy.s1Card3Item2"), t("privacy.s1Card3Item3"), t("privacy.s1Card3Item4")]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            title={t("privacy.s1Card4Title")}
            items={[t("privacy.s1Card4Item1"), t("privacy.s1Card4Item2"), t("privacy.s1Card4Item3"), t("privacy.s1Card4Item4")]}
          />
        </div>
        <p className="mt-4">{t("privacy.s1Closing")}</p>
      </Section>

      <Section id="utilisation" title={t("privacy.s2")}>
        <p>{t("privacy.s2Intro")}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-abelec-navy text-white">
                <th className="text-left px-4 py-3 rounded-tl-lg font-mono font-normal text-[11px] uppercase tracking-wide">{t("privacy.s2ColPurpose")}</th>
                <th className="text-left px-4 py-3 font-mono font-normal text-[11px] uppercase tracking-wide">{t("privacy.s2ColBase")}</th>
                <th className="text-left px-4 py-3 rounded-tr-lg font-mono font-normal text-[11px] uppercase tracking-wide">{t("privacy.s2ColData")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-abelec-cream-line">
              {[
                [t("privacy.s2Row1Purpose"), t("privacy.s2Row1Base"), t("privacy.s2Row1Data")],
                [t("privacy.s2Row2Purpose"), t("privacy.s2Row2Base"), t("privacy.s2Row2Data")],
                [t("privacy.s2Row3Purpose"), t("privacy.s2Row3Base"), t("privacy.s2Row3Data")],
                [t("privacy.s2Row4Purpose"), t("privacy.s2Row4Base"), t("privacy.s2Row4Data")],
                [t("privacy.s2Row5Purpose"), t("privacy.s2Row5Base"), t("privacy.s2Row5Data")],
              ].map(([fin, base, data], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-abelec-cream-light/50"}>
                  <td className="px-4 py-3 text-abelec-navy-ink font-medium">{fin}</td>
                  <td className="px-4 py-3 text-abelec-muted">{base}</td>
                  <td className="px-4 py-3 text-abelec-muted">{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">{t("privacy.s2Closing")}</p>
      </Section>

      <Section id="conservation" title={t("privacy.s3")}>
        <p>{t("privacy.s3Intro")}</p>
        <div className="mt-4 space-y-2.5">
          {[
            { cat: t("privacy.s3Cat1"), dur: t("privacy.s3Dur1"), detail: t("privacy.s3Detail1") },
            { cat: t("privacy.s3Cat2"), dur: t("privacy.s3Dur2"), detail: t("privacy.s3Detail2") },
            { cat: t("privacy.s3Cat3"), dur: t("privacy.s3Dur3"), detail: t("privacy.s3Detail3") },
            { cat: t("privacy.s3Cat4"), dur: t("privacy.s3Dur4"), detail: t("privacy.s3Detail4") },
            { cat: t("privacy.s3Cat5"), dur: t("privacy.s3Dur5"), detail: t("privacy.s3Detail5") },
            { cat: t("privacy.s3Cat6"), dur: t("privacy.s3Dur6"), detail: t("privacy.s3Detail6") },
          ].map(({ cat, dur, detail }, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-abelec-cream-line last:border-none">
              <div className="sm:w-56 shrink-0">
                <p className="font-semibold text-abelec-navy-ink text-[13.5px]">{cat}</p>
              </div>
              <div>
                <p className="text-abelec-navy text-[13.5px] font-medium">{dur}</p>
                <p className="text-abelec-muted-2 text-[12px] mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4">{t("privacy.s3Closing")}</p>
      </Section>

      <Section id="droits" title={t("privacy.s4")}>
        <p>{t("privacy.s4Intro")}</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <RightCard right={t("privacy.s4Right1Title")} desc={t("privacy.s4Right1Desc")} />
          <RightCard right={t("privacy.s4Right2Title")} desc={t("privacy.s4Right2Desc")} />
          <RightCard right={t("privacy.s4Right3Title")} desc={t("privacy.s4Right3Desc")} />
          <RightCard right={t("privacy.s4Right4Title")} desc={t("privacy.s4Right4Desc")} />
          <RightCard right={t("privacy.s4Right5Title")} desc={t("privacy.s4Right5Desc")} />
          <RightCard right={t("privacy.s4Right6Title")} desc={t("privacy.s4Right6Desc")} />
        </div>
        <p className="mt-4">
          {t("privacy.s4Closing")}{" "}
          <a href="mailto:dpo@abelec.be" className="text-abelec-orange hover:underline">dpo@abelec.be</a>{" "}
          {t("privacy.s4ClosingMid")}<br />
          <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer" className="text-abelec-orange hover:underline">www.autoriteprotectiondonnees.be</a>
        </p>
      </Section>

      <Section id="cookies" title={t("privacy.s5")}>
        <p>{t("privacy.s5Intro")}</p>
        <div className="mt-4 overflow-x-auto bg-abelec-cream-light rounded-xl border border-abelec-cream-line p-4">
          <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-4 pb-2 border-b border-abelec-cream-line mb-1">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">{t("privacy.s5ColCookie")}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">{t("privacy.s5ColPurpose")}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">{t("privacy.s5ColDuration")}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">{t("privacy.s5ColType")}</span>
          </div>
          <CookieRow name="abelec_session"  purpose={t("privacy.s5Cookie1Purpose")} duration={t("privacy.s5Cookie1Duration")} optional={false} labelRequired={labelRequired} labelOptional={labelOptional} />
          <CookieRow name="abelec_locale"   purpose={t("privacy.s5Cookie2Purpose")} duration={t("privacy.s5Cookie2Duration")} optional={false} labelRequired={labelRequired} labelOptional={labelOptional} />
          <CookieRow name="abelec_auth"     purpose={t("privacy.s5Cookie3Purpose")} duration={t("privacy.s5Cookie3Duration")} optional={false} labelRequired={labelRequired} labelOptional={labelOptional} />
          <CookieRow name="_ga, _gid"       purpose={t("privacy.s5Cookie4Purpose")} duration={t("privacy.s5Cookie4Duration")} optional={true}  labelRequired={labelRequired} labelOptional={labelOptional} />
          <CookieRow name="_fbp"            purpose={t("privacy.s5Cookie5Purpose")} duration={t("privacy.s5Cookie5Duration")} optional={true}  labelRequired={labelRequired} labelOptional={labelOptional} />
          <CookieRow name="consent_v2"      purpose={t("privacy.s5Cookie6Purpose")} duration={t("privacy.s5Cookie6Duration")} optional={false} labelRequired={labelRequired} labelOptional={labelOptional} />
        </div>
        <p className="mt-4">{t("privacy.s5Closing")}</p>
      </Section>

      <Section id="dpo" title={t("privacy.s6")}>
        <p>{t("privacy.s6Intro")}</p>
        <div className="mt-4 bg-abelec-cream-light border border-abelec-cream-line rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="space-y-2">
            <p className="font-slab text-abelec-navy text-[16px] font-semibold">{t("privacy.s6DPOTitle")}</p>
            <p className="text-[13.5px] text-abelec-muted" dangerouslySetInnerHTML={{ __html: t("privacy.s6DPOAddress") }} />
            <p className="text-[13.5px]">
              <span className="text-abelec-muted-2">{t("privacy.s6DPOEmail")}</span>{" "}
              <a href="mailto:dpo@abelec.be" className="text-abelec-orange hover:underline font-medium">dpo@abelec.be</a>
            </p>
            <p className="text-[13px] text-abelec-muted-2 mt-2">
              {t("privacy.s6DPODelay")}
            </p>
          </div>
        </div>
      </Section>
    </LegalPage>
  );
}
