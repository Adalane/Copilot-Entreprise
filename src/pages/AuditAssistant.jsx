import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function AuditAssistant() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAvatar, setShowAvatar] = useState(true);
  const [voiceEnabled] = useState(true);

  const questions = [
    { key: "secteur", label: "Dans quel secteur exercez-vous ?" },
    { key: "effectif", label: "Combien de salariés compte votre entreprise ?" },
    { key: "anciennete", label: "Depuis combien d’années êtes-vous en activité ?" },
    { key: "vision", label: "Avez-vous défini une vision ou des objectifs à 1 ou 3 ans ?" },
    { key: "priorites", label: "Quelles sont vos 3 priorités de développement ?" },
    { key: "organisation", label: "Votre organisation est-elle structurée avec des rôles bien définis ?" },
    { key: "rh", label: "Rencontrez-vous des difficultés de recrutement ou de fidélisation ?" },
    { key: "tableaux", label: "Disposez-vous de tableaux de bord pour suivre votre activité ?" },
    { key: "marge", label: "Connaissez-vous précisément vos marges ou votre seuil de rentabilité ?" },
    { key: "outils", label: "Utilisez-vous des outils numériques ou de l’automatisation ? Lesquels ?" },
  ];

  const iaIntro = [
    "Bonjour, je suis Copilot IA, votre assistant intelligent pour ce diagnostic.",
    "Merci. Passons à la prochaine question...",
    "C’est noté. Allons un peu plus loin...",
    "Je continue l’analyse...",
    "Encore une étape pour affiner votre profil..."
  ];

  useEffect(() => {
    if (voiceEnabled && step < questions.length) {
      const message = new SpeechSynthesisUtterance(
        step === 0 ? iaIntro[0] : iaIntro[Math.min(step, iaIntro.length - 1)]
      );
      message.lang = "fr-FR";
      window.speechSynthesis.speak(message);
    }
  }, [step, voiceEnabled]);

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
            placeholder="Votre réponse..."
          />
          <button onClick={nextStep} style={buttonStyle}>Suivant</button>
        </div>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
