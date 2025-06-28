import * as cheerio from 'cheerio';

// Function to detect display ads that appear after comment sections
// Note: This function is available for future ad detection features
function _checkForPostCommentAds(selector, id, className, text = '', _tagName = '') {
  // Enhanced ad network patterns including WordPress and modern ad networks
  const adNetworkPatterns = [
    // Major ad networks (generic patterns)
    'doubleclick', 'googletag', 'adsense', 'amazon-adsystem',
    'prebid', 'header-bidding', 'dfp', 'gpt', 'adnxs', 'adsystem',
    
    // WordPress/Plugin-specific ad patterns
    'wpd-', 'wpdiscuz', 'wpcom', 'wp-ad', 'wordpress-ad',
    'advanced-ads', 'ad-inserter', 'ezoic', 'mediavine', 'adthrive',
    'wp-insert', 'quick-adsense', 'adsense-plugin',
    
    // Modern ad networks and platforms
    'kargo', 'criteo', 'rubicon', 'pubmatic', 'sovrn', 'ix',
    'smartadserver', 'appnexus', 'openx', 'revive', 'yieldmo',
    'tribal-fusion', 'casale', 'contextweb', 'adsupply',
    
    // Display ad characteristics
    'banner', 'display-ad', 'ad-unit', 'ad-container', 'ad-wrapper',
    'ad-slot', 'ad-placement', 'sponsored-content', 'native-ad',
    'ad-space', 'advertisement', 'promo-box', 'sponsor-box',
    
    // Dynamic/programmatic ad indicators
    'dynamic-ad', 'programmatic', 'rtb-ad', 'header-bid',
    'lazy-ad', 'async-ad', 'deferred-ad', 'viewability',
    
    // IAB Standard Ad Sizes (most common display ad dimensions)
    '300x250', '728x90', '320x50', '300x600', '160x600', '970x250',
    '320x100', '468x60', '970x90', '250x250', '200x200', '336x280',
    '120x600', '120x240', '125x125', '180x150', '300x1050', '970x66',
    '320x480', '300x50', '320x320', '250x360', '580x400', '250x300',
    '300x50', '320x250', '300x100', '336x100', '320x150', '300x300',
    
    // IAB Size Names and common ad terminology
    'leaderboard', 'rectangle', 'skyscraper', 'mobile-banner', 'medium-rectangle',
    'large-rectangle', 'half-page', 'portrait', 'square', 'button',
    'billboard', 'super-banner', 'micro-bar', 'pop-under', 'interstitial',
    
    // Site-specific patterns (often found in WordPress)
    'lngtd', 'swimmingworld', 'loading-bar', 'comment-pagination',
    'pagination', 'load-more', 'infinite-scroll', 'next-posts'
  ];
  
  // Check for ad network patterns in ID, class, or selector
  const elementText = `${id || ''} ${className || ''} ${selector || ''}`.toLowerCase();
  
  const matchedPattern = adNetworkPatterns.find(pattern => 
    elementText.includes(pattern)
  );
  
  if (matchedPattern) {
    return {
      hasPostCommentAd: true,
      adType: matchedPattern,
      confidence: 'high'
    };
  }
  
  // UNIVERSAL VISUAL AD DETECTION - Works on any website
  const contentText = (text || '').toLowerCase();
  
  // Product/Commercial content indicators (universal)
  const commercialKeywords = [
    'buy', 'sale', 'price', 'deal', 'offer', 'discount', 'shop', 'store',
    'product', 'brand', 'purchase', '$', 'usd', 'eur', 'gbp', 'free shipping',
    'limited time', 'special offer', 'best price', 'compare prices',
    'sponsored', 'advertisement', 'promoted', 'featured'
  ];
  
  const hasCommercialContent = commercialKeywords.some(keyword => 
    contentText.includes(keyword) || elementText.includes(keyword)
  );
  
  // Visual/structural ad indicators (universal)
  const visualAdIndicators = [
    // Container characteristics
    'container', 'wrapper', 'box', 'card', 'tile', 'item', 'unit',
    // Layout indicators
    'grid', 'row', 'column', 'flex', 'inline', 'block',
    // Image/media indicators  
    'image', 'img', 'photo', 'picture', 'media', 'thumb', 'thumbnail',
    // Interactive elements
    'link', 'href', 'click', 'button', 'cta', 'call-to-action'
  ];
  
  const hasVisualAdStructure = visualAdIndicators.some(indicator => 
    elementText.includes(indicator)
  );
  
  // Content length analysis (ads often have specific content patterns)
  const isAdLengthContent = (
    // Short promotional text (20-200 chars)
    (text.length >= 20 && text.length <= 200) ||
    // Very minimal content (structural ads)
    (text.length < 20 && elementText.length > 5)
  );
  
  // Enhanced structural ad indicators
  const hasAdStructure = (
    selector.includes('div') && 
    (elementText.includes('ad') || 
     elementText.includes('sponsor') || 
     elementText.includes('promo') ||
     elementText.includes('banner') ||
     // WordPress-specific structural indicators
     elementText.includes('wpd') ||
     elementText.includes('loading') ||
     elementText.includes('pagination') ||
     // Universal structural indicators
     hasVisualAdStructure ||
     hasCommercialContent)
  );
  
  // COMPREHENSIVE SCORING SYSTEM
  let confidence = 'none';
  let adType = 'unknown';
  
  if (hasCommercialContent && hasVisualAdStructure && isAdLengthContent) {
    confidence = 'very-high';
    adType = 'commercial-display-ad';
  } else if (hasCommercialContent && (hasVisualAdStructure || isAdLengthContent)) {
    confidence = 'high';  
    adType = 'commercial-content';
  } else if (hasAdStructure) {
    confidence = 'medium';
    adType = 'structural-ad';
  } else if (hasVisualAdStructure && isAdLengthContent) {
    confidence = 'medium';
    adType = 'visual-ad-structure';
  }
  
  if (confidence !== 'none') {
    return {
      hasPostCommentAd: true,
      adType,
      confidence
    };
  }
  
  // Check for minimal content with style attributes (often ads)
  const hasMinimalContentWithStyles = (
    elementText.length < 100 && 
    (elementText.includes('height') || elementText.includes('min-height') || elementText.includes('style'))
  );
  
  if (hasMinimalContentWithStyles) {
    return {
      hasPostCommentAd: true,
      adType: 'minimal-styled-content',
      confidence: 'low'
    };
  }
  
  return {
    hasPostCommentAd: false,
    adType: null,
    confidence: 'none'
  };
}

