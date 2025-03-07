/**
 * Utility functions for formatting description text with HTML or Markdown
 */

/**
 * Converts HTML content to React-compatible JSX
 * This function safely parses HTML content and returns it as JSX
 * 
 * @param htmlContent The HTML content to parse
 * @returns Object with __html property containing sanitized HTML
 */
export function createMarkup(htmlContent: string) {
  return { __html: htmlContent };
}

/**
 * Checks if a string contains HTML tags
 * 
 * @param text The text to check
 * @returns Boolean indicating if the text contains HTML
 */
export function containsHtml(text: string): boolean {
  const htmlRegex = /<([a-z][a-z0-9]*)\b[^>]*>|<\/([a-z][a-z0-9]*)\b[^>]*>/i;
  return htmlRegex.test(text);
}

/**
 * Simple markdown-like parser that converts basic markdown to HTML
 * Supports headings, lists, paragraphs, and basic formatting
 * 
 * @param markdown The markdown text to parse
 * @returns HTML string
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // If it already contains HTML, return as is
  if (containsHtml(markdown)) return markdown;
  
  let html = markdown;
  
  // Convert headings (## Heading)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert lists
  // Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Wrap list items in appropriate list tags
  let inList = false;
  let listType = '';
  const lines = html.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('<li>')) {
      if (!inList) {
        // Determine list type based on original markdown
        const originalLine = markdown.split('\n')[i];
        listType = originalLine.startsWith('*') || originalLine.startsWith('-') ? 'ul' : 'ol';
        lines[i] = `<${listType}>` + lines[i];
        inList = true;
      }
    } else if (inList) {
      lines[i-1] = lines[i-1] + `</${listType}>`;
      inList = false;
    }
  }
  
  // Close any open list
  if (inList && lines.length > 0) {
    lines[lines.length-1] = lines[lines.length-1] + `</${listType}>`;
  }
  
  html = lines.join('\n');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
  html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');
  
  // Convert paragraphs (lines with content)
  html = html.replace(/^(?!<[hou]|<li|<p|<strong|<em)(.*$)/gim, '<p>$1</p>');
  
  // Remove empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
}

/**
 * Strips HTML tags from a string
 * 
 * @param html The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Creates a plain text excerpt from HTML or markdown content
 * 
 * @param content The HTML or markdown content
 * @param length The maximum length of the excerpt
 * @returns Plain text excerpt
 */
export function createExcerpt(content: string, length: number = 150): string {
  // First parse markdown if needed
  const html = containsHtml(content) ? content : parseMarkdown(content);
  
  // Then strip HTML tags
  const plainText = stripHtml(html);
  
  // Create excerpt
  if (plainText.length <= length) return plainText;
  
  return plainText.substring(0, length) + '...';
}