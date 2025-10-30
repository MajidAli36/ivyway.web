// Service Types and Categories Configuration
export const ServiceTypes = {
  TUTORING: "tutoring",
  COUNSELING: "counseling",
  TEST_PREP: "test_prep",
  IWGSP: "iwgsp",
};

export const ServiceCategories = {
  [ServiceTypes.TUTORING]: {
    name: "Academic Tutoring",
    description: "Subject-specific academic support and homework help",
    icon: "AcademicCapIcon",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    features: [
      "Subject expertise",
      "Homework help",
      "Exam preparation",
      "Progress tracking",
      "Flexible scheduling",
    ],
    pricing: {
      hourly: 74.99,
      monthly: 249.99,
      package: 349.99,
    },
  },
  [ServiceTypes.COUNSELING]: {
    name: "Academic Counseling",
    description: "Educational guidance, career planning, and study strategies",
    icon: "ChatBubbleLeftIcon",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    features: [
      "Career guidance",
      "Study planning",
      "Goal setting",
      "Academic support",
      "College preparation",
      "Virtual college tour add-on ($125)",
    ],
    pricing: {
      "30min": 49.99, // Student pays $49.99, counselor earns $20
      "60min": 89.99, // Student pays $89.99, counselor earns $30
      hourly: 89.99, // For display purposes - shows the 60min rate as hourly
    },
    counselorEarnings: {
      "30min": 20,
      "60min": 30,
    },
  },
  [ServiceTypes.IWGSP]: {
    name: "IvyWay Global Student Program",
    description: "Comprehensive international student support and guidance",
    icon: "GlobeAltIcon",
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    features: [
      "International student guidance",
      "Cultural adaptation",
      "Academic planning",
      "Career counseling",
    ],
    pricing: {
      hourly: 120,
      monthly: 480,
      package: 1200,
    },
  },
  [ServiceTypes.TEST_PREP]: {
    name: "Test Preparation",
    description: "Specialized preparation for standardized tests and exams",
    icon: "DocumentTextIcon",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    features: [
      "Test strategies",
      "Practice exams",
      "Score improvement",
      "Time management",
      "Confidence building",
    ],
    pricing: {
      hourly: 149.99,
      monthly: 269.99,
      package: 1199.99,
    },
  },
};

