import { jsPDF } from 'jspdf';
import { NewsItem } from '@/types/news';
import { format } from 'date-fns';

const COLORS = {
  primary: [30, 80, 100] as const,
  secondary: [100, 116, 139] as const,
  accent: [59, 130, 246] as const,
  success: [34, 197, 94] as const,
  warning: [245, 158, 11] as const,
  danger: [239, 68, 68] as const,
  dark: [15, 23, 42] as const,
  light: [248, 250, 252] as const,
};

const getThreatColor = (level: string): readonly [number, number, number] => {
  switch (level) {
    case 'critical': return COLORS.danger;
    case 'high': return [234, 88, 12];
    case 'elevated': return COLORS.warning;
    default: return COLORS.success;
  }
};

const getConfidenceColor = (score: number): readonly [number, number, number] => {
  if (score >= 0.9) return COLORS.success;
  if (score >= 0.7) return COLORS.warning;
  return COLORS.danger;
};

export const exportNewsItemToPDF = async (item: NewsItem): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Header with classification banner
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INTELLIGENCE REPORT', margin, 10);
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`CLASSIFIED | ${format(new Date(), 'yyyy-MM-dd HH:mm')} UTC`, margin, 16);
  
  // Token badge
  if (item.token) {
    pdf.setFillColor(59, 130, 246);
    pdf.roundedRect(pageWidth - margin - 35, 6, 35, 12, 2, 2, 'F');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.token, pageWidth - margin - 32, 14);
  }

  yPos = 35;

  // Threat level and confidence bar
  const threatColor = getThreatColor(item.threatLevel);
  pdf.setFillColor(...threatColor);
  pdf.roundedRect(margin, yPos, 40, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`THREAT: ${item.threatLevel.toUpperCase()}`, margin + 3, yPos + 5.5);

  const confColor = getConfidenceColor(item.confidenceScore);
  pdf.setFillColor(...confColor);
  pdf.roundedRect(margin + 45, yPos, 35, 8, 2, 2, 'F');
  pdf.text(`${Math.round(item.confidenceScore * 100)}% CONF`, margin + 48, yPos + 5.5);

  // Category badge
  pdf.setFillColor(100, 116, 139);
  pdf.roundedRect(margin + 85, yPos, 30, 8, 2, 2, 'F');
  pdf.text(item.category.toUpperCase(), margin + 88, yPos + 5.5);

  yPos += 18;

  // Title
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(item.title, contentWidth);
  pdf.text(titleLines, margin, yPos);
  yPos += titleLines.length * 6 + 8;

  // Meta information box
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'S');

  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text(`DATE: ${format(new Date(item.publishedAt), 'MMM d, yyyy HH:mm')} UTC`, margin + 5, yPos + 7);
  pdf.text(`LOCATION: ${item.country}, ${item.region}`, margin + 5, yPos + 14);
  pdf.text(`SOURCE: ${item.source} (${item.sourceCredibility} credibility)`, margin + contentWidth/2, yPos + 7);
  pdf.text(`ACTOR TYPE: ${item.actorType}`, margin + contentWidth/2, yPos + 14);

  yPos += 28;

  // Coordinates section
  pdf.setFillColor(30, 41, 59);
  pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`COORDINATES:`, margin + 5, yPos + 8);
  pdf.setTextColor(96, 165, 250);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`LAT ${item.lat.toFixed(4)}  |  LON ${item.lon.toFixed(4)}`, margin + 40, yPos + 8);

  yPos += 20;

  // Map section
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LOCATION MAP', margin, yPos);
  yPos += 5;

  // Draw a stylized map representation
  const mapHeight = 50;
  
  // Map background with gradient effect
  pdf.setFillColor(226, 232, 240);
  pdf.roundedRect(margin, yPos, contentWidth, mapHeight, 3, 3, 'F');
  
  // Grid lines for map effect
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.2);
  for (let i = 1; i < 8; i++) {
    pdf.line(margin + (contentWidth / 8) * i, yPos, margin + (contentWidth / 8) * i, yPos + mapHeight);
  }
  for (let i = 1; i < 5; i++) {
    pdf.line(margin, yPos + (mapHeight / 5) * i, margin + contentWidth, yPos + (mapHeight / 5) * i);
  }
  
  // Location pin in center
  const pinX = margin + contentWidth / 2;
  const pinY = yPos + mapHeight / 2;
  
  // Pin shadow
  pdf.setFillColor(100, 116, 139);
  pdf.ellipse(pinX, pinY + 8, 6, 2, 'F');
  
  // Pin body
  pdf.setFillColor(239, 68, 68);
  pdf.circle(pinX, pinY - 4, 8, 'F');
  
  // Pin point (triangle)
  pdf.triangle(pinX - 5, pinY, pinX + 5, pinY, pinX, pinY + 8, 'F');
  
  // Pin inner circle
  pdf.setFillColor(255, 255, 255);
  pdf.circle(pinX, pinY - 4, 4, 'F');
  pdf.setFillColor(239, 68, 68);
  pdf.circle(pinX, pinY - 4, 2, 'F');
  
  // Location label
  pdf.setFillColor(15, 23, 42);
  pdf.roundedRect(pinX - 30, yPos + mapHeight - 12, 60, 10, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${item.country}, ${item.region}`, pinX, yPos + mapHeight - 5, { align: 'center' });
  
  // Coordinate labels on corners
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`LAT: ${item.lat.toFixed(4)}`, margin + 3, yPos + 8);
  pdf.text(`LON: ${item.lon.toFixed(4)}`, margin + contentWidth - 25, yPos + 8);
  
  yPos += mapHeight + 8;

  // Summary section
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INTELLIGENCE SUMMARY', margin, yPos);
  yPos += 6;

  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, margin + 40, yPos);
  yPos += 6;

  pdf.setTextColor(51, 65, 85);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const summaryLines = pdf.splitTextToSize(item.summary, contentWidth);
  pdf.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // Tags section
  if (item.tags.length > 0) {
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KEYWORDS & TAGS', margin, yPos);
    yPos += 8;

    let tagX = margin;
    item.tags.forEach((tag) => {
      const tagWidth = pdf.getTextWidth(tag) + 8;
      
      if (tagX + tagWidth > pageWidth - margin) {
        tagX = margin;
        yPos += 10;
      }
      
      pdf.setFillColor(226, 232, 240);
      pdf.roundedRect(tagX, yPos - 5, tagWidth, 8, 2, 2, 'F');
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(tag, tagX + 4, yPos);
      
      tagX += tagWidth + 4;
    });
    yPos += 15;
  }

  // Source reference
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'S');
  
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('SOURCE REFERENCE:', margin + 5, yPos + 6);
  pdf.setTextColor(59, 130, 246);
  const urlText = item.url.length > 80 ? item.url.substring(0, 80) + '...' : item.url;
  pdf.text(urlText, margin + 5, yPos + 11);

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(7);
  pdf.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} UTC`, margin, footerY);
  pdf.text(`Intel ID: ${item.id}`, pageWidth - margin - 50, footerY);
  pdf.text('CONFIDENTIAL - AUTHORIZED PERSONNEL ONLY', pageWidth / 2 - 30, footerY);

  // Save
  const filename = `intel-report-${item.token || item.id}-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`;
  pdf.save(filename);
};
