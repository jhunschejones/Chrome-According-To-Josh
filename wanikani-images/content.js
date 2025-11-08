// WaniKani Images Chrome Extension
// Parses markdown images from notes and displays them on the page

(function() {
  'use strict';

  const CONFIG = {
    notesSelector: '.user-note__text',
  };

  function extractImageInfo(text) {
    if (!text) return null;
    const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (match && match[2] && isValidImageUrl(match[2].trim())) {
      return {
        url: match[2].trim(),
        altText: match[1] || '',
        fullMatch: match[0]
      };
    }
    return null;
  }

  function isImgurAlbumLink(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('imgur.com') &&
             (urlObj.pathname.startsWith('/a/') || urlObj.pathname.startsWith('/gallery/'));
    } catch (e) {
      return false;
    }
  }

  function tryConvertImgurUrl(url) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'i.imgur.com') return url;
      if (isImgurAlbumLink(url)) return null;
      if (urlObj.hostname.includes('imgur.com') && urlObj.pathname.match(/^\/[a-zA-Z0-9]+$/)) {
        return `https://i.imgur.com/${urlObj.pathname.substring(1)}.jpg`;
      }
    } catch (e) {}
    return null;
  }

  function isValidImageUrl(url) {
    if (!url) return false;
    try {
      return ['http:', 'https:', 'data:'].includes(new URL(url).protocol);
    } catch (e) {
      return url.startsWith('/') || url.startsWith('data:') || url.startsWith('./');
    }
  }

  function createImageElement(imageUrl, altText, container) {
    const img = document.createElement('img');
    img.src = tryConvertImgurUrl(imageUrl) || imageUrl;
    img.alt = altText || 'WaniKani note image';
    img.setAttribute('data-wanikani-extension', 'true');
    img.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 10px 0;';

    img.onerror = function() {
      img.style.display = 'none';
      const insertTarget = container || img.parentNode;
      if (!insertTarget) return;

      const existingError = insertTarget.querySelector('.wanikani-image-error');
      if (existingError) existingError.remove();

      const errorDiv = document.createElement('div');
      errorDiv.className = 'wanikani-image-error';
      errorDiv.style.cssText = 'padding: 10px; background-color: #fee; border: 1px solid #fcc; border-radius: 4px; margin: 10px 0; font-size: 12px; color: #c33;';
      errorDiv.innerHTML = '<strong>⚠️ Image failed to load</strong><br>URL: ' + imageUrl + '<br>' +
        (isImgurAlbumLink(imageUrl)
          ? '<em>This is an Imgur album link. Use a direct image URL instead.</em>'
          : '<em>Please check that the URL is a direct link to an image file.</em>');

      if (img.parentNode) {
        img.parentNode.insertBefore(errorDiv, img.nextSibling || null);
      } else {
        insertTarget.appendChild(errorDiv);
      }
    };

    return img;
  }

  function replaceMarkdownWithImage(element, imageUrl, markdownText, altText) {
    if (!element || !imageUrl || !markdownText || element.hasAttribute('data-wanikani-processed')) {
      return;
    }

    const img = createImageElement(imageUrl, altText, element);
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

    let textNode;
    while (textNode = walker.nextNode()) {
      if (textNode.textContent.includes(markdownText)) {
        const parent = textNode.parentNode;
        const index = textNode.textContent.indexOf(markdownText);
        const fragment = document.createDocumentFragment();

        const beforeText = textNode.textContent.substring(0, index);
        const afterText = textNode.textContent.substring(index + markdownText.length);

        if (beforeText) fragment.appendChild(document.createTextNode(beforeText));
        fragment.appendChild(img.cloneNode(true));
        if (afterText) fragment.appendChild(document.createTextNode(afterText));

        parent.replaceChild(fragment, textNode);
        element.setAttribute('data-wanikani-processed', 'true');
        return;
      }
    }

    // Fallback: innerHTML replacement
    const escapedMarkdown = markdownText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newHtml = element.innerHTML.replace(new RegExp(escapedMarkdown, 'g'), img.outerHTML);
    if (newHtml !== element.innerHTML) {
      element.innerHTML = newHtml;
    } else {
      element.appendChild(img);
    }
    element.setAttribute('data-wanikani-processed', 'true');
  }

  function showReparseFeedback(processedCount, imageFoundCount) {
    const existing = document.querySelector('.wanikani-reparse-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = 'wanikani-reparse-feedback';
    feedback.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 12px 20px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10000; font-size: 14px; font-family: sans-serif;';
    feedback.textContent = `Reparsed! Found ${imageFoundCount} image(s) in ${processedCount} note(s)`;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.transition = 'opacity 0.3s';
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }

  function processNotes(forceReparse) {
    if (!CONFIG.notesSelector) return;

    const notesElements = document.querySelectorAll(CONFIG.notesSelector);
    let processedCount = 0;
    let imageFoundCount = 0;

    notesElements.forEach(function(notesElement) {
      if (forceReparse) {
        notesElement.removeAttribute('data-wanikani-processed');
        const existingImage = notesElement.querySelector('img[data-wanikani-extension]');
        if (existingImage) existingImage.remove();
        const existingError = notesElement.querySelector('.wanikani-image-error');
        if (existingError) existingError.remove();
      }

      if (!forceReparse && notesElement.hasAttribute('data-wanikani-processed')) {
        return;
      }

      const notesText = notesElement.textContent || notesElement.innerText;
      const imageInfo = extractImageInfo(notesText);

      if (!imageInfo) return;

      imageFoundCount++;
      replaceMarkdownWithImage(notesElement, imageInfo.url, imageInfo.fullMatch, imageInfo.altText);
      processedCount++;
    });

    if (forceReparse) {
      showReparseFeedback(processedCount, imageFoundCount);
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => processNotes(false));
    } else {
      processNotes(false);
    }

    const observer = new MutationObserver(() => processNotes(false));
    observer.observe(document.body, { childList: true, subtree: true });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'reparse') {
        processNotes(true);
        sendResponse({ success: true });
      }
      return true;
    });
  }

  init();
})();
