export const translations = {
  en: {
    navbar: {
      home: "Home",
      pricing: "Pricing",
      about: "About",
      contact: "Contact",
      getStarted: "Start Simulation",
    },
    hero: {
      badge: "Financial Decision AI Copilot 🚀",
      headline: "The AI Copilot for Your Financial Future",
      italicWord: "Financial",
      subheadline: "Stop just tracking expenses. Start predicting impact. FinPilot simulates your daily decisions to guide you toward a wealthier future.",
      cta: "Analyze My Finances",
    },
    timeline: {
      title: "How It Works",
      description: "From raw data to actionable financial intelligence.",
      steps: [
        { title: "Data Ingestion", description: "Securely processing your transaction patterns using our smart pipeline." },
        { title: "Pattern Analysis", description: "AI categorizes and identifies trends in your spending habits automatically." },
        { title: "Scenario Simulation", description: "See the long-term impact of decisions like 'eating out less' or 'saving more'." },
        { title: "Smart Guidance", description: "Receive ranked, concrete recommendations to optimize your financial health." },
      ],
    },
    features: {
      title: "Empowering Your Wallet",
      description: "Budgeting apps show the past. FinPilot predicts the future.",
      cards: [
        { title: "Scenario Simulation", description: "Predict the impact of daily choices. If you do X, then your future wealth becomes Y." },
        { title: "Smart Recommendations", description: "Get ranked, actionable advice to improve your financial health based on AI insights." },
        { title: "Future Prediction", description: "Visualize your financial state months in advance with our advanced prediction engine." },
      ],
    },
  },
  hi: {
    navbar: {
      home: "मुख्य पृष्ठ",
      pricing: "कीमतें",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      getStarted: "सिमुलेशन शुरू करें",
    },
    hero: {
      badge: "वित्तीय निर्णय एआई कोपायलट 🚀",
      headline: "आपके वित्तीय भविष्य के लिए एआई कोपायलट",
      italicWord: "वित्तीय",
      subheadline: "केवल खर्चों को ट्रैक करना बंद करें। प्रभाव की भविष्यवाणी करना शुरू करें। FinPilot आपके दैनिक निर्णयों का सिमुलेशन करता है ताकि आपको एक समृद्ध भविष्य की ओर ले जा सके।",
      cta: "मेरे वित्त का विश्लेषण करें",
    },
    timeline: {
      title: "यह कैसे काम करता है",
      description: "कच्चे डेटा से कार्रवाई योग्य वित्तीय बुद्धिमत्ता तक।",
      steps: [
        { title: "डेटा इनजेशन", description: "हमारे स्मार्ट पाइपलाइन का उपयोग करके आपके लेनदेन पैटर्न को सुरक्षित रूप से संसाधित करना।" },
        { title: "पैटर्न विश्लेषण", description: "एआई आपकी खर्च करने की आदतों में स्वचालित रूप से रुझानों को वर्गीकृत और पहचानता है।" },
        { title: "परिदृश्य सिमुलेशन", description: "देखें कि 'बाहर कम खाना' या 'अधिक बचत करना' जैसे निर्णयों का दीर्घकालिक प्रभाव क्या होता है।" },
        { title: "स्मार्ट मार्गदर्शन", description: "अपने वित्तीय स्वास्थ्य को अनुकूलित करने के लिए रैंक किए गए, ठोस सुझाव प्राप्त करें।" },
      ],
    },
    features: {
      title: "आपके वॉलेट को सशक्त बनाना",
      description: "बजटिंग ऐप्स अतीत दिखाते हैं। FinPilot भविष्य की भविष्यवाणी करता है।",
      cards: [
        { title: "परिदृश्य सिमुलेशन", description: "दैनिक विकल्पों के प्रभाव की भविष्यवाणी करें। यदि आप X करते हैं, तो आपका भविष्य का धन Y हो जाता है।" },
        { title: "स्मार्ट सिफारिशें", description: "एआई अंतर्दृष्टि के आधार पर अपने वित्तीय स्वास्थ्य को बेहतर बनाने के लिए रैंक की गई, कार्रवाई योग्य सलाह प्राप्त करें।" },
        { title: "भविष्य की भविष्यवाणी", description: "हमारे उन्नत भविष्यवाणी इंजन के साथ महीनों पहले अपनी वित्तीय स्थिति की कल्पना करें।" },
      ],
    },
  },
};

export type Language = 'en' | 'hi';
export type TranslationKeys = typeof translations.en;
