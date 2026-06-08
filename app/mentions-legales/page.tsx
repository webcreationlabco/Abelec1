"use client";

import LegalPage, { Section } from "@/components/legal/LegalPage";
import { useT } from "@/lib/i18n";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-abelec-cream-line last:border-none">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-abelec-muted-2 sm:w-40 shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-abelec-navy-ink font-sans text-[14.5px] font-medium">{value}</span>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const t = useT();

  const SECTIONS = [
    { id: "editeur",     title: t("mentions.s1") },
    { id: "hebergement", title: t("mentions.s2") },
    { id: "propriete",   title: t("mentions.s3") },
    { id: "donnees",     title: t("mentions.s4") },
  ];

  return (
    <LegalPage
      eyebrow={t("mentions.eyebrow")}
      title={t("mentions.title")}
      subtitle={t("mentions.subtitle")}
      lastUpdated="1er mai 2025"
      sections={SECTIONS}
    >
      <Section id="editeur" title={t("mentions.s1")}>
        <p>
          Le site <strong>www.abelec.be</strong> est édité par :
        </p>
        <div className="mt-4 bg-abelec-cream-light rounded-xl p-5 border border-abelec-cream-line">
          <InfoRow label={t("mentions.labelRaison")}      value="Abelec" />
          <InfoRow label={t("mentions.labelResponsable")} value="Fiordaliso Nicola" />
          <InfoRow label={t("mentions.labelForme")}       value="Entreprise individuelle / Indépendant" />
          <InfoRow label={t("mentions.labelAdresse")}     value="Avenue Léopold III 38B, 7134 Péronnes-lez-Binche, Belgique" />
          <InfoRow label={t("mentions.labelTva")}         value="BE0653292921" />
          <InfoRow label={t("mentions.labelEmail")}       value={
            <a href="mailto:contact@abelec.be" className="text-abelec-orange hover:underline">
              contact@abelec.be
            </a>
          } />
          <InfoRow label={t("mentions.labelTel")}         value={
            <a href="tel:+3264000000" className="text-abelec-orange hover:underline">
              +32 (0)64 00 00 00
            </a>
          } />
        </div>
        <p className="mt-4">
          Le directeur de la publication est <strong>Fiordaliso Nicola</strong>.
        </p>
      </Section>

      <Section id="hebergement" title={t("mentions.s2")}>
        <p>
          Le site <strong>www.abelec.be</strong> est hébergé par :
        </p>
        <div className="mt-4 bg-abelec-cream-light rounded-xl p-5 border border-abelec-cream-line">
          <InfoRow label={t("mentions.labelHebNom")} value="Vercel Inc." />
          <InfoRow label={t("mentions.labelAdresse")} value="440 N Barranca Ave #4133, Covina, CA 91723, États-Unis" />
          <InfoRow label={t("mentions.labelHebUrl")} value={
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
              className="text-abelec-orange hover:underline">
              www.vercel.com
            </a>
          } />
        </div>
        <p className="mt-4 text-[13px] text-abelec-muted-2">
          Les serveurs de données sont localisés dans des datacenters certifiés en Union Européenne. Les données des utilisateurs européens sont traitées conformément au règlement RGPD.
        </p>
      </Section>

      <Section id="propriete" title={t("mentions.s3")}>
        <p>
          L&apos;ensemble du contenu du site <strong>www.abelec.be</strong> — incluant, de manière non exhaustive, les textes, images, photographies, illustrations, logos, marques, icônes, vidéos, schémas techniques, et la structure générale du site — est la propriété exclusive d&apos;Abelec ou de ses partenaires et est protégé par les lois belges et internationales relatives à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du contenu du site, par quelque procédé que ce soit, et sur quelque support que ce soit, sans l&apos;autorisation expresse écrite d&apos;Abelec, est interdite et constitue une contrefaçon sanctionnée par les articles 80 et suivants du Code de droit économique belge.
        </p>
        <p>
          Les marques des fabricants référencés (Bosch, Miele, Siemens, Electrolux, Whirlpool, AEG, etc.) sont la propriété de leurs détenteurs respectifs. Leur mention sur ce site s&apos;inscrit dans un but de compatibilité et d&apos;information technique uniquement, sans lien de partenariat ni d&apos;affiliation avec lesdites marques.
        </p>
        <p>
          Les liens hypertextes mis en place en direction d&apos;autres sites internet ne sauraient engager la responsabilité d&apos;Abelec quant au contenu de ces sites.
        </p>
      </Section>

      <Section id="donnees" title={t("mentions.s4")}>
        <p>
          Dans le cadre de l&apos;utilisation du site <strong>www.abelec.be</strong>, Abelec est amené à collecter et traiter des données à caractère personnel vous concernant, en qualité de responsable du traitement.
        </p>
        <p>
          Ces traitements sont réalisés conformément au Règlement (UE) 2016/679 du 27 avril 2016 relatif à la protection des données (RGPD) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l&apos;égard des traitements de données à caractère personnel.
        </p>
        <p>
          Pour toute information relative à la collecte, l&apos;utilisation et la conservation de vos données personnelles, nous vous invitons à consulter notre{" "}
          <a href="/politique-de-confidentialite" className="text-abelec-orange hover:underline font-semibold">
            Politique de Confidentialité
          </a>
          {" "}complète.
        </p>
        <p>
          Pour exercer vos droits (accès, rectification, suppression, portabilité, limitation ou opposition au traitement), vous pouvez contacter notre Délégué à la Protection des Données (DPO) à l&apos;adresse suivante :{" "}
          <a href="mailto:dpo@abelec.be" className="text-abelec-orange hover:underline">
            dpo@abelec.be
          </a>
        </p>
        <p>
          Vous disposez également du droit d&apos;introduire une réclamation auprès de l&apos;Autorité de Protection des Données belge (APD) — www.autoriteprotectiondonnees.be.
        </p>
      </Section>
    </LegalPage>
  );
}
