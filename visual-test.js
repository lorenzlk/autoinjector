// 🌐 UNIVERSAL AUTOINJECTOR VISUAL TEST SCRIPT 🌐
// Copy and paste this into the browser console on ANY website to see where injection would happen
// Creates a BRIGHT, OBVIOUS visual indicator showing the exact injection point

console.log('🧪 UNIVERSAL AUTOINJECTOR VISUAL TEST - Starting injection point detection...');

// Create a VERY visible test element that you CAN'T MISS
function createVisualTestElement() {
  const testDiv = document.createElement('div');
  testDiv.id = 'autoinjector-visual-test';
  testDiv.style.cssText = `
    background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff);
    background-size: 400% 400%;
    border: 8px solid #000;
    padding: 30px;
    margin: 30px 0;
    text-align: center;
    font-family: 'Arial Black', Arial, sans-serif;
    font-size: 28px;
    font-weight: 900;
    color: #000;
    text-shadow: 3px 3px 6px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
    position: relative;
    z-index: 999999;
    box-shadow: 0 0 30px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;
  
  testDiv.innerHTML = `
    🎯 AUTOINJECTOR INJECTION POINT 🎯<br>
    <div style="font-size: 18px; margin-top: 15px; line-height: 1.4;">
      ✅ INFINITE SCROLL UNIT WOULD APPEAR HERE<br>
      <div style="font-size: 14px; margin-top: 10px; background: rgba(0,0,0,0.8); color: #fff; padding: 10px; border-radius: 5px;">
        🔍 Target: <span id="target-info">Scanning...</span><br>
        📍 Position: <span id="position-info">Calculating...</span><br>
        📊 Score: <span id="score-info">Evaluating...</span><br>
        🌐 Site: <span id="site-info">${window.location.hostname}</span>
      </div>
    </div>
  `;
  
  // Add the rainbow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes pulse {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.05) rotate(1deg); }
      50% { transform: scale(1.1) rotate(0deg); }
      75% { transform: scale(1.05) rotate(-1deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 30px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 255, 255, 0.3); }
      50% { box-shadow: 0 0 50px rgba(255, 0, 0, 1), inset 0 0 50px rgba(255, 255, 255, 0.5); }
      100% { box-shadow: 0 0 30px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 255, 255, 0.3); }
    }
    #autoinjector-visual-test {
      animation: rainbow 3s ease infinite, pulse 2s ease-in-out infinite, glow 1.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  
  return testDiv;
}

// Detect site type for adaptive targeting
function detectSiteType() {
  const hostname = window.location.hostname.toLowerCase();
  const bodyClasses = document.body.className.toLowerCase();
  const hasWordPress = document.querySelector('meta[name="generator"][content*="WordPress"]') || 
                      document.querySelector('script[src*="wp-content"]') ||
                      bodyClasses.includes('wordpress');
  
  const siteTypes = {
    wordpress: hasWordPress,
    news: hostname.includes('news') || bodyClasses.includes('news') || document.querySelector('article'),
    blog: hostname.includes('blog') || bodyClasses.includes('blog') || document.querySelector('.post'),
    ecommerce: hostname.includes('shop') || bodyClasses.includes('shop') || document.querySelector('.product'),
    social: hostname.includes('social') || bodyClasses.includes('social'),
    corporate: document.querySelector('.corporate') || document.querySelector('nav.navbar')
  };
  
  console.log('🌐 Site type detection:', siteTypes);
  return siteTypes;
}

// Universal injection point detection that works on ANY website
function testInjectAtOptimalLocation() {
  console.log('🔍 Scanning ANY website for optimal injection points using universal AutoInjector logic...');
  
  const siteTypes = detectSiteType();
  
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
    
    // PRIORITY 8: GENERAL CONTAINERS (broad fallback)
    'div', 'section', 'aside'
  ];
  
  let bestTarget = null;
  let bestScore = 0;
  let bestTargetInfo = '';
  let allCandidates = [];
  
  // Add site-specific bonus patterns
  const getSiteSpecificBonus = (className, id) => {
    let bonus = 0;
    const text = `${className || ''} ${id || ''}`.toLowerCase();
    
    // Site-specific patterns
    if (siteTypes.news || siteTypes.blog) {
      if (text.includes('article-end') || text.includes('post-end')) bonus += 20;
      if (text.includes('author-bio') || text.includes('byline')) bonus += 15;
    }
    
    if (siteTypes.ecommerce) {
      if (text.includes('product-details') || text.includes('product-info')) bonus += 15;
      if (text.includes('reviews') || text.includes('rating')) bonus += 10;
    }
    
    if (siteTypes.wordpress) {
      if (text.includes('wp-') || text.includes('wordpress')) bonus += 10;
    }
    
    return bonus;
  };
  
  universalSelectors.forEach((selector, selectorIndex) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 50) return; // Skip overly broad selectors
      
      console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
      
      elements.forEach((element, elementIndex) => {
        if (elementIndex > 20) return; // Limit per selector for performance
        
        const id = element.id;
        const className = element.className;
        const text = element.textContent?.trim() || '';
        const tagName = element.tagName?.toLowerCase();
        
        // UNIVERSAL SCORING SYSTEM - Works on any website
        let score = 0;
        
        // PRIORITY 1: Content relationship patterns (universal)
        if (className && className.toLowerCase().includes('related')) score += 50;
        if (className && className.toLowerCase().includes('recommend')) score += 45;
        if (className && className.toLowerCase().includes('suggest')) score += 40;
        if (className && className.toLowerCase().includes('more')) score += 35;
        if (className && className.toLowerCase().includes('similar')) score += 35;
        
        // PRIORITY 2: Newsletter/subscription (universal)
        if (className && className.toLowerCase().includes('newsletter')) score += 45;
        if (className && className.toLowerCase().includes('subscribe')) score += 40;
        if (className && className.toLowerCase().includes('signup')) score += 35;
        if (className && className.toLowerCase().includes('email')) score += 30;
        
        // PRIORITY 3: Comment systems (universal)
        if (className && className.toLowerCase().includes('comment')) score += 30;
        if (className && className.toLowerCase().includes('discussion')) score += 25;
        if (className && className.toLowerCase().includes('feedback')) score += 20;
        
        // PRIORITY 4: Social engagement (universal)
        if (className && className.toLowerCase().includes('social')) score += 25;
        if (className && className.toLowerCase().includes('share')) score += 20;
        if (className && className.toLowerCase().includes('follow')) score += 15;
        
        // PRIORITY 5: Content structure (universal)
        if (className && className.toLowerCase().includes('content')) score += 15;
        if (className && className.toLowerCase().includes('article')) score += 15;
        if (className && className.toLowerCase().includes('post')) score += 15;
        
        // Element structure bonuses (universal)
        if (id) {
          score += 10; // IDs are reliable
          if (id.toLowerCase().includes('related') || id.toLowerCase().includes('recommend')) score += 20;
        }
        if (className) score += 5; // Classes provide targeting
        
        // Tag-specific scoring (universal)
        const tagScores = {
          'article': 15, 'main': 12, 'section': 10, 'div': 8,
          'aside': 8, 'footer': 20, 'nav': 3, 'header': 2,
          'p': 5, 'ul': 6, 'ol': 6
        };
        score += tagScores[tagName] || 0;
        
        // Content quality scoring (universal)
        const textLength = text.length;
        if (textLength >= 50 && textLength <= 300) score += 15; // Sweet spot
        else if (textLength > 300 && textLength <= 1000) score += 10; // Good length
        else if (textLength > 1000) score += 5; // Long content
        else if (textLength < 10) score -= 5; // Too short
        
        // Position bonus (later elements preferred for infinite scroll)
        score += Math.min(10, elementIndex * 2);
        
        // Selector priority bonus (earlier selectors are higher priority)
        score += Math.max(0, 15 - selectorIndex);
        
        // Site-specific bonuses
        score += getSiteSpecificBonus(className, id);
        
        // Viewport position bonus (elements lower on page preferred)
        try {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          if (rect.top > viewportHeight) score += 10; // Below fold
        } catch (e) {
          // Ignore positioning errors
        }
        
        // Penalty for navigation/header elements
        if (className && (className.toLowerCase().includes('nav') || className.toLowerCase().includes('header'))) {
          score -= 20;
        }
        
        // Penalty for sidebar elements
        if (className && className.toLowerCase().includes('sidebar')) {
          score -= 15;
        }
        
        console.log(`📊 Element: ${tagName}#${id || 'no-id'} | Score: ${score} | "${text.substring(0, 40)}..."`);
        
        allCandidates.push({
          element,
          score,
          id,
          className,
          tagName,
          text: text.substring(0, 100),
          selector,
          textLength
        });
        
        if (score > bestScore) {
          bestScore = score;
          bestTarget = element;
          bestTargetInfo = `${tagName}#${id || 'no-id'}.${className ? className.substring(0, 50) + '...' : 'no-class'}`;
        }
      });
    } catch (e) {
      console.log(`⚠️ Selector "${selector}" failed:`, e.message);
    }
  });
  
  // Sort all candidates by score for debugging
  allCandidates.sort((a, b) => b.score - a.score);
  console.log('🏆 TOP 10 UNIVERSAL CANDIDATES:');
  allCandidates.slice(0, 10).forEach((candidate, index) => {
    console.log(`${index + 1}. Score: ${candidate.score} | ${candidate.tagName}#${candidate.id || 'no-id'} | "${candidate.text}..."`);
  });
  
  if (bestTarget && bestScore > 10) { // Lower threshold for universal detection
    console.log(`🎯 BEST UNIVERSAL TARGET FOUND: ${bestTargetInfo} (Score: ${bestScore})`);
    
    // Create the visual test element
    const testElement = createVisualTestElement();
    
    // Update the target info in the test element
    setTimeout(() => {
      const targetInfoSpan = document.getElementById('target-info');
      const positionInfoSpan = document.getElementById('position-info');
      const scoreInfoSpan = document.getElementById('score-info');
      
      if (targetInfoSpan) {
        targetInfoSpan.textContent = bestTargetInfo;
      }
      
      if (positionInfoSpan) {
        const rect = bestTarget.getBoundingClientRect();
        positionInfoSpan.textContent = `After element at Y: ${Math.round(rect.bottom)}px`;
      }
      
      if (scoreInfoSpan) {
        scoreInfoSpan.textContent = `${bestScore} points (${allCandidates.length} candidates evaluated)`;
      }
    }, 200);
    
    // Insert AFTER the target element (same as real infinite scroll logic)
    try {
      // Check if this is a Taboola/Outbrain element (inject before, not after)
      const isTaboolaOutbrain = (bestTarget.id && (bestTarget.id.toLowerCase().includes('taboola') || bestTarget.id.toLowerCase().includes('outbrain'))) ||
                               (bestTarget.className && (bestTarget.className.toLowerCase().includes('taboola') || bestTarget.className.toLowerCase().includes('outbrain')));
      
      if (isTaboolaOutbrain) {
        bestTarget.parentNode.insertBefore(testElement, bestTarget);
        console.log('✅ INSERTED BEFORE Taboola/Outbrain element');
      } else {
        bestTarget.parentNode.insertBefore(testElement, bestTarget.nextSibling);
        console.log('✅ INSERTED AFTER target element');
      }
      
      console.log('✅ VISUAL TEST ELEMENT INSERTED SUCCESSFULLY!');
      
      // Scroll to the test element for maximum visibility
      setTimeout(() => {
        testElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        console.log('📍 Scrolled to injection point - you should see the bright rainbow element!');
        
        // Also highlight the target element briefly
        const originalBorder = bestTarget.style.border;
        const originalBackground = bestTarget.style.backgroundColor;
        bestTarget.style.border = '5px dashed #ff0000';
        bestTarget.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        
        setTimeout(() => {
          bestTarget.style.border = originalBorder;
          bestTarget.style.backgroundColor = originalBackground;
        }, 3000);
        
      }, 1000);
      
      return {
        success: true,
        targetElement: bestTarget,
        targetInfo: bestTargetInfo,
        injectionScore: bestScore,
        totalCandidates: allCandidates.length,
        siteTypes: siteTypes
      };
      
    } catch (error) {
      console.error('❌ Failed to insert test element:', error);
      
      // Fallback: append to body
      document.body.appendChild(testElement);
      console.log('⚠️ Fallback: Added test element to end of body');
      
      setTimeout(() => {
        testElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
      
      return {
        success: false,
        error: error.message,
        fallback: true,
        siteTypes: siteTypes
      };
    }
  } else {
    console.log('❌ No suitable universal target found for injection');
    
    // Create a "no target found" test element
    const testElement = createVisualTestElement();
    testElement.innerHTML = `
      ⚠️ NO OPTIMAL INJECTION POINT FOUND ⚠️<br>
      <div style="font-size: 16px; margin-top: 10px;">
        📍 Using fallback: End of page<br>
        🔍 Try adding context parameters to AutoInjector URL<br>
        📊 Evaluated ${allCandidates.length} potential targets<br>
        🌐 Site: ${window.location.hostname}
      </div>
    `;
    
    document.body.appendChild(testElement);
    
    setTimeout(() => {
      testElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 500);
    
    return {
      success: false,
      message: 'No optimal injection point found',
      fallback: true,
      totalCandidates: allCandidates.length,
      siteTypes: siteTypes
    };
  }
}

// 🚀 RUN THE UNIVERSAL VISUAL TEST
console.log('🚀 Starting UNIVERSAL AutoInjector Visual Test...');
const result = testInjectAtOptimalLocation();

// Log final results
console.log('📋 FINAL UNIVERSAL TEST RESULTS:', result);

// Cleanup function
window.removeAutoInjectorTest = function() {
  const testElement = document.getElementById('autoinjector-visual-test');
  if (testElement) {
    testElement.remove();
    console.log('🧹 Visual test element removed');
  } else {
    console.log('❌ No test element found to remove');
  }
};

console.log('💡 To remove the test element, run: removeAutoInjectorTest()');
console.log('🎯 Look for the bright RAINBOW element - that\'s where infinite scroll would be injected!');
console.log('🌐 This script works on ANY website - try it anywhere!'); 