
import { jsPDF } from "jspdf";
import { getTextContent } from '@/utils/download/contentExtractor';
import { Resume } from '@/types/resume';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType, LevelFormat, convertInchesToTwip } from "docx";

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
    // Create a PDF document with jsPDF - A4 format
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Default formatting settings
    // Set font to Arial (ATS-friendly)
    doc.setFont("helvetica", "normal");
    
    // Set margins - 2cm (20mm) margins on all sides
    const margin = 20;
    const pageWidth = 210; // A4 width in mm
    const textWidth = pageWidth - (margin * 2);
    
    // Start position
    let yPosition = margin;
    
    // CONTACT INFORMATION SECTION
    // Name in larger font size and bold
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(resumeData.name, margin, yPosition);
    yPosition += 8;
    
    // Contact details in regular font
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const contactFields = [];
    if (resumeData.email) contactFields.push(`Email: ${resumeData.email}`);
    if (resumeData.phone) contactFields.push(`Telefon: ${resumeData.phone}`);
    if (resumeData.address) contactFields.push(`Adresse: ${resumeData.address}`);
    
    contactFields.forEach(field => {
      doc.text(field, margin, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
    
    // PROFESSIONAL SUMMARY SECTION
    if (resumeData.summary) {
      // Section title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PROFESSIONELT RESUMÉ", margin, yPosition);
      yPosition += 6;
      
      // Underline
      doc.setDrawColor(0);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
      
      // Summary content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const summaryLines = doc.splitTextToSize(getTextContent(resumeData.summary), textWidth);
      doc.text(summaryLines, margin, yPosition);
      
      yPosition += (summaryLines.length * 5) + 10;
    }
    
    // EXPERIENCE SECTION
    if (resumeData.experience) {
      // Check if we need a page break
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Section title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("ERHVERVSERFARING", margin, yPosition);
      yPosition += 6;
      
      // Underline
      doc.setDrawColor(0);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
      
      // Experience content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const experienceContent = formatContentForAts(resumeData.experience);
      const experienceLines = doc.splitTextToSize(experienceContent, textWidth);
      doc.text(experienceLines, margin, yPosition);
      
      yPosition += (experienceLines.length * 5) + 10;
    }
    
    // EDUCATION SECTION
    if (resumeData.education) {
      // Check if we need a page break
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Section title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("UDDANNELSE", margin, yPosition);
      yPosition += 6;
      
      // Underline
      doc.setDrawColor(0);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
      
      // Education content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const educationContent = formatContentForAts(resumeData.education);
      const educationLines = doc.splitTextToSize(educationContent, textWidth);
      doc.text(educationLines, margin, yPosition);
      
      yPosition += (educationLines.length * 5) + 10;
    }
    
    // SKILLS SECTION
    if (resumeData.skills) {
      // Check if we need a page break
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Section title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("KOMPETENCER", margin, yPosition);
      yPosition += 6;
      
      // Underline
      doc.setDrawColor(0);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
      
      // Skills content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const skillsContent = formatContentForAts(resumeData.skills);
      const skillsLines = doc.splitTextToSize(skillsContent, textWidth);
      doc.text(skillsLines, margin, yPosition);
    }
    
    // Save the PDF with a standardized filename
    doc.save("CV.pdf");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
};

const exportResumeToDocx = (resumeData: Resume): void => {
  try {
    // Create paragraphs for the document with ATS-friendly formatting
    const paragraphs = [];
    
    // CONTACT INFORMATION SECTION
    // Name in larger font and bold
    paragraphs.push(
      new Paragraph({
        text: resumeData.name,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          after: 200, // 10pt
        },
      })
    );
    
    // Contact information
    if (resumeData.email) {
      paragraphs.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Email: ", bold: true }),
          new TextRun(resumeData.email)
        ],
        spacing: { after: 100 }
      }));
    }
    
    if (resumeData.phone) {
      paragraphs.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Telefon: ", bold: true }),
          new TextRun(resumeData.phone)
        ],
        spacing: { after: 100 }
      }));
    }
    
    if (resumeData.address) {
      paragraphs.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Adresse: ", bold: true }),
          new TextRun(resumeData.address)
        ],
        spacing: { after: 200 }
      }));
    }
    
    // PROFESSIONAL SUMMARY SECTION
    if (resumeData.summary) {
      paragraphs.push(
        new Paragraph({
          text: "PROFESSIONELT RESUMÉ",
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
          border: {
            bottom: {
              color: "000000",
              size: 1,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      paragraphs.push(new Paragraph({ 
        text: getTextContent(resumeData.summary), 
        spacing: { after: 300 }
      }));
    }
    
    // EXPERIENCE SECTION
    paragraphs.push(
      new Paragraph({
        text: "ERHVERVSERFARING",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
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
      const experienceContent = formatContentForAts(resumeData.experience);
      
      // Split by lines for proper formatting
      const lines = experienceContent.split('\n');
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          // It's a bullet point
          paragraphs.push(new Paragraph({
            text: trimmedLine.substring(1).trim(),
            bullet: {
              level: 0
            },
            spacing: { after: 80 }
          }));
        } else if (trimmedLine) {
          // Regular paragraph
          paragraphs.push(new Paragraph({
            text: trimmedLine,
            spacing: { after: 100 }
          }));
        }
      });
    } else {
      paragraphs.push(new Paragraph({ 
        text: "Ingen erhvervserfaring angivet.",
        spacing: { after: 300 }
      }));
    }
    
    paragraphs.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    
    // EDUCATION SECTION
    paragraphs.push(
      new Paragraph({
        text: "UDDANNELSE",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
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
      const educationContent = formatContentForAts(resumeData.education);
      
      // Split by lines for proper formatting
      const lines = educationContent.split('\n');
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          // It's a bullet point
          paragraphs.push(new Paragraph({
            text: trimmedLine.substring(1).trim(),
            bullet: {
              level: 0
            },
            spacing: { after: 80 }
          }));
        } else if (trimmedLine) {
          // Regular paragraph
          paragraphs.push(new Paragraph({
            text: trimmedLine,
            spacing: { after: 100 }
          }));
        }
      });
    } else {
      paragraphs.push(new Paragraph({ 
        text: "Ingen uddannelse angivet.",
        spacing: { after: 300 }
      }));
    }
    
    paragraphs.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    
    // SKILLS SECTION
    paragraphs.push(
      new Paragraph({
        text: "KOMPETENCER",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
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
      const skillsContent = formatContentForAts(resumeData.skills);
      
      // Split by lines for proper formatting
      const lines = skillsContent.split('\n');
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          // It's a bullet point
          paragraphs.push(new Paragraph({
            text: trimmedLine.substring(1).trim(),
            bullet: {
              level: 0
            },
            spacing: { after: 80 }
          }));
        } else if (trimmedLine) {
          // Regular paragraph
          paragraphs.push(new Paragraph({
            text: trimmedLine,
            spacing: { after: 100 }
          }));
        }
      });
    } else {
      paragraphs.push(new Paragraph({ 
        text: "Ingen kompetencer angivet.",
        spacing: { after: 100 }
      }));
    }
    
    // Create document with ATS-friendly formatting
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 22, // 11pt
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 spacing
              },
            },
          },
          heading1: {
            run: {
              font: "Arial",
              size: 32, // 16pt
              bold: true,
            },
          },
          heading2: {
            run: {
              font: "Arial",
              size: 28, // 14pt
              bold: true,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.8),
                right: convertInchesToTwip(0.8),
                bottom: convertInchesToTwip(0.8),
                left: convertInchesToTwip(0.8),
              },
            },
          },
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

/**
 * Format content to be ATS-friendly:
 * - Ensures proper bullet points
 * - Removes excessive whitespace
 * - Normalizes line breaks
 */
const formatContentForAts = (content: string): string => {
  if (!content) return '';
  
  // Get clean text content
  const cleanContent = getTextContent(content);
  
  // Normalize line breaks
  const normalizedContent = cleanContent.replace(/\r\n/g, '\n');
  
  // Process line by line
  const lines = normalizedContent.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) return '';
    
    // Standardize bullet points
    if (trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-')) {
      return `- ${trimmed.substring(1).trim()}`;
    }
    
    return trimmed;
  });
  
  // Remove empty lines and join
  return processedLines.filter(line => line).join('\n');
};
