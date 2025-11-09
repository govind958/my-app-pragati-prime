/**
 * Sanitize HTML content by removing dangerous elements and attributes
 * This is a basic sanitizer - for production, consider using DOMPurify
 */
export function sanitizeHTML(html) {
  if (!html) return ''
  
  if (typeof window === 'undefined') {
    // Server-side: basic regex cleanup (will be fully sanitized on client)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '')
  }

  try {
    // Create a temporary DOM element
    const temp = document.createElement('div')
    temp.innerHTML = html || ''

    // Remove script tags and their content
    const scripts = temp.querySelectorAll('script, style, iframe, object, embed, form, input, button')
    scripts.forEach(el => el.remove())

    // List of safe attributes to keep
    const safeAttributes = ['href', 'target', 'rel', 'alt', 'title']
    const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div', 'sup', 'sub']

    // Remove dangerous attributes and clean up elements
    const allElements = temp.querySelectorAll('*')
    allElements.forEach(el => {
      const tagName = el.tagName.toLowerCase()
      
      // Remove element if not in allowed tags (preserve content)
      if (!allowedTags.includes(tagName)) {
        const parent = el.parentNode
        if (parent) {
          // Replace with a span to preserve text content
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el)
          }
          parent.removeChild(el)
          return
        }
      }

      // Remove all attributes first
      Array.from(el.attributes).forEach(attr => {
        const attrName = attr.name.toLowerCase()
        
        // Remove dangerous attributes
        if (attrName.startsWith('on') || // Event handlers
            attrName === 'style' || // Inline styles
            attrName === 'id' || // IDs
            (!safeAttributes.includes(attrName) && tagName !== 'a')) { // Other attributes
          el.removeAttribute(attr.name)
        }
      })

      // Clean up links to prevent XSS
      if (tagName === 'a') {
        const href = el.getAttribute('href')
        if (href) {
          // Remove dangerous protocols
          if (href.startsWith('javascript:') || 
              href.startsWith('data:') || 
              href.startsWith('vbscript:')) {
            el.removeAttribute('href')
          } else {
            // Ensure safe link attributes
            el.setAttribute('target', '_blank')
            el.setAttribute('rel', 'noopener noreferrer')
          }
        }
      }
    })

    return temp.innerHTML
  } catch (error) {
    console.error('Error sanitizing HTML:', error)
    // Fallback: strip all HTML tags
    return stripHTML(html)
  }
}

/**
 * Strip HTML tags and return plain text
 * Works on both server and client side
 */
export function stripHTML(html) {
  if (!html) return ''
  
  // Basic HTML entity decoding
  let text = html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  // If we're on the client side, use DOM for better accuracy
  if (typeof window !== 'undefined') {
    try {
      const temp = document.createElement('div')
      temp.innerHTML = html
      const domText = temp.textContent || temp.innerText || ''
      if (domText.trim()) {
        return domText.trim()
      }
    } catch {
      // Fall back to regex method
    }
  }

  return text
}