// Adaptive scoring function for infinite scroll injection points
function calculateInjectionScore(tagName, id, className, selector, text, context = '', elementPosition = 0) {
  let score = 0;
  const contextLower = context.toLowerCase();
  
  // Context-aware scoring multipliers
  const isCommentContext = contextLower.includes('comment');
  const isAfterAd = contextLower.includes('ad') || contextLower.includes('after_ad');
  const isSocialContext = contextLower.includes('social') || contextLower.includes('sharing');
  const isEndContent = contextLower.includes('end') || contextLower.includes('bottom');
  const isNewsletterContext = contextLower.includes('newsletter') || contextLower.includes('subscribe');
  const isSponsoredContext = contextLower.includes('sponsor') || contextLower.includes('before_sponsored');
  const isRelatedContentContext = contextLower.includes('related') || contextLower.includes('content_break');
  
  // Enhanced related content detection for StyleCaster-like sites
  const relatedContentPatterns = [
    'relatedcontent', 'related-content', 'related_content',
    'cardsrelatedcontent', 'cards-related-content', 'cards_related_content',
    'morearticles', 'more-articles', 'more_articles',
    'recommendedarticles', 'recommended-articles', 'recommended_articles',
    'youmaylike', 'you-may-like', 'you_may_like',
    'similar', 'trending', 'popular'
  ];
  
  // Newsletter/subscription patterns
  const newsletterPatterns = [
    'newsletter', 'subscribe', 'signup', 'email', 'daily',
    'stylecaster-daily', 'stylecaster_daily', 'newsletter-signup'
  ];
  
  // Sponsored content patterns
  const sponsoredPatterns = [
    'sponsored', 'advertisement', 'promo', 'ad-unit',
    'native-ad', 'promoted-content', 'partner-content'
  ];
  
  // Adaptive keyword scoring based on context
  const getKeywordScore = (keyword, baseScore) => {
    let multiplier = 1;
    
    // AD REVENUE PROTECTION - Special handling for ad-related keywords
    const isTaboolaOutbrainKeyword = ['taboola', 'outbrain'].includes(keyword);
    const isAdRevenueKeyword = ['ad', 'sponsor', 'promo', 'googletag', 'adsense'].includes(keyword);
    
    if (isTaboolaOutbrainKeyword) {
      // Taboola/Outbrain are approved end-of-article monetization partners
      multiplier = isAfterAd ? 3 : 2; // Strong boost, especially in ad context
    } else if (isAdRevenueKeyword && !isAfterAd) {
      // Penalty for ad-related keywords when not specifically looking for ad placement
      // This protects existing ad revenue
      multiplier = 0.1; // Heavy penalty to avoid disrupting ad revenue
    } else {
      // Enhanced context-specific multipliers
      if (isRelatedContentContext && relatedContentPatterns.some(pattern => keyword.includes(pattern))) {
        multiplier = 4; // High boost for related content in related content context
      } else if (isNewsletterContext && newsletterPatterns.some(pattern => keyword.includes(pattern))) {
        multiplier = 3.5; // High boost for newsletter elements
      } else if (isSponsoredContext && sponsoredPatterns.some(pattern => keyword.includes(pattern))) {
        multiplier = 3; // Boost for sponsored content boundaries
      } else if (isAfterAd && ['ad', 'sponsor', 'promo'].includes(keyword)) {
        multiplier = 1.5; // Reduced boost for general ad context
      } else if (isCommentContext && ['comment', 'discussion', 'community'].includes(keyword)) {
        multiplier = 2.5; // Boost for comment context
      } else if (isSocialContext && ['social', 'share', 'sharing'].includes(keyword)) {
        multiplier = 2.5; // Boost for social context
      } else if (isEndContent && ['footer', 'end', 'bottom'].includes(keyword)) {
        multiplier = 2; // Boost for end content
      }
    }
    
    return Math.round(baseScore * multiplier);
  };
  
  // Universal injection point scoring (works on any website)
  const keywords = [
    // PRIORITY 1: RELATED CONTENT (StyleCaster-specific boost)
    { patterns: relatedContentPatterns, score: 50 },
    
    // PRIORITY 2: NEWSLETTER/SUBSCRIPTION AREAS
    { patterns: newsletterPatterns, score: 45 },
    
    // PRIORITY 3: CONTENT BOUNDARIES
    { patterns: ['content-break', 'section-break', 'divider'], score: 40 },
    
    // PRIORITY 4: SPONSORED CONTENT BOUNDARIES  
    { patterns: sponsoredPatterns, score: 35 },
    
    // WordPress comment systems (high value for engagement)
    { patterns: ['wpd', 'wpdiscuz', 'wp-comment', 'disqus'], score: 30 },
    
    // Traditional comment areas
    { patterns: ['comment', 'discussion', 'community', 'feedback'], score: 25 },
    
    // Social engagement
    { patterns: ['social', 'share', 'sharing', 'follow'], score: 20 },
    
    // Content structure
    { patterns: ['article', 'post', 'content', 'main'], score: 15 },
    
    // Navigation and layout
    { patterns: ['footer', 'bottom', 'end', 'pagination'], score: 12 },
    
    // Ad placements (be careful with revenue)
    { patterns: ['taboola', 'outbrain'], score: 25 }, // High for approved partners
    { patterns: ['ad', 'advertisement', 'banner', 'sponsored'], score: 5 }, // Low for general ads
  ];

  // Check element attributes
  const elementText = `${id || ''} ${className || ''} ${selector || ''}`.toLowerCase();
  
  keywords.forEach(({ patterns, score: baseScore }) => {
    patterns.forEach(pattern => {
      if (elementText.includes(pattern)) {
        const adjustedScore = getKeywordScore(pattern, baseScore);
        score += adjustedScore;
        
        // Debug high-scoring matches
        if (adjustedScore > 20) {
          console.log(`🎯 High score match: "${pattern}" in "${elementText.substring(0, 50)}" = +${adjustedScore} points`);
        }
      }
    });
  });

  // Content quality scoring
  const textLength = text ? text.length : 0;
  
  // Ideal content length for injection points (50-300 characters)
  if (textLength >= 50 && textLength <= 300) {
    score += 15; // Sweet spot for content
  } else if (textLength > 300 && textLength <= 1000) {
    score += 10; // Good content length
  } else if (textLength > 1000) {
    score += 5; // Long content (might be main article)
  }

  // Element structure bonuses
  if (id) {
    score += 10; // IDs are more reliable selectors
    
    // Bonus for related content IDs
    if (relatedContentPatterns.some(pattern => id.toLowerCase().includes(pattern))) {
      score += 20; // Extra bonus for related content IDs
    }
  }
  
  if (className) {
    score += 5; // Classes provide targeting options
    
    // Bonus for related content classes
    if (relatedContentPatterns.some(pattern => className.toLowerCase().includes(pattern))) {
      score += 15; // Extra bonus for related content classes
    }
  }

  // Tag-specific scoring
  const tagScores = {
    'div': 8,     // Most flexible
    'section': 12, // Semantic structure
    'article': 10, // Content containers
    'aside': 8,    // Sidebar content
    'footer': 15,  // Natural content end
    'main': 10,    // Main content area
    'nav': 3,      // Navigation (lower priority)
    'header': 2,   // Header (very low priority)
    'p': 5,        // Paragraphs (moderate)
    'ul': 6,       // Lists
    'ol': 6        // Ordered lists
  };
  
  score += tagScores[tagName] || 0;

  // Position-based scoring (favor elements that appear later in content)
  if (elementPosition > 10) {
    score += Math.min(10, elementPosition / 5); // Bonus for elements later in DOM
  }

  // Penalty for very short content (likely not good injection points)
  if (textLength > 0 && textLength < 20) {
    score -= 5;
  }

  // Penalty for extremely long content (likely main article content)
  if (textLength > 2000) {
    score -= 10;
  }
  
  return Math.max(0, Math.round(score)); // Ensure non-negative
}

