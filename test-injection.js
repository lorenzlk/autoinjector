// SmartScroll Injection Tester - Updated for Comment Section
// Paste this into browser console to test the comment section injection

function testCommentSectionInjection() {
  console.log('🧪 Testing Comment Section SmartScroll Injection...');
  
  // Test the actual injection point from your workflow
  const smartscrollDiv = document.createElement('div');
  smartscrollDiv.id = 'smartscroll-unit-test';
  
  // Make it SUPER visible
  smartscrollDiv.style.cssText = `
    background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff) !important;
    height: 100px !important;
    border: 5px solid #ffffff !important;
    border-radius: 15px !important;
    margin: 30px 0 !important;
    text-align: center !important;
    line-height: 100px !important;
    color: white !important;
    font-weight: bold !important;
    font-family: Arial, sans-serif !important;
    font-size: 20px !important;
    box-shadow: 0 8px 16px rgba(0,0,0,0.5) !important;
    animation: pulse 1s infinite !important;
    position: relative !important;
    z-index: 9999 !important;
    opacity: 1 !important;
    display: block !important;
    width: 95% !important;
  `;
  
  smartscrollDiv.innerHTML = `
    <div style="color: white; font-size: 18px; font-weight: bold;">
      🎯 SMARTSCROLL INJECTION POINT<br>
      <span style="font-size: 14px;">Found: recent-comments-2</span>
    </div>
  `;
  
  // Add pulsing animation
  if (!document.getElementById('smartscroll-pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'smartscroll-pulse-styles';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Target the actual element from your workflow
  const targetElement = document.getElementById('recent-comments-2');
  
  if (targetElement) {
    console.log('✅ Found target element:', targetElement);
    console.log('Element position:', targetElement.getBoundingClientRect());
    
    // Remove any existing test injection
    const existing = document.getElementById('smartscroll-unit-test');
    if (existing) existing.remove();
    
    // Inject after the target
    targetElement.parentNode.insertBefore(smartscrollDiv, targetElement.nextSibling);
    
    console.log('✅ SmartScroll injected successfully!');
    
    // Scroll to make it visible
    setTimeout(() => {
      smartscrollDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }, 500);
    
    // Log surrounding elements for debugging
    console.log('Previous sibling:', targetElement.previousElementSibling);
    console.log('Next sibling:', targetElement.nextElementSibling);
    console.log('Parent element:', targetElement.parentElement);
    
  } else {
    console.log('❌ Target element "recent-comments-2" not found');
    console.log('Available elements with "comment" in ID:');
    document.querySelectorAll('[id*="comment"]').forEach(el => {
      console.log(`  - ${el.id}:`, el);
    });
    
    console.log('Available elements with "comment" in class:');
    document.querySelectorAll('[class*="comment"]').forEach(el => {
      console.log(`  - ${el.className}:`, el);
    });
  }
}

// AD REVENUE PROTECTION TEST
function testAdRevenueProtection() {
  console.log('🛡️ Testing Ad Revenue Protection...');
  
     // Simulate the scoring logic from extract.js
   function calculateTestScore(element) {
     let score = 0;
     const id = element.id ? element.id.toLowerCase() : '';
     const className = element.className ? String(element.className).toLowerCase() : '';
    
    // Check if it's Taboola/Outbrain (approved partners)
    const isTaboolaOutbrain = id.includes('taboola') || id.includes('outbrain') ||
                             className.includes('taboola') || className.includes('outbrain');
    
         if (isTaboolaOutbrain) {
       score += 15; // Boost for approved monetization partners (inject ABOVE them)
       console.log(`✅ Approved partner (${id || className}): +15 points (inject ABOVE)`);
          } else {
       // Check for POST-COMMENT DISPLAY ADS (place SmartScroll AFTER these)
       const postCommentAdKeywords = [
         'banner', 'display-ad', 'ad-unit', 'ad-container', 'ad-wrapper',
         'ad-slot', 'rectangle', 'leaderboard', 'medium-rectangle',
         '300x250', '728x90', '320x50', '300x600', '160x600'
       ];
       const isPostCommentAd = postCommentAdKeywords.some(keyword => 
         id.includes(keyword) || className.includes(keyword)
       );
       
       if (isPostCommentAd) {
         score += 25; // HIGH priority - place SmartScroll AFTER these display ads
         console.log(`🎯 Post-comment display ad (${id || className}): +25 points (inject AFTER)`);
       } else {
         // Check for other ad revenue keywords (protect these)
         const adKeywords = ['ad', 'ads', 'advertisement', 'sponsored', 'sponsor', 
                            'googletag', 'adsense', 'doubleclick'];
         
         const hasAdKeyword = adKeywords.some(keyword => 
           id.includes(keyword) || className.includes(keyword)
         );
         
         if (hasAdKeyword) {
           score -= 25; // MAJOR penalty to protect ad revenue
           console.log(`❌ Ad revenue element (${id || className}): -25 points`);
         }
       }
     }
    
    // Check for comment indicators (highest priority)
    const commentKeywords = ['comment', 'discussion', 'community'];
    const hasCommentKeyword = commentKeywords.some(keyword => 
      id.includes(keyword) || className.includes(keyword)
    );
    
    if (hasCommentKeyword) {
      score += 30; // Universal comment priority
      console.log(`💬 Comment section (${id || className}): +30 points`);
    }
    
    return score;
  }
  
     // Test various elements on the page
   const testElements = [
     ...document.querySelectorAll('[id*="ad"], [class*="ad"]'),
     ...document.querySelectorAll('[id*="comment"], [class*="comment"]'),
     ...document.querySelectorAll('[id*="taboola"], [class*="taboola"]'),
     ...document.querySelectorAll('[id*="outbrain"], [class*="outbrain"]'),
     ...document.querySelectorAll('[id*="sponsor"], [class*="sponsor"]'),
     ...document.querySelectorAll('[id*="googletag"], [class*="googletag"]'),
     ...document.querySelectorAll('[id*="banner"], [class*="banner"]'),
     ...document.querySelectorAll('[id*="rectangle"], [class*="rectangle"]'),
     ...document.querySelectorAll('[id*="leaderboard"], [class*="leaderboard"]'),
     ...document.querySelectorAll('[id*="300x250"], [class*="300x250"]'),
     ...document.querySelectorAll('[id*="728x90"], [class*="728x90"]')
   ];
  
  console.log(`\n📊 Scoring ${testElements.length} elements:`);
  
  const scores = testElements.map(el => ({
    element: el,
    id: el.id || 'no-id',
    className: el.className || 'no-class',
    score: calculateTestScore(el),
    tagName: el.tagName.toLowerCase()
  }));
  
  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);
  
  console.log('\n🏆 Top scoring elements:');
  scores.slice(0, 10).forEach((item, index) => {
    const status = item.score > 0 ? '✅' : item.score < 0 ? '❌' : '⚪';
    console.log(`${index + 1}. ${status} Score: ${item.score} | ${item.tagName}#${item.id}.${item.className}`);
  });
  
  // Check for ad revenue protection
  const adElements = scores.filter(item => 
    item.score < 0 && (
      item.id.includes('ad') || item.className.includes('ad') ||
      item.id.includes('sponsor') || item.className.includes('sponsor')
    )
  );
  
     const taboolaOutbrainElements = scores.filter(item => 
     item.score > 0 && (
       item.id.includes('taboola') || item.className.includes('taboola') ||
       item.id.includes('outbrain') || item.className.includes('outbrain')
     )
   );
   
   const postCommentAdElements = scores.filter(item => 
     item.score > 0 && (
       item.id.includes('kargo') || item.className.includes('kargo') ||
       item.id.includes('banner') || item.className.includes('banner') ||
       item.id.includes('display-ad') || item.className.includes('display-ad') ||
       item.id.includes('ad-unit') || item.className.includes('ad-unit')
     )
   );
   
   console.log(`\n🛡️ Ad Revenue Protection Results:`);
   console.log(`  • Protected ad elements: ${adElements.length}`);
   console.log(`  • Post-comment display ads: ${postCommentAdElements.length}`);
   console.log(`  • Approved Taboola/Outbrain: ${taboolaOutbrainElements.length}`);
  
  if (adElements.length > 0) {
    console.log(`\n❌ Elements being protected from injection:`);
    adElements.forEach(item => {
      console.log(`  - ${item.tagName}#${item.id} (score: ${item.score})`);
    });
  }
  
     if (taboolaOutbrainElements.length > 0) {
     console.log(`\n✅ Approved monetization partners (SmartScroll will be placed ABOVE these):`);
     taboolaOutbrainElements.forEach(item => {
       console.log(`  - ${item.tagName}#${item.id} (score: ${item.score}) → Place SmartScroll BEFORE this element`);
     });
   }
  
  return {
    totalElements: testElements.length,
    protectedAds: adElements.length,
    approvedPartners: taboolaOutbrainElements.length,
    topChoice: scores[0]
  };
}

// Run the test
testCommentSectionInjection();

// Also run ad revenue protection test
console.log('\n' + '='.repeat(50));
testAdRevenueProtection();

// VISUAL TEST SCRIPT - Shows exactly where AutoInjector places infinite scroll units
// This creates a bright, obvious visual indicator for testing purposes

console.log('🧪 AUTOINJECTOR VISUAL TEST - Starting injection point detection...');

// Create a VERY visible test element
function createVisualTestElement() {
  const testDiv = document.createElement('div');
  testDiv.id = 'autoinjector-visual-test';
  testDiv.style.cssText = `
    background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff);
    background-size: 400% 400%;
    animation: rainbow 2s ease infinite;
    border: 5px solid #000;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #000;
    text-shadow: 2px 2px 4px #fff;
    position: relative;
    z-index: 9999;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
    border-radius: 10px;
  `;
  
  testDiv.innerHTML = `
    🎯 AUTOINJECTOR TEST INJECTION POINT 🎯<br>
    <div style="font-size: 16px; margin-top: 10px;">
      ✅ INFINITE SCROLL UNIT WOULD BE INSERTED HERE<br>
      🔍 Target Element: <span id="target-info">Calculating...</span><br>
      📍 Position: <span id="position-info">Detecting...</span>
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
    #autoinjector-visual-test {
      animation: rainbow 2s ease infinite, pulse 1s ease-in-out infinite alternate;
    }
    @keyframes pulse {
      from { transform: scale(1); }
      to { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
  
  return testDiv;
}

// Test injection using the same logic as the actual AutoInjector
function testInjectAtOptimalLocation() {
  console.log('🔍 Scanning page for optimal injection points...');
  
  // ENHANCED STYLECASTER TARGETING - Same logic as improved extract.js
  const relatedContentSelectors = [
    // StyleCaster specific patterns
    '[class*="_cardsRelatedContent_"]',
    '[class*="cardsRelatedContent"]',
    '[class*="related-content"]',
    '[class*="related_content"]',
    '[id*="related"]',
    
    // Newsletter/subscription areas  
    '[class*="newsletter"]',
    '[class*="subscribe"]',
    '[class*="signup"]',
    '[class*="daily"]',
    
    // Content boundaries
    '[class*="content-break"]',
    '[class*="section-break"]',
    
    // Sponsored content boundaries
    '[class*="sponsored"]',
    '[class*="advertisement"]',
    
    // General content structure
    'main > div',
    'article > div',
    '.content > div'
  ];
  
  let bestTarget = null;
  let bestScore = 0;
  let targetInfo = '';
  
  relatedContentSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
    
    elements.forEach((element, index) => {
      const id = element.id;
      const className = element.className;
      const text = element.textContent.trim();
      
      // Simple scoring based on our enhanced logic
      let score = 0;
      
      // High priority for related content
      if (className.toLowerCase().includes('related')) score += 50;
      if (className.toLowerCase().includes('cards')) score += 40;
      if (className.toLowerCase().includes('content')) score += 30;
      
      // Newsletter boundaries
      if (className.toLowerCase().includes('newsletter')) score += 45;
      if (className.toLowerCase().includes('subscribe')) score += 40;
      
      // Content quality
      if (text.length > 50 && text.length < 300) score += 15;
      if (id) score += 10;
      if (className) score += 5;
      
      // Position bonus (later elements preferred for infinite scroll)
      score += Math.min(10, index);
      
      console.log(`📊 Element score: ${score} | ${element.tagName}#${id || 'no-id'} | "${text.substring(0, 50)}..."`);
      
      if (score > bestScore) {
        bestScore = score;
        bestTarget = element;
        targetInfo = `${element.tagName}#${id || 'no-id'}.${className || 'no-class'} (Score: ${score})`;
      }
    });
  });
  
  if (bestTarget) {
    console.log('🎯 BEST TARGET FOUND:', targetInfo);
    
    // Create the visual test element
    const testElement = createVisualTestElement();
    
    // Update the target info in the test element
    setTimeout(() => {
      const targetInfoSpan = document.getElementById('target-info');
      const positionInfoSpan = document.getElementById('position-info');
      
      if (targetInfoSpan) {
        targetInfoSpan.textContent = targetInfo;
      }
      
      if (positionInfoSpan) {
        const rect = bestTarget.getBoundingClientRect();
        positionInfoSpan.textContent = `After element at Y: ${Math.round(rect.bottom)}px`;
      }
    }, 100);
    
    // Insert AFTER the target element (same as infinite scroll logic)
    try {
      bestTarget.parentNode.insertBefore(testElement, bestTarget.nextSibling);
      console.log('✅ TEST ELEMENT INSERTED SUCCESSFULLY!');
      
      // Scroll to the test element after a short delay
      setTimeout(() => {
        testElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        console.log('📍 Scrolled to injection point for visibility');
      }, 500);
      
      return {
        success: true,
        targetElement: bestTarget,
        targetInfo: targetInfo,
        injectionScore: bestScore
      };
      
    } catch (error) {
      console.error('❌ Failed to insert test element:', error);
      
      // Fallback: append to body
      document.body.appendChild(testElement);
      console.log('⚠️ Fallback: Added test element to end of body');
      
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  } else {
    console.log('❌ No suitable target found for injection');
    
    // Create a fallback test element
    const testElement = createVisualTestElement();
    testElement.innerHTML = `
      ⚠️ NO OPTIMAL INJECTION POINT FOUND ⚠️<br>
      <div style="font-size: 16px; margin-top: 10px;">
        📍 Fallback: Added to end of page<br>
        🔍 Consider adding context parameter to URL
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
      fallback: true
    };
  }
}

// Run the test
console.log('🚀 Starting AutoInjector Visual Test...');
const result = testInjectAtOptimalLocation();

// Log results
console.log('📋 TEST RESULTS:', result);

// Add a removal function for cleanup
window.removeAutoInjectorTest = function() {
  const testElement = document.getElementById('autoinjector-visual-test');
  if (testElement) {
    testElement.remove();
    console.log('🧹 Test element removed');
  }
};

console.log('💡 To remove the test element, run: removeAutoInjectorTest()'); 