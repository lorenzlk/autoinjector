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
    
    // Generate hardcoded green test block
    const greenTestSnippet = `// AutoInjector Green Test Block
var testDiv = document.createElement('div');
testDiv.id = 'autoinjector-green-test';
testDiv.style.cssText = \`
  background: linear-gradient(45deg, #00ff00, #32cd32, #00ff7f, #7fff00) !important;
  background-size: 400% 400% !important;
  animation: greenPulse 2s ease infinite !important;
  padding: 40px !important;
  margin: 30px auto !important;
  border: 10px solid #006400 !important;
  border-radius: 20px !important;
  color: white !important;
  font-size: 28px !important;
  font-weight: bold !important;
  text-align: center !important;
  box-shadow: 0 0 50px rgba(0,255,0,0.8) !important;
  z-index: 999999 !important;
  position: relative !important;
  display: block !important;
  width: 90% !important;
  max-width: 600px !important;
  min-height: 150px !important;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
\`;
var style = document.createElement('style');
style.textContent = \`@keyframes greenPulse { 
  0% { background-position: 0% 50%; transform: scale(1); box-shadow: 0 0 50px rgba(0,255,0,0.8); } 
  50% { background-position: 100% 50%; transform: scale(1.05); box-shadow: 0 0 80px rgba(0,255,0,1); } 
  100% { background-position: 0% 50%; transform: scale(1); box-shadow: 0 0 50px rgba(0,255,0,0.8); } 
}\`;
document.head.appendChild(style);
testDiv.innerHTML = '🟢 AUTOINJECTOR GREEN TEST 🟢<br><div style="font-size: 18px; margin-top: 10px;">✅ INJECTION SUCCESSFUL!<br>Infinite scroll would load here</div>';

var targetElement = document.querySelector('${selector}');
if (targetElement) {
  targetElement.parentNode.insertBefore(testDiv, ${insertionPoint});
  console.log('🟢 Green test block injected at:', '${selector}');
  setTimeout(() => testDiv.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
} else {
  console.log('❌ Target not found, adding to body');
  document.body.appendChild(testDiv);
  testDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cleanup function
window.removeGreenTest = function() {
  var test = document.getElementById('autoinjector-green-test');
  if (test) { test.remove(); console.log('🧹 Green test removed'); }
};`;

    console.log('✅ Generated green test block for selector:', selector);
    console.log('🎯 Injection point:', insertionPoint === 'targetElement' ? 'BEFORE target' : 'AFTER target');
    
    return {
      snippet: greenTestSnippet,
      candidatesUsed: candidates.length,
      model: "hardcoded-green-block",
      selector: selector,
      insertionPoint: insertionPoint === 'targetElement' ? 'before' : 'after'
    };
  }
}); 