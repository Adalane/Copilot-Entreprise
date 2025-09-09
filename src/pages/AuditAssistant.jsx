import { useState } from "react";
import jsPDF from "jspdf";

export default function AuditAssistant() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});

  const questions = [
    { key: "secteur", label: "Quel est votre secteur d’activité ?" },
    { key: "effectif", label: "Combien de salariés compte votre entreprise aujourd’hui ?" },
    { key: "anciennete", label: "Depuis combien d’années l’entreprise est-elle en activité ?" },
    { key: "vision", label: "Avez-vous défini une vision ou des objectifs à 1 ou 3 ans ?" },
    { key: "priorites", label: "Quels sont vos 3 priorités de développement ?" },
    { key: "organisation", label: "Disposez-vous d’une organisation claire avec des rôles bien définis ?" },
    { key: "rh", label: "Avez-vous des difficultés de recrutement ou de fidélisation ?" },
    { key: "tableaux", label: "Avez-vous des tableaux de bord réguliers (activité, finances…) ?" },
    { key: "marge", label: "Connaissez-vous précisément vos marges ou votre seuil de rentabilité ?" },
    { key: "outils", label: "Utilisez-vous des outils numériques ou de l’automatisation ? Lesquels ?" },
  ];

  const handleChange = (key, value) => {
    setResponses({ ...responses, [key]: value });
  };

  const nextStep = () => setStep(step + 1);

  const handleSend = () => {
    const body = questions
      .map((q) => `${q.label}\\n${responses[q.key] || "-"}`)
      .join("\\n\\n");
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
      <h2 style={{ color: "#1c2b4a" }}>Votre mini diagnostic</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.key} style={{ marginBottom: "1rem" }}>
            <strong>{q.label}</strong><br />
            {responses[q.key]}
          </li>
        ))}
      </ul>
      <p style={{ color: "#1c2b4a", marginTop: "1rem" }}>
        👉 Pour aller plus loin, contactez <strong>Jean Mi</strong>, consultant expert en stratégie et organisation.
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
