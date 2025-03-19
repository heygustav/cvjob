
import { jsPDF } from "jspdf";
import { getTextContent } from '@/utils/download/contentExtractor';
import { Resume } from '@/types/resume';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from "docx";

export type ResumeFormat = "pdf" | "docx";

export const exportResume = (
  resumeData: Resume,
  format: ResumeFormat = "pdf"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Exporting resume with data:", resumeData);
      
      if (format === "pdf") {
        exportResumeToPdf(resumeData);
      } else {
        exportResumeToDocx(resumeData);
      }
      
      resolve();
    } catch (error) {
      console.error("Error exporting resume:", error);
      reject(error);
    }
  });
};

const exportResumeToPdf = (resumeData: Resume): void => {
  try {
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
        // Add underline for heading
        doc.setDrawColor(0);
        doc.line(60, yPosition + 1, 150, yPosition + 1);
        
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
        // Add underline for heading
        doc.setDrawColor(0);
        doc.line(margin, yPosition + 1, margin + 90, yPosition + 1);
        
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
      // Add underline for heading
      doc.setDrawColor(0);
      doc.line(margin, yPosition + 1, margin + 90, yPosition + 1);
      
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
      // Add underline for heading
      doc.setDrawColor(0);
      doc.line(margin, yPosition + 1, margin + 60, yPosition + 1);
      
      doc.setFontSize(12);
      
      const summaryLines = doc.splitTextToSize(getTextContent(resumeData.summary), textWidth);
      doc.text(summaryLines, margin, yPosition + 10);
      
      yPosition += 10 + (summaryLines.length * 7); // Adjust position based on text height
    }
    
    // Add experience section with Danish text
    yPosition += 10;
    doc.setFontSize(16);
    doc.text("Erhvervserfaring", margin, yPosition);
    // Add underline for heading
    doc.setDrawColor(0);
    doc.line(margin, yPosition + 1, margin + 70, yPosition + 1);
    
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
    // Add underline for heading
    doc.setDrawColor(0);
    doc.line(margin, yPosition + 1, margin + 50, yPosition + 1);
    
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
    doc.text("Kompetencer", margin, yPosition);
    // Add underline for heading
    doc.setDrawColor(0);
    doc.line(margin, yPosition + 1, margin + 60, yPosition + 1);
    
    doc.setFontSize(12);
    if (resumeData.skills) {
      const skillsLines = doc.splitTextToSize(getTextContent(resumeData.skills), textWidth);
      doc.text(skillsLines, margin, yPosition + 10);
    } else {
      doc.text("Ingen kompetencer angivet.", margin, yPosition + 10);
    }
    
    // Save the PDF with simplified filename
    doc.save("CV.pdf");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
};

const exportResumeToDocx = (resumeData: Resume): void => {
  try {
    // Create paragraphs for the document
    const paragraphs = [];
    
    // Add title
    paragraphs.push(
      new Paragraph({
        text: "Curriculum Vitae",
        heading: HeadingLevel.HEADING_1,
        alignment: "center",
      })
    );
    
    // Personal Info Section
    paragraphs.push(
      new Paragraph({
        text: "Personlige Oplysninger",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "000000",
            size: 1,
            style: BorderStyle.SINGLE,
          },
        },
      })
    );
    
    paragraphs.push(new Paragraph({ text: `Navn: ${resumeData.name}` }));
    paragraphs.push(new Paragraph({ text: `E-mail: ${resumeData.email}` }));
    if (resumeData.phone) {
      paragraphs.push(new Paragraph({ text: `Telefon: ${resumeData.phone}` }));
    }
    if (resumeData.address) {
      paragraphs.push(new Paragraph({ text: `Adresse: ${resumeData.address}` }));
    }
    
    // Add empty paragraph for spacing
    paragraphs.push(new Paragraph({}));
    
    // Summary Section
    if (resumeData.summary) {
      paragraphs.push(
        new Paragraph({
          text: "Kort Resume",
          heading: HeadingLevel.HEADING_2,
          border: {
            bottom: {
              color: "000000",
              size: 1,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      paragraphs.push(new Paragraph({ text: getTextContent(resumeData.summary) }));
      
      // Add empty paragraph for spacing
      paragraphs.push(new Paragraph({}));
    }
    
    // Experience Section
    paragraphs.push(
      new Paragraph({
        text: "Erhvervserfaring",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "000000",
            size: 1,
            style: BorderStyle.SINGLE,
          },
        },
      })
    );
    
    if (resumeData.experience) {
      paragraphs.push(new Paragraph({ text: getTextContent(resumeData.experience) }));
    } else {
      paragraphs.push(new Paragraph({ text: "Ingen erhvervserfaring angivet." }));
    }
    
    // Add empty paragraph for spacing
    paragraphs.push(new Paragraph({}));
    
    // Education Section
    paragraphs.push(
      new Paragraph({
        text: "Uddannelse",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "000000",
            size: 1,
            style: BorderStyle.SINGLE,
          },
        },
      })
    );
    
    if (resumeData.education) {
      paragraphs.push(new Paragraph({ text: getTextContent(resumeData.education) }));
    } else {
      paragraphs.push(new Paragraph({ text: "Ingen uddannelse angivet." }));
    }
    
    // Add empty paragraph for spacing
    paragraphs.push(new Paragraph({}));
    
    // Skills Section
    paragraphs.push(
      new Paragraph({
        text: "Kompetencer",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "000000",
            size: 1,
            style: BorderStyle.SINGLE,
          },
        },
      })
    );
    
    if (resumeData.skills) {
      paragraphs.push(new Paragraph({ text: getTextContent(resumeData.skills) }));
    } else {
      paragraphs.push(new Paragraph({ text: "Ingen kompetencer angivet." }));
    }
    
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });
    
    // Generate buffer and save
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "CV.docx";
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  } catch (error) {
    console.error("Error exporting DOCX:", error);
    throw error;
  }
};
