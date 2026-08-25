// Comprehensive Pan-India States & Districts Database + Intake Options

export interface IndianStateData {
  code: string;
  name: string;
  lat: number;
  lon: number;
  districts: string[];
}

export const PAN_INDIA_STATES: IndianStateData[] = [
  {
    code: "AP",
    name: "Andhra Pradesh",
    lat: 16.506,
    lon: 80.648,
    districts: [
      "Kakinada", "Visakhapatnam", "East Godavari", "West Godavari", "Guntur",
      "Krishna", "NTR", "Eluru", "Dr. B.R. Ambedkar Konaseema", "Anakapalli",
      "Sri Potti Sriramulu Nellore", "Tirupati", "Chittoor", "Annamayya",
      "YSR Kadapa", "Sri Sathya Sai", "Anantapuramu", "Kurnool", "Nandyal",
      "Prakasam", "Palnadu", "Bapatla", "Srikakulam", "Vizianagaram", "Parvathipuram Manyam", "Alluri Sitharama Raju"
    ]
  },
  {
    code: "TS",
    name: "Telangana",
    lat: 17.385,
    lon: 78.486,
    districts: [
      "Hyderabad", "Ranga Reddy", "Medchal-Malkajgiri", "Warangal", "Hanamkonda",
      "Karimnagar", "Nizamabad", "Khammam", "Nalgonda", "Suryapet",
      "Mahabubnagar", "Sangareddy", "Siddipet", "Jagtial", "Mancherial",
      "Adilabad", "Bhadradri Kothagudem", "Kamareddy", "Medak", "Nagarkurnool",
      "Wanaparthy", "Jogulamba Gadwal", "Vikarabad", "Jangaon", "Yadadri Bhuvanagiri"
    ]
  },
  {
    code: "MH",
    name: "Maharashtra",
    lat: 19.076,
    lon: 72.877,
    districts: [
      "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik",
      "Aurangabad (Chhatrapati Sambhaji Nagar)", "Solapur", "Kolhapur", "Amravati",
      "Nanded", "Sangli", "Satara", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar",
      "Chandrapur", "Parbhani", "Jalna", "Buldhana", "Raigad", "Ratnagiri", "Sindhudurg", "Yavatmal", "Wardha"
    ]
  },
  {
    code: "KA",
    name: "Karnataka",
    lat: 12.971,
    lon: 77.594,
    districts: [
      "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad",
      "Kalaburagi", "Dakshina Kannada", "Tumakuru", "Ballari", "Shivamogga",
      "Vijayapura", "Davangere", "Udupi", "Hassan", "Mandya", "Raichur",
      "Bidar", "Chitradurga", "Kolar", "Chikkamagaluru", "Uttara Kannada", "Bagalkote"
    ]
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    lat: 13.082,
    lon: 80.270,
    districts: [
      "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
      "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul",
      "Kanchipuram", "Chengalpattu", "Tiruvallur", "Cuddalore", "Tiruppur",
      "Virudhunagar", "Karur", "Nagapattinam", "Namakkal", "Theni", "Kanyakumari"
    ]
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    lat: 26.846,
    lon: 80.946,
    districts: [
      "Lucknow", "Kanpur Nagar", "Varanasi", "Agra", "Prayagraj", "Meerut",
      "Ghaziabad", "Gautam Buddha Nagar (Noida)", "Bareilly", "Aligarh", "Moradabad",
      "Gorakhpur", "Saharanpur", "Jhansi", "Mathura", "Ayodhya", "Muzaffarnagar", "Firozabad"
    ]
  },
  {
    code: "DL",
    name: "Delhi NCR",
    lat: 28.613,
    lon: 77.209,
    districts: [
      "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
      "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    lat: 22.572,
    lon: 88.363,
    districts: [
      "Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah", "Hooghly",
      "Paschim Medinipur", "Purba Medinipur", "Purba Bardhaman", "Paschim Bardhaman",
      "Murshidabad", "Nadia", "Malda", "Jalpaiguri", "Darjeeling", "Siliguri", "Birbhum"
    ]
  },
  {
    code: "GJ",
    name: "Gujarat",
    lat: 23.022,
    lon: 72.571,
    districts: [
      "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
      "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Bharuch", "Kutch", "Patan", "Mehsana"
    ]
  },
  {
    code: "MP",
    name: "Madhya Pradesh",
    lat: 23.259,
    lon: 77.412,
    districts: [
      "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas",
      "Satna", "Ratlam", "Rewa", "Katni", "Singrauli", "Chhindwara", "Morena"
    ]
  },
  {
    code: "RJ",
    name: "Rajasthan",
    lat: 26.912,
    lon: 75.787,
    districts: [
      "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara",
      "Alwar", "Bharatpur", "Sikar", "Pali", "Ganganagar", "Barmer", "Nagaur"
    ]
  },
  {
    code: "BR",
    name: "Bihar",
    lat: 25.594,
    lon: 85.137,
    districts: [
      "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga",
      "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Samastipur"
    ]
  },
  {
    code: "PB",
    name: "Punjab",
    lat: 30.901,
    lon: 75.857,
    districts: [
      "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "SAS Nagar (Mohali)",
      "Hoshiarpur", "Pathankot", "Moga", "Ferozepur", "Gurdaspur", "Sangrur"
    ]
  },
  {
    code: "HR",
    name: "Haryana",
    lat: 29.058,
    lon: 76.085,
    districts: [
      "Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak",
      "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Rewari"
    ]
  },
  {
    code: "KL",
    name: "Kerala",
    lat: 8.524,
    lon: 76.936,
    districts: [
      "Thiruvananthapuram", "Ernakulam (Kochi)", "Kozhikode", "Thrissur", "Kollam",
      "Palakkad", "Malappuram", "Kannur", "Kottayam", "Alappuzha", "Idukki", "Wayanad", "Kasaragod"
    ]
  },
  {
    code: "OD",
    name: "Odisha",
    lat: 20.296,
    lon: 85.824,
    districts: [
      "Khordha (Bhubaneswar)", "Cuttack", "Ganjam", "Sundargarh (Rourkela)", "Puri",
      "Balasore", "Bhadrak", "Sambalpur", "Bargarh", "Jajpur", "Mayurbhanj", "Angul"
    ]
  },
  {
    code: "JH",
    name: "Jharkhand",
    lat: 23.344,
    lon: 85.309,
    districts: [
      "Ranchi", "East Singhbhum (Jamshedpur)", "Dhanbad", "Bokaro", "Deoghar",
      "Hazaribagh", "Giridih", "Ramgarh", "Palamu", "Dumka"
    ]
  },
  {
    code: "CG",
    name: "Chhattisgarh",
    lat: 21.251,
    lon: 81.629,
    districts: [
      "Raipur", "Durg (Bhilai)", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur"
    ]
  },
  {
    code: "AS",
    name: "Assam",
    lat: 26.144,
    lon: 91.736,
    districts: [
      "Kamrup Metropolitan (Guwahati)", "Dibrugarh", "Silchar (Cachar)", "Jorhat", "Nagaon", "Tinsukia", "Sonitpur (Tezpur)"
    ]
  },
  {
    code: "UK",
    name: "Uttarakhand",
    lat: 30.316,
    lon: 78.032,
    districts: [
      "Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Pauri Garhwal", "Almora", "Tehri Garhwal"
    ]
  },
  {
    code: "HP",
    name: "Himachal Pradesh",
    lat: 31.104,
    lon: 77.173,
    districts: [
      "Shimla", "Kangra (Dharamshala)", "Mandi", "Solan", "Kullu", "Sirmaur", "Hamirpur", "Una"
    ]
  },
  {
    code: "JK",
    name: "Jammu & Kashmir",
    lat: 34.083,
    lon: 74.797,
    districts: [
      "Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Budgam", "Pulwama"
    ]
  },
  {
    code: "GA",
    name: "Goa",
    lat: 15.299,
    lon: 74.124,
    districts: [
      "North Goa (Panaji)", "South Goa (Margao)"
    ]
  },
  {
    code: "TR",
    name: "Tripura",
    lat: 23.831,
    lon: 91.286,
    districts: ["West Tripura (Agartala)", "Gomati", "South Tripura", "Dhalai", "North Tripura"]
  },
  {
    code: "ML",
    name: "Meghalaya",
    lat: 25.578,
    lon: 91.893,
    districts: ["East Khasi Hills (Shillong)", "West Garo Hills", "Ri-Bhoi", "West Jaintia Hills"]
  },
  {
    code: "MN",
    name: "Manipur",
    lat: 24.817,
    lon: 93.936,
    districts: ["Imphal West", "Imphal East", "Thoubal", "Bishnupur", "Churachandpur"]
  },
  {
    code: "NL",
    name: "Nagaland",
    lat: 25.675,
    lon: 94.108,
    districts: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"]
  },
  {
    code: "MZ",
    name: "Mizoram",
    lat: 23.727,
    lon: 92.717,
    districts: ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip"]
  },
  {
    code: "SK",
    name: "Sikkim",
    lat: 27.338,
    lon: 88.606,
    districts: ["East Sikkim (Gangtok)", "West Sikkim", "South Sikkim", "North Sikkim"]
  },
  {
    code: "AR",
    name: "Arunachal Pradesh",
    lat: 27.084,
    lon: 93.605,
    districts: ["Papum Pare (Itanagar)", "Changlang", "West Kameng", "East Siang", "Tawang"]
  }
];

export const EDUCATIONAL_QUALIFICATIONS = [
  { id: "BELOW_10TH", label: "Below 10th Standard (Primary / Middle)" },
  { id: "10TH_PASS", label: "10th Pass (SSC / Matriculation)" },
  { id: "12TH_PASS", label: "12th Pass / Intermediate (10+2 / Higher Secondary)" },
  { id: "ITI_VOCATIONAL", label: "ITI / Vocational Skill Certification" },
  { id: "DIPLOMA", label: "Polytechnic / Technical Diploma" },
  { id: "GRADUATE", label: "Graduate / Bachelor's Degree (B.A, B.Sc, B.Com, B.Tech, etc.)" },
  { id: "POST_GRADUATE", label: "Post Graduate / Master's Degree (M.A, M.Sc, M.Com, MBA, M.Tech, etc.)" },
  { id: "DOCTORATE", label: "Doctorate / Ph.D. / Research Scholar" },
  { id: "ILLITERATE", label: "Self-Trained / Basic Literacy" },
  { id: "OTHER", label: "Other Qualification (Specify)" }
];

export const ASSISTANCE_TYPES = [
  { id: "BUSINESS", label: "Business / Enterprise Loan", hasSubQuestion: true, defaultCost: 500000 },
  { id: "MICRO_CREDIT", label: "Micro Credit / Small Vendor / Kirana Shop", hasSubQuestion: false, defaultCost: 140000 },
  { id: "AGRICULTURE", label: "Agriculture & Allied (Dairy, Goat Rearing, Floriculture)", hasSubQuestion: false, defaultCost: 140000 },
  { id: "EDUCATION_DOMESTIC", label: "Higher Education Loan (Domestic / India)", hasSubQuestion: false, defaultCost: 1500000 },
  { id: "EDUCATION_ABROAD", label: "Higher Education Loan (Abroad / Overseas Universities)", hasSubQuestion: false, defaultCost: 3500000 },
  { id: "GREEN_ENERGY", label: "Green Energy / Solar PV / Battery e-Rickshaw", hasSubQuestion: false, defaultCost: 3000000 },
  { id: "SANITATION", label: "Swachhta Udyami / Mechanized Cleaning Machinery", hasSubQuestion: false, defaultCost: 4000000 },
  { id: "ARTISAN", label: "Shilpi Samriddhi / Traditional Handicrafts & Handloom", hasSubQuestion: false, defaultCost: 140000 },
  { id: "OTHER", label: "Other Activity Purpose (Specify)", hasSubQuestion: false, defaultCost: 200000 }
];

export const BUSINESS_TYPES = [
  { id: "RETAIL", label: "Retail / Grocery Store / Kirana / General Merchant" },
  { id: "MANUFACTURING", label: "Small Manufacturing / Workshop / Fabrication" },
  { id: "TRANSPORT", label: "Commercial Transport Vehicle / Auto / Cargo Carrier" },
  { id: "SERVICE", label: "Service Center / Repair Shop / Electrical / Tailoring" },
  { id: "FOOD", label: "Food Processing / Bakery / Restaurant / Tea Stall" },
  { id: "DAIRY", label: "Dairy Farming / Animal Husbandry / Poultry" },
  { id: "DIGITAL_CSC", label: "Digital Seva Kendra / Cyber Cafe / CSC Center" },
  { id: "OTHER", label: "Other Commercial Business (Specify)" }
];

// Helper: Calculate Haversine distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Match nearest state and default district from GPS coordinates
export function findNearestStateAndDistrict(lat: number, lon: number): { state: IndianStateData; district: string } {
  let minDistance = Infinity;
  let nearestState: IndianStateData = PAN_INDIA_STATES[0];

  for (const st of PAN_INDIA_STATES) {
    const d = calculateDistance(lat, lon, st.lat, st.lon);
    if (d < minDistance) {
      minDistance = d;
      nearestState = st;
    }
  }

  const defaultDistrict = nearestState.districts[0] || "Headquarters";
  return { state: nearestState, district: defaultDistrict };
}
