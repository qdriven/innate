
import { Category, Flashcard } from '../types';

/**
 * Parses a specific Markdown format:
 * # Title
 * Icon: ⚛️
 * Video: https://...
 * Description: Short text...
 * ---
 * Q: Question text
 * A: Answer text
 * ---
 * Q: Next question...
 */
export const parseMarkdown = (md: string): Partial<Category> & { cards: Flashcard[] } => {
  const lines = md.split('\n');
  let name = 'New Category';
  let icon = '📚';
  let description = '';
  let videoUrl = '';
  const cards: Flashcard[] = [];

  let currentQuestion = '';
  let currentAnswer = '';

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) name = trimmed.replace('# ', '');
    else if (trimmed.startsWith('Icon: ')) icon = trimmed.replace('Icon: ', '');
    else if (trimmed.startsWith('Video: ')) videoUrl = trimmed.replace('Video: ', '');
    else if (trimmed.startsWith('Description: ')) description = trimmed.replace('Description: ', '');
    else if (trimmed.startsWith('Q: ')) currentQuestion = trimmed.replace('Q: ', '');
    else if (trimmed.startsWith('A: ')) currentAnswer = trimmed.replace('A: ', '');
    
    if (trimmed === '---' || line === lines[lines.length - 1]) {
      if (currentQuestion && currentAnswer) {
        cards.push({
          id: Math.random().toString(36).substr(2, 9),
          question: currentQuestion,
          answer: currentAnswer
        });
        currentQuestion = '';
        currentAnswer = '';
      }
    }
  });

  return {
    id: `md-${Date.now()}`,
    name,
    icon,
    description,
    videoUrl,
    cards
  };
};

export const generateMarkdown = (category: Category): string => {
  let md = `# ${category.name}\n`;
  md += `Icon: ${category.icon}\n`;
  md += `Video: ${category.videoUrl || ''}\n`;
  md += `Description: ${category.description}\n\n`;
  
  category.cards.forEach(card => {
    md += `---\n`;
    md += `Q: ${card.question}\n`;
    md += `A: ${card.answer}\n`;
  });
  
  return md;
};