// Service-specific plan templates
export const ServicePlanTemplates = {
  [ServiceTypes.TUTORING]: {
    monthly: [
      {
        id: "tutoring_monthly_regular",
        name: "Monthly Tutoring Package",
        type: "monthly",
        price: 249.99,
        calculatedPrice: 249.99,
        sessionCount: 4,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        tutorType: "regular",
        hourlyRate: 62.5, // $249.99 / 4 sessions = $62.50 per hour
        features: [
          "4 one-hour sessions per month",
          "Regular tutor expertise",
          "All subjects covered",
          "Flexible scheduling",
          "Monthly progress reports",
        ],
        stripeProductId: "prod_tutoring_monthly_regular",
        stripePriceId: "price_tutoring_monthly_regular",
        isPopular: false,
      },
      {
        id: "tutoring_monthly_advanced",
        name: "Monthly Advanced Tutoring Package",
        type: "monthly",
        price: 349.99,
        calculatedPrice: 349.99,
        sessionCount: 4,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        tutorType: "advanced",
        hourlyRate: 87.5, // $349.99 / 4 sessions = $87.50 per hour
        features: [
          "4 one-hour sessions per month",
          "Advanced tutor expertise",
          "Premium subject knowledge",
          "Priority scheduling",
          "Enhanced progress tracking",
        ],
        stripeProductId: "prod_tutoring_monthly_advanced",
        stripePriceId: "price_tutoring_monthly_advanced",
        isPopular: true,
      },
    ],
    packages: [],
    single: [
      {
        id: "tutoring_single",
        name: "Single Tutoring Session",
        type: "single",
        price: 74.99,
        calculatedPrice: 74.99,
        sessionCount: null,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time session",
          "No commitment required",
          "Pay as you go",
          "Immediate booking",
        ],
        stripeProductId: "prod_tutoring_single",
        stripePriceId: "price_tutoring_single",
        isPopular: false,
      },
      {
        id: "tutoring_single_advanced",
        name: "Single Advanced Tutoring Session",
        type: "single",
        price: 99.99,
        calculatedPrice: 99.99,
        sessionCount: null,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time advanced session",
          "AP/IB and college-level",
          "No commitment required",
          "Immediate booking",
        ],
        stripeProductId: "prod_tutoring_single_advanced",
        stripePriceId: "price_tutoring_single_advanced",
        isPopular: false,
      },
    ],
  },
  [ServiceTypes.COUNSELING]: {
    monthly: [
      {
        id: "counseling_monthly_2_30min",
        name: "Counseling Monthly (2 x 30min sessions)",
        type: "monthly",
        price: 89.99,
        calculatedPrice: 89.99,
        sessionCount: 2,
        duration: 30,
        discount: 0,
        discountPercentage: 0,
        features: [
          "2 thirty-minute sessions per month",
          "Career guidance",
          "Study planning",
          "Goal setting",
          "Academic support",
        ],
        stripeProductId: "prod_counseling_monthly_2_30min",
        stripePriceId: "price_counseling_monthly_2_30min",
        isPopular: true,
      },
      {
        id: "counseling_monthly_2_60min",
        name: "Counseling Monthly (2 x 60min sessions)",
        type: "monthly",
        price: 159.99,
        calculatedPrice: 159.99,
        sessionCount: 2,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "2 one-hour sessions per month",
          "Comprehensive guidance",
          "Priority support",
          "Monthly progress reviews",
          "College preparation",
        ],
        stripeProductId: "prod_counseling_monthly_2_60min",
        stripePriceId: "price_counseling_monthly_2_60min",
        isPopular: false,
      },
    ],
    packages: [],
    single: [
      {
        id: "counseling_single_30min",
        name: "Single Counseling Session (30min)",
        type: "single",
        price: 49.99,
        calculatedPrice: 49.99,
        sessionCount: null,
        duration: 30,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time 30-minute consultation",
          "No commitment required",
          "Immediate booking",
          "Focused guidance",
        ],
        stripeProductId: "prod_counseling_single_30min",
        stripePriceId: "price_counseling_single_30min",
        isPopular: false,
      },
      {
        id: "counseling_single_60min",
        name: "Single Counseling Session (60min)",
        type: "single",
        price: 89.99,
        calculatedPrice: 89.99,
        sessionCount: null,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time 60-minute consultation",
          "No commitment required",
          "Immediate booking",
          "Comprehensive guidance",
        ],
        stripeProductId: "prod_counseling_single_60min",
        stripePriceId: "price_counseling_single_60min",
        isPopular: true,
      },
      {
        id: "counseling_virtual_tour_60min",
        name: "Virtual College Tour (60min)",
        type: "single",
        price: 124.99, // Student pays $124.99
        calculatedPrice: 124.99,
        sessionCount: 1,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "Live 1:1 virtual campus tour",
          "Explore campus life, programs, and fit",
          "Includes Q&A with your counselor",
          "Counselor keeps $100, platform keeps $25",
        ],
        stripeProductId: "prod_counseling_virtual_tour",
        stripePriceId: "price_counseling_virtual_tour",
        isPopular: false,
      },
    ],
  },
  [ServiceTypes.IWGSP]: {
    monthly: [
      {
        id: "iwgsp_monthly_basic",
        name: "IWGSP Monthly Basic",
        type: "monthly",
        price: 480,
        calculatedPrice: 480,
        sessionCount: 4,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "4 one-hour sessions per month",
          "International student guidance",
          "Visa and immigration support",
          "Cultural adaptation help",
          "Academic planning",
        ],
        stripeProductId: "prod_iwgsp_monthly_basic",
        stripePriceId: "price_iwgsp_monthly_basic",
        isPopular: true,
      },
    ],
    packages: [
      {
        id: "iwgsp_comprehensive_package",
        name: "IWGSP Comprehensive Package",
        type: "multi_hour",
        price: 1200,
        calculatedPrice: 1200,
        sessionCount: 10,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "10 one-hour sessions",
          "Complete international student support",
          "University application assistance",
          "Career counseling",
          "6-month validity",
        ],
        stripeProductId: "prod_iwgsp_comprehensive",
        stripePriceId: "price_iwgsp_comprehensive",
        isPopular: false,
      },
    ],
    single: [
      {
        id: "iwgsp_single_session",
        name: "IWGSP Single Session",
        type: "single",
        price: 120,
        calculatedPrice: 120,
        sessionCount: null,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time consultation",
          "International student guidance",
          "No commitment required",
          "Immediate booking",
        ],
        stripeProductId: "prod_iwgsp_single",
        stripePriceId: "price_iwgsp_single",
        isPopular: false,
      },
    ],
  },
  [ServiceTypes.TEST_PREP]: {
    monthly: [
      {
        id: "testprep_two_session_monthly",
        name: "Two-Session Monthly Deal (2hr total)",
        type: "monthly",
        price: 269.99,
        calculatedPrice: 269.99,
        sessionCount: 2,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "2 hours of test prep per month",
          "Flexible scheduling",
          "All test types covered",
          "Progress tracking",
        ],
        stripeProductId: "prod_testprep_two_session_monthly",
        stripePriceId: "price_testprep_two_session_monthly",
        isPopular: true,
      },
      {
        id: "testprep_four_session_monthly",
        name: "Four-Session Monthly Bundle (4hr total)",
        type: "monthly",
        price: 499.99,
        calculatedPrice: 499.99,
        sessionCount: 4,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "4 hours of test prep per month",
          "Comprehensive preparation",
          "Priority scheduling",
          "Enhanced progress tracking",
        ],
        stripeProductId: "prod_testprep_four_session_monthly",
        stripePriceId: "price_testprep_four_session_monthly",
        isPopular: false,
      },
    ],
    packages: [
      {
        id: "testprep_ten_session_premium",
        name: "Ten-Session Premium Bundle (10hr total)",
        type: "multi_hour",
        price: 1199.99,
        calculatedPrice: 1199.99,
        sessionCount: 10,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "10 hours of test prep",
          "Complete test preparation",
          "Maximum flexibility",
          "12-month validity",
          "Best value option",
        ],
        stripeProductId: "prod_testprep_ten_session_premium",
        stripePriceId: "price_testprep_ten_session_premium",
        isPopular: false,
      },
    ],
    single: [
      {
        id: "testprep_single_session",
        name: "Single Session (1hr)",
        type: "single",
        price: 149.99,
        calculatedPrice: 149.99,
        sessionCount: null,
        duration: 60,
        discount: 0,
        discountPercentage: 0,
        features: [
          "One-time test prep session",
          "No commitment required",
          "Immediate booking",
          "All test types covered",
        ],
        stripeProductId: "prod_testprep_single_session",
        stripePriceId: "price_testprep_single_session",
        isPopular: false,
      },
    ],
  },
};

// Helper functions
export const getServiceCategory = (serviceType) => {
  return (
    ServiceCategories[serviceType] || ServiceCategories[ServiceTypes.TUTORING]
  );
};

export const getServicePlans = (serviceType) => {
  const templates =
    ServicePlanTemplates[serviceType] ||
    ServicePlanTemplates[ServiceTypes.TUTORING];
  return [...templates.monthly, ...templates.packages, ...templates.single];
};

export const getServiceIcon = (serviceType) => {
  return getServiceCategory(serviceType).icon;
};

export const getServiceColor = (serviceType) => {
  return getServiceCategory(serviceType).color;
};
