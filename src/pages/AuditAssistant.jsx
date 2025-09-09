import { useState } from "react";
import jsPDF from "jspdf";

export default function AuditAssistant() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAvatar] = useState(true);

  const questions = [
    { key: "secteur", label: "🧭 Dans quel secteur exerce votre entreprise ?\n(ex : bâtiment, commerce, service à la personne…)" },
    { key: "effectif", label: "👥 Combien de personnes travaillent aujourd’hui dans l’entreprise ?\n(ex : 1 dirigeant, 3 salariés, 2 apprentis)" },
    { key: "anciennete", label: "📆 Depuis combien d’années l’entreprise est-elle en activité ?\n(ex : créée en 2018, 6 ans d’activité)" },
    { key: "vision", label: "🎯 Avez-vous défini des objectifs clairs pour les 12 à 36 prochains mois ?\n(ex : atteindre 500K€ de CA, recruter 1 personne, ouvrir une nouvelle agence)" },
    { key: "priorites", label: "🚀 Quelles sont vos 3 priorités de développement à court ou moyen terme ?\n(ex : structurer l’équipe, trouver des clients, améliorer la rentabilité)" },
    { key: "organisation", label: "🏗️ Comment est structurée votre organisation ?\n(ex : pas de fiche de poste, polyvalence, ou bien : direction + 2 pôles identifiés)" },
    { key: "rh", label: "📉 Rencontrez-vous actuellement des difficultés à recruter ou fidéliser vos équipes ?\n(ex : recrutement compliqué, turnover élevé, ou pas de difficulté)" },
    { key: "tableaux", label: "📊 Disposez-vous de tableaux de bord ou d’indicateurs pour suivre l’activité ou les finances ?\n(ex : tableau Excel mensuel, suivi sur logiciel, ou aucun indicateur suivi)" },
    { key: "marge", label: "💰 Connaissez-vous précisément vos marges, votre seuil de rentabilité ou vos coûts fixes ?\n(ex : oui, marge nette à 30 %, ou non, pas calculé précisément)" },
    { key: "outils", label: "💻 Quels outils numériques ou automatisations utilisez-vous aujourd’hui ?\n(ex : logiciel de devis, agenda partagé, Zapier, Excel, rien d’automatisé)" },
  ];

  const iaIntro = [
    "Bonjour, je suis Copilot IA, votre assistant intelligent pour ce diagnostic.",
    "Merci. Passons à la prochaine question...",
    "C’est noté. Allons un peu plus loin...",
    "Je continue l’analyse...",
    "Encore une étape pour affiner votre profil..."
  ];

  const handleChange = (key, value) => {
    setResponses({ ...responses, [key]: value });
  };

  const nextStep = () => setStep(step + 1);

  const handleSend = () => {
    const body = questions
      .map((q) => `${q.label}\n${responses[q.key] || "-"}`)
      .join("\n\n");
    const mailtoLink = `mailto:contact@adalane.fr?subject=Diagnostic%20Entreprise&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text("Diagnostic Flash – Entreprise", 20, 20);
    let y = 30;
    questions.forEach((q) => {
      doc.text(`${q.label}`, 20, y);
      y += 6;
      doc.text(`${responses[q.key] || "-"}`, 20, y);
      y += 10;
    });
    doc.save("diagnostic-entreprise.pdf");
  };

  const buttonStyle = {
    background: "#1c2b4a",
    color: "#ffffff",
    padding: "0.6rem 1.2rem",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "1rem"
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <div style={{ background: "#1c2b4a", minHeight: "100vh", padding: "2rem", color: "#fdfaf5" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="https://raw.githubusercontent.com/adalane/Copilot-Entreprise/main/public/logo-adalane-beige.png" alt="Logo Adalane" style={{ maxWidth: "180px" }} />
      </div>

      {step < questions.length ? (
        <div style={{ maxWidth: "700px", margin: "0 auto", background: "#fdfaf5", padding: "2rem", borderRadius: "12px", border: "1px solid #ccc", color: "#1c2b4a", position: "relative" }}>
          {showAvatar && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="IA" style={{ width: "40px", marginRight: "0.75rem" }} />
              <div style={{ fontStyle: "italic" }}>
                💬 {step === 0 ? iaIntro[0] : iaIntro[Math.min(step, iaIntro.length - 1)]}
              </div>
              <div style={{ marginLeft: "auto" }}>
                <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="robot animé" style={{ height: "40px" }} />
              </div>
            </div>
          )}

          <h2 style={{ marginBottom: "1rem" }}>{questions[step].label}</h2>
          <textarea
            style={{ width: "100%", minHeight: "80px", fontSize: "1rem", marginBottom: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", padding: "0.5rem" }}
            value={responses[questions[step].key] || ""}
            onChange={(e) => handleChange(questions[step].key, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre réponse ici..."
          />
          <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
            Appuyez sur <strong>Entrée</strong> pour valider la réponse • <strong>Shift + Entrée</strong> pour aller à la ligne
          </div>
          <button onClick={nextStep} style={buttonStyle}>Suivant</button>
        </div>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
