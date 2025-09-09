import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function AuditAssistant() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAvatar] = useState(true);

  const questions = [
    { key: "secteur", label: "🧭 Dans quel secteur exerce votre entreprise ? (ex : bâtiment, commerce, service à la personne…)" },
    { key: "effectif", label: "👥 Combien de personnes travaillent aujourd’hui dans l’entreprise ? (salariés, dirigeants inclus)" },
    { key: "anciennete", label: "📆 Depuis combien d’années l’entreprise est-elle en activité ?" },
    { key: "vision", label: "🎯 Avez-vous défini des objectifs clairs pour les 12 à 36 prochains mois ? Si oui, lesquels ?" },
    { key: "priorites", label: "🚀 Quelles sont vos 3 priorités de développement à court ou moyen terme ?" },
    { key: "organisation", label: "🏗️ Comment est structurée votre organisation ? Avez-vous des fiches de poste, des rôles clairs ?" },
    { key: "rh", label: "📉 Rencontrez-vous actuellement des difficultés à recruter ou fidéliser vos équipes ?" },
    { key: "tableaux", label: "📊 Disposez-vous de tableaux de bord ou d’indicateurs pour suivre l’activité ou les finances ?" },
    { key: "marge", label: "💰 Connaissez-vous précisément vos marges, votre seuil de rentabilité ou vos coûts fixes ?" },
    { key: "outils", label: "💻 Quels outils numériques ou automatisations utilisez-vous aujourd’hui ? (ex : facturation, agenda, RH…)" },
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

  const renderSummary = () => (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", background: "#fdfaf5", border: "1px solid #1c2b4a" }}>
      <h2 style={{ color: "#1c2b4a" }}>🤖 Analyse par Copilot IA</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.key} style={{ marginBottom: "1rem" }}>
            <strong>{q.label}</strong><br />
            {responses[q.key]}
          </li>
        ))}
      </ul>
      <p style={{ color: "#1c2b4a", marginTop: "1rem" }}>
        👉 Ce diagnostic est généré par Copilot IA. Pour une analyse approfondie, contactez <strong>Jean Mi</strong>.
      </p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSend} style={buttonStyle}>Envoyer à Jean Mi</button>
        <button onClick={handleDownloadPDF} style={{ ...buttonStyle, background: "#ffffff", color: "#1c2b4a", border: "1px solid #1c2b4a", marginLeft: "1rem" }}>Télécharger le PDF</button>
      </div>
    </div>
  );

  const buttonStyle = {
    background: "#1c2b4a",
    color: "#ffffff",
    padding: "0.5rem 1rem",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <div style={{ background: "#fdfaf5", minHeight: "100vh", padding: "2rem" }}>
      {step < questions.length ? (
        <div style={{ maxWidth: "600px", margin: "0 auto", background: "#ffffff", padding: "2rem", borderRadius: "10px", border: "1px solid #1c2b4a" }}>
          {showAvatar && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="IA" style={{ width: "40px", marginRight: "0.75rem" }} />
              <div style={{ fontStyle: "italic", color: "#1c2b4a" }}>
                💬 {step === 0 ? iaIntro[0] : iaIntro[Math.min(step, iaIntro.length - 1)]}
              </div>
            </div>
          )}
          <h2 style={{ marginBottom: "1rem", color: "#1c2b4a" }}>{questions[step].label}</h2>
          <textarea
            style={{ width: "100%", minHeight: "80px", fontSize: "1rem", marginBottom: "1rem" }}
            value={responses[questions[step].key] || ""}
            onChange={(e) => handleChange(questions[step].key, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre réponse... (Appuyez sur Entrée pour valider)"
          />
          <button onClick={nextStep} style={buttonStyle}>Suivant</button>
        </div>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
