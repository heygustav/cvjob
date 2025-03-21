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
    if (resumeData.structuredExperience && resumeData.structuredExperience.length > 0) {
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
      
      // Structured Experience content - ATS optimized
      doc.setFontSize(11);
      
      resumeData.structuredExperience.forEach((exp) => {
        // Position in bold
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, margin, yPosition);
        
        // Date on the right side
        const dateText = `${exp.fromDate} - ${exp.toDate || 'Nu'}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setFont("helvetica", "normal");
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
        
        yPosition += 5;
        
        // Organization
        doc.text(exp.organization, margin, yPosition);
        yPosition += 6;
        
        // Bullet points with proper indentation for ATS
        if (exp.bulletPoints && exp.bulletPoints.length > 0) {
          exp.bulletPoints.forEach(point => {
            if (!point.trim()) return; // Skip empty bullet points
            
            const bulletText = `• ${point}`;
            const bulletLines = doc.splitTextToSize(bulletText, textWidth - 5);
            
            // First line with bullet
            doc.text(bulletLines[0], margin, yPosition);
            
            // Any additional wrapped lines need proper indentation
            if (bulletLines.length > 1) {
              for (let i = 1; i < bulletLines.length; i++) {
                yPosition += 5;
                doc.text(bulletLines[i], margin + 3, yPosition); // Indent wrapped lines
              }
            }
            
            yPosition += 5;
          });
        }
        
        yPosition += 5; // Space between experiences
      });
    } else if (resumeData.experience) {
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
    if (resumeData.structuredEducation && resumeData.structuredEducation.length > 0) {
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
      
      // Structured Education content
      doc.setFontSize(11);
      
      resumeData.structuredEducation.forEach((edu) => {
        // Education in bold
        doc.setFont("helvetica", "bold");
        doc.text(edu.education, margin, yPosition);
        
        // Date on the right side
        const dateText = `${edu.fromDate} - ${edu.toDate || 'Nu'}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setFont("helvetica", "normal");
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
        
        yPosition += 5;
        
        // School
        doc.text(edu.school, margin, yPosition);
        yPosition += 6;
        
        // Bullet points with proper indentation for ATS
        if (edu.bulletPoints && edu.bulletPoints.length > 0) {
          edu.bulletPoints.forEach(point => {
            if (!point.trim()) return; // Skip empty bullet points
            
            const bulletText = `• ${point}`;
            const bulletLines = doc.splitTextToSize(bulletText, textWidth - 5);
            
            // First line with bullet
            doc.text(bulletLines[0], margin, yPosition);
            
            // Any additional wrapped lines need proper indentation
            if (bulletLines.length > 1) {
              for (let i = 1; i < bulletLines.length; i++) {
                yPosition += 5;
                doc.text(bulletLines[i], margin + 3, yPosition); // Indent wrapped lines
              }
            }
            
            yPosition += 5;
          });
        }
        
        yPosition += 5; // Space between education entries
      });
    } else if (resumeData.education) {
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
    if (resumeData.structuredSkills && resumeData.structuredSkills.length > 0) {
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
      
      // Create a more ATS-friendly skill layout
      const skillColumns = 2;
      const skillsPerColumn = Math.ceil(resumeData.structuredSkills.length / skillColumns);
      const columnWidth = (textWidth - 10) / skillColumns;
      
      for (let i = 0; i < skillsPerColumn; i++) {
        for (let j = 0; j < skillColumns; j++) {
          const index = i + (j * skillsPerColumn);
          if (index < resumeData.structuredSkills.length) {
            const skill = resumeData.structuredSkills[index];
            const skillText = `${skill.skill} (${skill.years} år)`;
            
            if (skillText.trim()) {
              doc.setFont("helvetica", "normal");
              doc.text(skillText, margin + (j * columnWidth), yPosition);
            }
          }
        }
        yPosition += 5;
      }
      
      yPosition += 5; // Add space after skills
      
      // If there are bullet points under skills, add them in a list format
      const skillsWithBullets = resumeData.structuredSkills.filter(
        skill => skill.bulletPoints && skill.bulletPoints.length > 0
      );
      
      if (skillsWithBullets.length > 0) {
        yPosition += 3;
        doc.text("Uddybning af nøglekompetencer:", margin, yPosition);
        yPosition += 5;
        
        skillsWithBullets.forEach(skill => {
          if (skill.bulletPoints && skill.bulletPoints.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text(skill.skill + ":", margin, yPosition);
            yPosition += 5;
            doc.setFont("helvetica", "normal");
            
            skill.bulletPoints.forEach(point => {
              if (!point.trim()) return; // Skip empty bullet points
              
              const bulletText = `• ${point}`;
              const bulletLines = doc.splitTextToSize(bulletText, textWidth - 5);
              
              // First line with bullet
              doc.text(bulletLines[0], margin, yPosition);
              
              // Any additional wrapped lines need proper indentation
              if (bulletLines.length > 1) {
                for (let i = 1; i < bulletLines.length; i++) {
                  yPosition += 5;
                  doc.text(bulletLines[i], margin + 3, yPosition); // Indent wrapped lines
                }
              }
              
              yPosition += 5;
            });
          }
        });
      }
    } else if (resumeData.skills) {
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
    
    // Add metadata for better ATS parsing
    doc.setProperties({
      title: `CV - ${resumeData.name}`,
      subject: "Curriculum Vitae",
      keywords: `CV, resume, ${resumeData.name}${resumeData.structuredSkills ? ', ' + resumeData.structuredSkills.map(s => s.skill).join(', ') : ''}`,
      creator: "CV Builder Application"
    });
    
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
  // Remove excess whitespace which can confuse ATS
  let formattedContent = content.trim().replace(/\s+/g, ' ');
  
  // Ensure bullet points are properly formatted for ATS
  formattedContent = formattedContent.replace(/•/g, '\n• ');
  formattedContent = formattedContent.replace(/\*\s/g, '\n• ');
  formattedContent = formattedContent.replace(/-\s/g, '\n• ');
  
  // Ensure there's only one bullet point character at the start of each line
  formattedContent = formattedContent.replace(/\n\s*•\s*•\s*/g, '\n• ');
  
  return formattedContent;
};
