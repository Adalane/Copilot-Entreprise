
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const renderSummary = () => {
    return (
      <Card className="max-w-xl mx-auto mt-6 p-4 bg-[#fdfaf5] border-[#1c2b4a]">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-[#1c2b4a]">Votre mini diagnostic</h2>
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.key}>
                <strong>{q.label}</strong><br />
                <span>{responses[q.key]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="font-medium text-[#1c2b4a]">
              👉 Pour aller plus loin, je vous recommande de contacter <strong>Jean Mi</strong>, consultant expert en stratégie et organisation. Souhaitez-vous transmettre votre diagnostic ?
            </p>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleSend} className="bg-[#1c2b4a] text-white hover:bg-[#2f3d60]">Envoyer à Jean Mi</Button>
              <Button onClick={handleDownloadPDF} variant="outline" className="border-[#1c2b4a] text-[#1c2b4a] hover:bg-[#f0e9e0]">Télécharger le PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 bg-[#fdfaf5] min-h-screen">
      {step < questions.length ? (
        <Card className="max-w-xl mx-auto border-[#1c2b4a]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#1c2b4a]">
              {questions[step].label}
            </h2>
            <Textarea
              className="mb-4"
              value={responses[questions[step].key] || ""}
              onChange={(e) => handleChange(questions[step].key, e.target.value)}
              placeholder="Votre réponse..."
            />
            <Button onClick={nextStep} className="bg-[#1c2b4a] text-white hover:bg-[#2f3d60]">Suivant</Button>
          </CardContent>
        </Card>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
