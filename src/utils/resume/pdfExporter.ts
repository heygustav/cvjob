
import { jsPDF } from "jspdf";
import { getTextContent } from '@/utils/download/contentExtractor';
import { Resume } from '@/types/resume';

export const exportResumeToPdf = (
  resumeData: Resume
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Exporting resume with data:", resumeData);
      
      // Create a PDF document with jsPDF
      const doc = new jsPDF();
      
      // Set font to Times New Roman
      doc.setFont("times", "normal");
      
      // Add title
      doc.setFontSize(20);
      doc.text("Curriculum Vitae", 105, 15, { align: "center" });
      
      // Add photo if available
      let contentStartY = 30;
      if (resumeData.photo) {
        try {
          doc.addImage(resumeData.photo, 'JPEG', 20, 20, 30, 30);
          contentStartY = 60; // Move content down if photo is present
        } catch (err) {
          console.error("Error adding image to PDF:", err);
        }
      }
      
      // Add personal info section with Danish text
      doc.setFontSize(16);
      doc.text("Personlige Oplysninger", resumeData.photo ? 60 : 20, 30);
      doc.setFontSize(12);
      doc.text(`Navn: ${resumeData.name}`, resumeData.photo ? 60 : 20, 40);
      doc.text(`E-mail: ${resumeData.email}`, resumeData.photo ? 60 : 20, 45);
      if (resumeData.phone) doc.text(`Telefon: ${resumeData.phone}`, resumeData.photo ? 60 : 20, 50);
      if (resumeData.address) doc.text(`Adresse: ${resumeData.address}`, resumeData.photo ? 60 : 20, 55);
      
      // Add experience section with Danish text
      doc.setFontSize(16);
      doc.text("Erhvervserfaring", 20, contentStartY);
      doc.setFontSize(12);
      if (resumeData.experience) {
        const experienceLines = doc.splitTextToSize(getTextContent(resumeData.experience), 170);
        doc.text(experienceLines, 20, contentStartY + 10);
      } else {
        doc.text("Ingen erhvervserfaring angivet.", 20, contentStartY + 10);
      }
      
      // Add education section with Danish text
      const educationYPos = resumeData.experience ? contentStartY + 40 : contentStartY + 10;
      doc.setFontSize(16);
      doc.text("Uddannelse", 20, educationYPos);
      doc.setFontSize(12);
      if (resumeData.education) {
        const educationLines = doc.splitTextToSize(getTextContent(resumeData.education), 170);
        doc.text(educationLines, 20, educationYPos + 10);
      } else {
        doc.text("Ingen uddannelse angivet.", 20, educationYPos + 10);
      }
      
      // Add skills section with Danish text
      const skillsYPos = resumeData.education ? educationYPos + 40 : educationYPos + 10;
      doc.setFontSize(16);
      doc.text("Færdigheder", 20, skillsYPos);
      doc.setFontSize(12);
      if (resumeData.skills) {
        const skillsLines = doc.splitTextToSize(getTextContent(resumeData.skills), 170);
        doc.text(skillsLines, 20, skillsYPos + 10);
      } else {
        doc.text("Ingen færdigheder angivet.", 20, skillsYPos + 10);
      }
      
      // Save the PDF with Danish filename
      doc.save("Ansoegning.pdf");
      
      resolve();
    } catch (error) {
      console.error("Error exporting resume:", error);
      reject(error);
    }
  });
};
