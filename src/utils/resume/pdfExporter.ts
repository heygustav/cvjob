
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
      
      let yPosition = 30;
      const margin = 20;
      const textWidth = 170;
      
      // Add photo if available
      if (resumeData.photo) {
        try {
          doc.addImage(resumeData.photo, 'JPEG', margin, yPosition, 30, 30);
          
          // Personal info next to photo
          doc.setFontSize(16);
          doc.text("Personlige Oplysninger", 60, yPosition);
          doc.setFontSize(12);
          doc.text(`Navn: ${resumeData.name}`, 60, yPosition + 10);
          doc.text(`E-mail: ${resumeData.email}`, 60, yPosition + 15);
          if (resumeData.phone) doc.text(`Telefon: ${resumeData.phone}`, 60, yPosition + 20);
          if (resumeData.address) doc.text(`Adresse: ${resumeData.address}`, 60, yPosition + 25);
          
          yPosition += 40; // Move position below the photo section
        } catch (err) {
          console.error("Error adding image to PDF:", err);
          
          // If photo fails, just do regular personal info
          doc.setFontSize(16);
          doc.text("Personlige Oplysninger", margin, yPosition);
          doc.setFontSize(12);
          doc.text(`Navn: ${resumeData.name}`, margin, yPosition + 10);
          doc.text(`E-mail: ${resumeData.email}`, margin, yPosition + 15);
          if (resumeData.phone) doc.text(`Telefon: ${resumeData.phone}`, margin, yPosition + 20);
          if (resumeData.address) doc.text(`Adresse: ${resumeData.address}`, margin, yPosition + 25);
          
          yPosition += 30;
        }
      } else {
        // No photo, just do regular personal info
        doc.setFontSize(16);
        doc.text("Personlige Oplysninger", margin, yPosition);
        doc.setFontSize(12);
        doc.text(`Navn: ${resumeData.name}`, margin, yPosition + 10);
        doc.text(`E-mail: ${resumeData.email}`, margin, yPosition + 15);
        if (resumeData.phone) doc.text(`Telefon: ${resumeData.phone}`, margin, yPosition + 20);
        if (resumeData.address) doc.text(`Adresse: ${resumeData.address}`, margin, yPosition + 25);
        
        yPosition += 30;
      }
      
      // Add summary if available
      if (resumeData.summary) {
        yPosition += 10;
        doc.setFontSize(16);
        doc.text("Kort Resume", margin, yPosition);
        doc.setFontSize(12);
        
        const summaryLines = doc.splitTextToSize(getTextContent(resumeData.summary), textWidth);
        doc.text(summaryLines, margin, yPosition + 10);
        
        yPosition += 10 + (summaryLines.length * 7); // Adjust position based on text height
      }
      
      // Add experience section with Danish text
      yPosition += 10;
      doc.setFontSize(16);
      doc.text("Erhvervserfaring", margin, yPosition);
      doc.setFontSize(12);
      if (resumeData.experience) {
        const experienceLines = doc.splitTextToSize(getTextContent(resumeData.experience), textWidth);
        doc.text(experienceLines, margin, yPosition + 10);
        
        yPosition += 10 + (experienceLines.length * 7); // Adjust position based on text height
      } else {
        doc.text("Ingen erhvervserfaring angivet.", margin, yPosition + 10);
        yPosition += 20;
      }
      
      // Add education section with Danish text
      yPosition += 10;
      doc.setFontSize(16);
      doc.text("Uddannelse", margin, yPosition);
      doc.setFontSize(12);
      if (resumeData.education) {
        const educationLines = doc.splitTextToSize(getTextContent(resumeData.education), textWidth);
        doc.text(educationLines, margin, yPosition + 10);
        
        yPosition += 10 + (educationLines.length * 7); // Adjust position based on text height
      } else {
        doc.text("Ingen uddannelse angivet.", margin, yPosition + 10);
        yPosition += 20;
      }
      
      // Check if we need a new page before adding skills
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20; // Reset position for new page
      }
      
      // Add skills section with Danish text
      yPosition += 10;
      doc.setFontSize(16);
      doc.text("Færdigheder", margin, yPosition);
      doc.setFontSize(12);
      if (resumeData.skills) {
        const skillsLines = doc.splitTextToSize(getTextContent(resumeData.skills), textWidth);
        doc.text(skillsLines, margin, yPosition + 10);
      } else {
        doc.text("Ingen færdigheder angivet.", margin, yPosition + 10);
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
