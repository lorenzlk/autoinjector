// Note: axios import removed as it's not used in current implementation

export default defineComponent({
  async run({ steps }) {
    // Try multiple ways to access candidates from extract step
    let candidates = steps.extract?.candidates || 
                     steps.extract?.$return_value?.candidates ||
                     null;
    
    // If candidates is not an array, check if the whole extract result is the candidates array
    if (!Array.isArray(candidates)) {
      if (Array.isArray(steps.extract?.$return_value)) {
        candidates = steps.extract.$return_value;
      } else if (Array.isArray(steps.extract)) {
        candidates = steps.extract;
      }
    }
    
    console.log('🤖 Generating snippet with', candidates?.length || 0, 'candidates');
    console.log('🔍 Debug - steps.extract keys:', Object.keys(steps.extract || {}));
    console.log('🔍 Debug - candidates type:', typeof candidates, Array.isArray(candidates));
    
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      console.log('❌ No candidates available for snippet generation');
      console.log('🔍 Available extract data:', JSON.stringify(steps.extract, null, 2));
      return {
        snippet: "// Error: No suitable DOM elements found for injection",
        error: "No candidates provided"
      };
    }

    console.log('📋 Candidates preview:', candidates.slice(0, 3).map(c => ({
      tagName: c.tagName,
      id: c.id,
      className: c.className,
      hasId: c.hasId,
      consistentNthOfType: c.consistentNthOfType,
      injectionScore: c.injectionScore
    })));

    // Skip AI entirely - generate hardcoded green test block
    const topCandidate = candidates[0]; // Highest scoring element
    console.log('🎯 Using top candidate:', topCandidate);
    
    // Determine selector based on candidate
    let selector;
    if (topCandidate.id) {
      selector = `#${topCandidate.id}`;
    } else if (topCandidate.className) {
      // Use the most stable class
      const classNames = topCandidate.className.split(' ');
      const stableClass = classNames.find(cls => 
        cls.includes('wpdiscuz') || 
        cls.includes('subscribe') || 
        cls.includes('comment') ||
        cls.includes('related') ||
        cls.includes('newsletter')
      ) || classNames[0];
      
      // Use wildcard for dynamic classes, exact for stable ones
      if (stableClass.includes('_') && stableClass.length > 10) {
        const baseClass = stableClass.split('_')[1] || stableClass.split('_')[0];
        selector = `${topCandidate.tagName}[class*="${baseClass}"]`;
      } else {
        selector = `.${stableClass}`;
      }
    } else {
      selector = topCandidate.tagName;
    }
    
    // Check if it's Taboola/Outbrain (inject before instead of after)
    const isTaboolaOutbrain = (topCandidate.id && (topCandidate.id.toLowerCase().includes('taboola') || topCandidate.id.toLowerCase().includes('outbrain'))) ||
                             (topCandidate.className && (topCandidate.className.toLowerCase().includes('taboola') || topCandidate.className.toLowerCase().includes('outbrain')));
    
    const insertionPoint = isTaboolaOutbrain ? 'targetElement' : 'targetElement.nextSibling';
    
    // Generate modern, production-ready injection snippet
    const modernSnippet = `// AutoInjector - Modern Infinite Scroll Injection
(function() {
  'use strict';
  
  // Create the infinite scroll container
  const smartscrollDiv = document.createElement('div');
  smartscrollDiv.id = 'smartscroll-unit';
  smartscrollDiv.className = 'autoinjector-container';
  
  // Add modern styling for seamless integration
  smartscrollDiv.style.cssText = \`
    width: 100%;
    margin: 20px 0;
    padding: 0;
    background: transparent;
    border: none;
    display: block;
    position: relative;
    z-index: 1;
    min-height: 1px;
  \`;
  
  // Find target element using the best available selector
  const targetElement = ${topCandidate.id ? 
    `document.getElementById('${topCandidate.id}')` : 
    `document.querySelector('${selector}')`};
  
  if (targetElement) {
    // Insert ${insertionPoint === 'targetElement' ? 'before' : 'after'} the target element
    targetElement.parentNode.insertBefore(smartscrollDiv, ${insertionPoint});
    
    console.log('✅ AutoInjector: Infinite scroll container injected successfully');
    console.log('📍 Location: ${insertionPoint === 'targetElement' ? 'Before' : 'After'} ${selector}');
    
    // Optional: Add intersection observer for loading trigger
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger infinite scroll loading here
            console.log('🔄 AutoInjector: Infinite scroll trigger point reached');
            // Your infinite scroll logic would go here
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(smartscrollDiv);
    }
    
  } else {
    console.warn('⚠️ AutoInjector: Target element not found for selector: ${selector}');
    
    // Fallback: Try alternative selectors
    const fallbackSelectors = [
      '[class*="newsletter"]',
      '[id*="newsletter"]', 
      '[class*="subscribe"]',
      'article',
      'main',
      '.content'
    ];
    
    let fallbackTarget = null;
    for (const fallbackSelector of fallbackSelectors) {
      fallbackTarget = document.querySelector(fallbackSelector);
      if (fallbackTarget) {
        console.log('✅ AutoInjector: Using fallback selector:', fallbackSelector);
        fallbackTarget.parentNode.insertBefore(smartscrollDiv, fallbackTarget.nextSibling);
        break;
      }
    }
    
    if (!fallbackTarget) {
      console.warn('⚠️ AutoInjector: No suitable injection point found, appending to body');
      document.body.appendChild(smartscrollDiv);
    }
  }
  
  // Return reference for external access
  window.autoinjectorContainer = smartscrollDiv;
  
})();`;

    console.log('✅ Generated modern injection snippet for selector:', selector);
    console.log('🎯 Injection point:', insertionPoint === 'targetElement' ? 'BEFORE target' : 'AFTER target');
    
    return {
      snippet: modernSnippet,
      candidatesUsed: candidates.length,
      model: "modern-autoinjector-v2",
      selector: selector,
      insertionPoint: insertionPoint === 'targetElement' ? 'before' : 'after',
      targetId: topCandidate.id,
      targetClass: topCandidate.className
    };
  }
}); 