export default defineComponent({
  async run({ steps }) {
    // Access HTML from fetch step - check both possible locations
    const html = steps.fetch.html || steps.fetch.$return_value?.html;
    if (!html) {
      console.log('❌ HTML access failed. Available keys:', Object.keys(steps.fetch || {}));
      console.log('steps.fetch:', steps.fetch);
      console.log('steps.fetch.$return_value:', steps.fetch.$return_value);
      throw new Error("No HTML content received from fetch step");
    }

    // Get context from trigger
    const context = steps.trigger?.event?.query?.context || 
                   steps.trigger?.context?.query?.context || 
                   steps.trigger?.query?.context || 
                   '';
    console.log('🔍 Starting HTML extraction, HTML length:', html.length);
    console.log('📍 Context:', context);
    
    // Parse context for specific targeting instructions
    const contextLower = context.toLowerCase();
    const isCommentContext = contextLower.includes('comment');
    const _isNewsArticle = contextLower.includes('news') || contextLower.includes('article');
    const isAfterAd = contextLower.includes('ad') || contextLower.includes('after_ad');
    const isEndContent = contextLower.includes('end') || contextLower.includes('bottom');
    const isSocialContext = contextLower.includes('social') || contextLower.includes('sharing');
    const isNewsletterContext = contextLower.includes('newsletter') || contextLower.includes('subscribe');
    const isRelatedContentContext = contextLower.includes('related') || contextLower.includes('content_break');
    
    // Extract position hints from context (e.g., "after_paragraph_3", "middle_content", "75_percent")
    const positionMatch = contextLower.match(/(top|middle|bottom|after_paragraph_(\d+)|(\d+)_percent)/);
    const _positionHint = positionMatch ? positionMatch[0] : null;
    
    const $ = cheerio.load(html);
    
    // Debug: check basic HTML structure
    console.log('🏗️ Basic HTML structure:');
    console.log('  Total paragraphs:', $('p').length);
    console.log('  Total divs:', $('div').length);
    console.log('  Elements with "comment" in class/id:', $('[class*="comment"], [id*="comment"]').length);
    console.log('  Article elements:', $('article').length);
    
    // Find potential injection points near the end of the article
    const candidates = [];
    
    // ADAPTIVE SELECTOR STRATEGY - Build selectors based on context and page analysis
    let selectors = [];
    
    // 1. UNIVERSAL CONTENT STRUCTURE ANALYSIS - Detect site type for adaptive targeting
    // Get URL from event data since we're running on server side (no window object)
    const eventUrl = steps.trigger?.event?.query?.url || 
                    steps.trigger?.event?.url || 
                    steps.trigger?.context?.url || 
                    '';
    
    let hostname = '';
    try {
      if (eventUrl) {
        hostname = new URL(eventUrl).hostname.toLowerCase();
      }
    } catch (e) {
      console.log('⚠️ Could not parse URL:', eventUrl);
      hostname = '';
    }
    
    // Analyze HTML content for site type detection since we can't access document.body
    const htmlLower = html.toLowerCase();
    
    const siteTypes = {
      wordpress: htmlLower.includes('wp-content') || 
                htmlLower.includes('wordpress') ||
                htmlLower.includes('wp-includes'),
      news: hostname.includes('news') || 
            htmlLower.includes('article') || 
            htmlLower.includes('<article') ||
            $('article').length > 0,
      blog: hostname.includes('blog') || 
            htmlLower.includes('blog') || 
            $('.post').length > 0 ||
            $('[class*="post"]').length > 0,
      ecommerce: hostname.includes('shop') || 
                hostname.includes('store') ||
                htmlLower.includes('product') || 
                $('.product').length > 0,
      social: hostname.includes('social') || 
             hostname.includes('facebook') ||
             hostname.includes('twitter') ||
             hostname.includes('instagram')
    };
    
    console.log('🌐 Target URL:', eventUrl);
    console.log('🌐 Hostname:', hostname);
    console.log('🌐 Detected site types:', siteTypes);
    
    // UNIVERSAL SELECTORS - Work on any website structure
    const universalSelectors = [
      // PRIORITY 1: CONTENT BOUNDARIES (universal patterns)
      '[class*="related"]', '[id*="related"]',
      '[class*="recommend"]', '[id*="recommend"]', 
      '[class*="suggest"]', '[id*="suggest"]',
      '[class*="more"]', '[id*="more"]',
      '[class*="similar"]', '[id*="similar"]',
      '[class*="next"]', '[id*="next"]',
      
      // PRIORITY 2: SUBSCRIPTION/NEWSLETTER (universal)
      '[class*="newsletter"]', '[id*="newsletter"]',
      '[class*="subscribe"]', '[id*="subscribe"]',
      '[class*="signup"]', '[id*="signup"]',
      '[class*="email"]', '[id*="email"]',
      '[class*="join"]', '[id*="join"]',
      
      // PRIORITY 3: COMMENT SYSTEMS (universal)
      '[class*="comment"]', '[id*="comment"]',
      '[class*="discussion"]', '[id*="discussion"]',
      '[class*="feedback"]', '[id*="feedback"]',
      '[class*="review"]', '[id*="review"]',
      
      // WordPress specific (if detected)
      ...(siteTypes.wordpress ? [
      '[class*="wpd"]', '[id*="wpd"]',
      '[class*="wpdiscuz"]', '[id*="wpdiscuz"]',
        '.wp-comment', '.comment-form'
      ] : []),
      
      // PRIORITY 4: SOCIAL/SHARING (universal)
      '[class*="social"]', '[id*="social"]',
      '[class*="share"]', '[id*="share"]',
      '[class*="follow"]', '[id*="follow"]',
      
      // PRIORITY 5: CONTENT STRUCTURE (universal)
      'article', 'main', '.content', '.post', '.entry',
      '[class*="article"]', '[id*="article"]',
      '[class*="content"]', '[id*="content"]',
      '[class*="post"]', '[id*="post"]',
      
      // PRIORITY 6: NAVIGATION/FOOTER (universal endpoints)
      'footer', '[class*="footer"]', '[id*="footer"]',
      '[class*="bottom"]', '[id*="bottom"]',
      '[class*="end"]', '[id*="end"]',
      
      // PRIORITY 7: AD PLACEMENTS (universal - be careful with revenue)
      '[class*="ad"]', '[id*="ad"]',
      '[class*="sponsor"]', '[id*="sponsor"]',
      '[class*="promo"]', '[id*="promo"]',
      
      // Approved end-of-content monetization
      '[class*="taboola"]', '[id*="taboola"]',
      '[class*="outbrain"]', '[id*="outbrain"]',
      
      // Site-specific bonus patterns
      ...(siteTypes.news || siteTypes.blog ? [
        '[class*="author"]', '[id*="author"]',
        '[class*="byline"]', '[id*="byline"]',
        '[class*="bio"]', '[id*="bio"]'
      ] : []),
      
      ...(siteTypes.ecommerce ? [
        '[class*="product"]', '[id*="product"]',
        '[class*="reviews"]', '[id*="reviews"]',
        '[class*="rating"]', '[id*="rating"]'
      ] : []),
      
      // PRIORITY 8: GENERAL CONTAINERS (broad fallback)
      'main > div', 'article > div', '.content > div',
      'div', 'section', 'aside'
    ];
    
    // 2. CONTEXT-SPECIFIC PRIORITIZATION
    if (isAfterAd) {
      // Prioritize ad-adjacent placement
      selectors = [
        // Major ad networks & patterns
        '[class*="taboola"]', '[id*="taboola"]',
        '[class*="outbrain"]', '[id*="outbrain"]',
        '[class*="googletag"]', '[id*="googletag"]',
        '[class*="ad-"]', '[id*="ad-"]',
        '.ad-unit', '.ad-container', '.advertisement',
        ...universalSelectors
      ];
    } else if (isCommentContext) {
      // Prioritize comment areas
      selectors = [
        '#comments', '.comments', '.comment-section',
        'main [class*="comment"]', 'article [class*="comment"]',
        '.discussion', '.community',
        ...universalSelectors
      ];
    } else if (isSocialContext) {
      // Prioritize social/sharing areas
      selectors = [
        '.social-share', '.share-buttons', '.sharing',
        '[class*="social"]', '[id*="social"]',
        '[class*="share"]', '[id*="share"]',
        ...universalSelectors
      ];
    } else if (isEndContent) {
      // Prioritize content endings
      selectors = [
        'main > *:last-child', 'article > *:last-child',
        '.content > *:last-child', '.post > *:last-child',
        'footer', '.footer',
        ...universalSelectors
      ];
    } else if (isNewsletterContext) {
      // Prioritize newsletter/subscription boundaries
      selectors = [
        '[class*="newsletter"]', '[id*="newsletter"]',
        '[class*="subscribe"]', '[id*="subscribe"]',
        '[class*="signup"]', '[id*="signup"]',
        ...universalSelectors
      ];
    } else if (isRelatedContentContext) {
      // Prioritize related content areas
      selectors = [
        '[class*="related"]', '[id*="related"]',
        '[class*="recommend"]', '[id*="recommend"]',
        '[class*="suggest"]', '[id*="suggest"]',
        '[class*="more"]', '[id*="more"]',
        ...universalSelectors
      ];
    } else {
      // Default: universal balanced approach
      selectors = universalSelectors;
    }

    // Try each selector and collect elements
    selectors.forEach(selector => {
      try {
      const elements = $(selector);
        
        // Skip overly broad selectors that would return too many elements
        if (elements.length > 100) {
          console.log(`⚠️ Skipping selector "${selector}" - too many elements (${elements.length})`);
          return;
        }
        
      console.log(`Selector "${selector}" found ${elements.length} elements`);
      
      // Debug: show what we're finding
      if (elements.length > 0) {
        console.log(`  First element: ${elements.first().prop('tagName')} with text: "${elements.first().text().trim().substring(0, 50)}..."`);
      }
      
      elements.each((i, elem) => {
          // Limit processing per selector for performance
          if (i > 50) return false;
          
          try {
        const $elem = $(elem);
        const id = $elem.attr('id');
        const className = $elem.attr('class');
        const tagName = elem.tagName?.toLowerCase();
        const text = $elem.text().trim();
            
            // Calculate element position in DOM for more consistent indexing
            const globalIndex = $('*').index(elem);
            const sameTagElements = $(tagName);
            const tagSpecificIndex = sameTagElements.index(elem);
        
        // Universal scoring for infinite scroll injection points
            const injectionScore = calculateInjectionScore(tagName, id, className, selector, text, context, globalIndex);
        
        // Enhanced debugging for high-scoring elements
        if (injectionScore > 20) {
          console.log(`🎯 HIGH SCORE ELEMENT: ${tagName}#${id || 'no-id'}.${className || 'no-class'} = ${injectionScore} points`);
          console.log(`  Text snippet: "${text.substring(0, 100)}..."`);
          console.log(`  Selector: ${selector}`);
              console.log(`  DOM position: global=${globalIndex}, tag-specific=${tagSpecificIndex}`);
        }
        
        // Check if this is a WordPress Discuz element (include even with 0 text)
        const isWordPressDiscuz = (id && (id.includes('wpd') || id.includes('wpdiscuz'))) || 
                                 (className && (className.includes('wpd') || className.includes('wpdiscuz')));
        
        // Enhanced debugging for WordPress elements
        if (isWordPressDiscuz) {
          console.log(`🔍 WordPress Discuz element found: ${tagName}#${id || 'no-id'}.${className || 'no-class'} = ${injectionScore} points`);
        }
        
        // Include elements with good injection scores, reasonable text content, OR WordPress Discuz elements
        if (injectionScore > 0 || text.length > 10 || isWordPressDiscuz) {
              // Create more robust element identifier for deduplication
              const elementId = id || `${tagName}_${className}_${text.substring(0, 30).replace(/\s+/g, '_')}`;
              
          candidates.push({
            tagName,
            id: id || null,
            className: className || null,
            selector,
            textSnippet: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
            hasId: !!id,
                elementIndex: tagSpecificIndex, // Use tag-specific index for nth-of-type consistency
                globalIndex: globalIndex, // Global DOM position
            textLength: text.length,
                injectionScore,
                elementId: elementId, // For better deduplication
                rawIndex: i // Original forEach index
          });
            }
          } catch (elemError) {
            console.log(`⚠️ Error processing element in selector "${selector}":`, elemError.message);
        }
      });
      } catch (selectorError) {
        console.log(`⚠️ Error with selector "${selector}":`, selectorError.message);
      }
    });

    console.log(`Found ${candidates.length} total candidates before filtering`);

    // Enhanced deduplication - group similar elements and pick the best
    const elementGroups = new Map();
    
    candidates.forEach(candidate => {
      // Group by tag + className pattern + similar content
      const groupKey = `${candidate.tagName}_${candidate.className || 'no-class'}_${candidate.textSnippet.substring(0, 50)}`;
      
      if (!elementGroups.has(groupKey)) {
        elementGroups.set(groupKey, []);
      }
      elementGroups.get(groupKey).push(candidate);
    });

    // Pick the best candidate from each group
    const uniqueCandidates = [];
    elementGroups.forEach((group, _groupKey) => {
      // Sort group by injection score and pick the best
      group.sort((a, b) => {
        // Primary: injection score
        if (a.injectionScore !== b.injectionScore) {
          return b.injectionScore - a.injectionScore;
        }
        // Secondary: prefer elements with IDs
        if (a.hasId && !b.hasId) return -1;
        if (!a.hasId && b.hasId) return 1;
        // Tertiary: prefer later elements in DOM (better for infinite scroll)
        return b.globalIndex - a.globalIndex;
      });
      
      const bestCandidate = group[0];
      
      // Enhance the best candidate with consistent nth-of-type calculation
      if (bestCandidate.className && bestCandidate.tagName) {
        // Calculate nth-of-type more consistently
        const sameClassElements = candidates.filter(c => 
          c.tagName === bestCandidate.tagName && 
          c.className === bestCandidate.className
        ).sort((a, b) => a.globalIndex - b.globalIndex);
        
        const nthPosition = sameClassElements.findIndex(c => c.globalIndex === bestCandidate.globalIndex) + 1;
        bestCandidate.consistentNthOfType = nthPosition;
        
        console.log(`🔧 Enhanced candidate: ${bestCandidate.tagName}.${bestCandidate.className} -> nth-of-type(${nthPosition})`);
      }
      
      uniqueCandidates.push(bestCandidate);
    });

    // Sort by universal injection score (higher scores first)
    uniqueCandidates.sort((a, b) => {
      // Primary sort: injection score
      if (a.injectionScore !== b.injectionScore) {
        return b.injectionScore - a.injectionScore;
      }
      
      // Secondary sort: elements with IDs
      if (a.hasId && !b.hasId) return -1;
      if (!a.hasId && b.hasId) return 1;
      
      // Tertiary sort: prefer later DOM position for infinite scroll
      return b.globalIndex - a.globalIndex;
    });

    // Take the best candidates (limit to 10 for API efficiency)
    const bestCandidates = uniqueCandidates.slice(0, 10);
    
    console.log(`Filtered to ${bestCandidates.length} best candidates`);
    console.log('🏆 TOP 5 CANDIDATES BY SCORE:');
    bestCandidates.slice(0, 5).forEach((candidate, index) => {
      const nthInfo = candidate.consistentNthOfType ? ` nth-of-type(${candidate.consistentNthOfType})` : '';
      console.log(`${index + 1}. Score: ${candidate.injectionScore || 0} | ${candidate.tagName}#${candidate.id || 'no-id'}${nthInfo} | "${candidate.textSnippet.substring(0, 80)}..."`);
    });
    
    console.log('Sample candidates:', bestCandidates.slice(0, 3).map(c => ({
      tagName: c.tagName,
      hasId: c.hasId,
      id: c.id,
      injectionScore: c.injectionScore,
      consistentNthOfType: c.consistentNthOfType,
      textSnippet: c.textSnippet.substring(0, 50) + '...'
    })));

    // If still no good candidates, create some fallback options
    if (bestCandidates.length === 0) {
      console.log('❌ No candidates found, creating fallbacks');
      
      // Look for any div or section that might work
      $('div, section, article, footer, main').each((i, elem) => {
        if (bestCandidates.length >= 10) return false; // Stop after 10
        
        const $elem = $(elem);
        const id = $elem.attr('id');
        const className = $elem.attr('class');
        const text = $elem.text().trim();
        
        // More lenient criteria for fallback
        if (text.length > 20) {
          bestCandidates.push({
            tagName: elem.tagName?.toLowerCase(),
            id: id || null,
            className: className || null,
            selector: 'fallback',
            textSnippet: text.substring(0, 150) + '...',
            hasId: !!id,
            elementIndex: i,
            textLength: text.length
          });
        }
      });
      
      // If still nothing, create a basic fallback
      if (bestCandidates.length === 0) {
        console.log('❌ Still no candidates, creating basic fallback');
        bestCandidates.push({
          tagName: 'body',
          id: null,
          className: null,
          selector: 'absolute-fallback',
          textSnippet: 'Fallback injection point at end of body',
          hasId: false,
          elementIndex: 0,
          textLength: 0
        });
      }
    }

    return {
      candidates: bestCandidates,
      candidateCount: bestCandidates.length,
      htmlLength: html.length,
      totalElementsFound: candidates.length,
      rawStep: steps.fetch,
      fetchKeys: Object.keys(steps.fetch || {}),
      fullReturnValue: steps.fetch?.$return_value || "(no $return_value)",
    };
  }
}); 