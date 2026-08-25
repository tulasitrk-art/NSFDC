import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.constants import INDIAN_STATES

# Comprehensive Multi-State Channel Partner Branch Seeds with Detailed Physical Addresses
PAN_INDIA_BRANCH_SEEDS = [
    # Andhra Pradesh
    {
        "partner_id": 1,
        "state_code": "AP",
        "state_name": "Andhra Pradesh",
        "partner_name": "AP State SC Co-op Finance Corp",
        "partner_type": "SCA",
        "branch_name": "District Office Kakinada",
        "address": "D.No: 12-4-8, Opposite District Collectorate Complex, Main Collectorate Road, Kakinada, AP - 533001",
        "lat": 16.9950,
        "lon": 82.2420,
        "allocated_quota": 5000000.00,
        "utilized_quota": 1200000.00,
        "npa_percentage": 2.10,
        "officer_name": "K. Rama Rao",
        "officer_phone": "+91 88423 45671"
    },
    {
        "partner_id": 2,
        "state_code": "AP",
        "state_name": "Andhra Pradesh",
        "partner_name": "State Bank of India",
        "partner_type": "PSB",
        "branch_name": "Kakinada Main Branch",
        "address": "SBI Main Building, Temple Square, Nagamalli Thota Junction, Kakinada, AP - 533003",
        "lat": 16.9820,
        "lon": 82.2380,
        "allocated_quota": 10000000.00,
        "utilized_quota": 4500000.00,
        "npa_percentage": 4.30,
        "officer_name": "P. Satyanarayana",
        "officer_phone": "+91 88423 78901"
    },
    {
        "partner_id": 3,
        "state_code": "AP",
        "state_name": "Andhra Pradesh",
        "partner_name": "Chaitanya Godavari Grameena Bank",
        "partner_type": "RRB",
        "branch_name": "Kakinada Rural Branch",
        "address": "CGGB Complex, Near Zilla Parishad, Main Road, Kakinada Rural, AP - 533006",
        "lat": 16.9750,
        "lon": 82.2290,
        "allocated_quota": 3000000.00,
        "utilized_quota": 800000.00,
        "npa_percentage": 1.80,
        "officer_name": "M. Srinivas",
        "officer_phone": "+91 88423 11223"
    },
    # Telangana
    {
        "partner_id": 4,
        "state_code": "TS",
        "state_name": "Telangana",
        "partner_name": "Telangana SC Co-operative Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Masab Tank Head Office Hyderabad",
        "address": "Dr. B.R. Ambedkar Bhavan, 5th Floor, Masab Tank, AC Guards, Hyderabad, Telangana - 500028",
        "lat": 17.3990,
        "lon": 78.4480,
        "allocated_quota": 8000000.00,
        "utilized_quota": 2000000.00,
        "npa_percentage": 1.90,
        "officer_name": "T. Balakrishna",
        "officer_phone": "+91 40234 56789"
    },
    {
        "partner_id": 5,
        "state_code": "TS",
        "state_name": "Telangana",
        "partner_name": "State Bank of India",
        "partner_type": "PSB",
        "branch_name": "Gunfoundry Hyderabad",
        "address": "SBI Gunfoundry Building, Bank Street, Abids Circle, Hyderabad, Telangana - 500001",
        "lat": 17.3910,
        "lon": 78.4790,
        "allocated_quota": 15000000.00,
        "utilized_quota": 5000000.00,
        "npa_percentage": 3.80,
        "officer_name": "G. Madhusudhan",
        "officer_phone": "+91 40234 11223"
    },
    # Maharashtra
    {
        "partner_id": 6,
        "state_code": "MH",
        "state_name": "Maharashtra",
        "partner_name": "Mahatma Phule BC Development Corp",
        "partner_type": "SCA",
        "branch_name": "Nariman Point Mumbai HQ",
        "address": "Tanna House, 4th Floor, Nathalal Parekh Marg, Nariman Point, Mumbai, Maharashtra - 400021",
        "lat": 18.9256,
        "lon": 72.8258,
        "allocated_quota": 12000000.00,
        "utilized_quota": 3500000.00,
        "npa_percentage": 2.80,
        "officer_name": "S. S. Patil",
        "officer_phone": "+91 22220 12345"
    },
    {
        "partner_id": 7,
        "state_code": "MH",
        "state_name": "Maharashtra",
        "partner_name": "Bank of Maharashtra",
        "partner_type": "PSB",
        "branch_name": "Shivajinagar Pune Branch",
        "address": "Bank of Maharashtra Zonal Office, Lokmangal, 1501 Shivajinagar, FC Road, Pune, Maharashtra - 411005",
        "lat": 18.5204,
        "lon": 73.8567,
        "allocated_quota": 9000000.00,
        "utilized_quota": 2200000.00,
        "npa_percentage": 3.10,
        "officer_name": "A. Deshmukh",
        "officer_phone": "+91 20255 33445"
    },
    {
        "partner_id": 8,
        "state_code": "MH",
        "state_name": "Maharashtra",
        "partner_name": "Union Bank of India",
        "partner_type": "PSB",
        "branch_name": "Deekshabhoomi Nagpur Branch",
        "address": "UBI Building, Reshimbagh Chowk, South Ambazari Road, Near Deekshabhoomi, Nagpur, Maharashtra - 440024",
        "lat": 21.1458,
        "lon": 79.0882,
        "allocated_quota": 7500000.00,
        "utilized_quota": 1800000.00,
        "npa_percentage": 2.40,
        "officer_name": "V. R. Kulkarni",
        "officer_phone": "+91 71225 66778"
    },
    # Karnataka
    {
        "partner_id": 9,
        "state_code": "KA",
        "state_name": "Karnataka",
        "partner_name": "Dr. B.R. Ambedkar Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Vasanth Nagar Bengaluru",
        "address": "Dr. B.R. Ambedkar Bhavan, 9th Floor, Millers Road, Vasanth Nagar, Bengaluru, Karnataka - 560052",
        "lat": 12.9716,
        "lon": 77.5946,
        "allocated_quota": 11000000.00,
        "utilized_quota": 4000000.00,
        "npa_percentage": 2.30,
        "officer_name": "R. K. Siddarama",
        "officer_phone": "+91 80222 99881"
    },
    # Tamil Nadu
    {
        "partner_id": 10,
        "state_code": "TN",
        "state_name": "Tamil Nadu",
        "partner_name": "TAHDCO Head Office",
        "partner_type": "SCA",
        "branch_name": "Nungambakkam Chennai",
        "address": "TAHDCO Head Office, 31 Cenotaph Road, Teynampet, Nungambakkam, Chennai, Tamil Nadu - 600018",
        "lat": 13.0604,
        "lon": 80.2410,
        "allocated_quota": 14000000.00,
        "utilized_quota": 3800000.00,
        "npa_percentage": 2.00,
        "officer_name": "K. Annamalai",
        "officer_phone": "+91 44282 77665"
    },
    # Uttar Pradesh
    {
        "partner_id": 11,
        "state_code": "UP",
        "state_name": "Uttar Pradesh",
        "partner_name": "UP SC Finance & Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Hazratganj Lucknow",
        "address": "UP SC Finance Bhawan, Prag Narain Road, Hazratganj, Lucknow, Uttar Pradesh - 226001",
        "lat": 26.8467,
        "lon": 80.9462,
        "allocated_quota": 20000000.00,
        "utilized_quota": 6000000.00,
        "npa_percentage": 3.40,
        "officer_name": "R. N. Singh",
        "officer_phone": "+91 52222 88990"
    },
    # Delhi NCR
    {
        "partner_id": 12,
        "state_code": "DL",
        "state_name": "Delhi",
        "partner_name": "Delhi SC/ST/OBC Corp (DSFDC)",
        "partner_type": "SCA",
        "branch_name": "Ambedkar Bhawan New Delhi",
        "address": "DSFDC Head Office, 2 Bahadur Shah Zafar Marg, Near Ambedkar Bhawan, ITO, New Delhi - 110002",
        "lat": 28.6448,
        "lon": 77.2167,
        "allocated_quota": 8000000.00,
        "utilized_quota": 2500000.00,
        "npa_percentage": 1.70,
        "officer_name": "M. K. Verma",
        "officer_phone": "+91 11233 44556"
    },
    # Gujarat
    {
        "partner_id": 13,
        "state_code": "GJ",
        "state_name": "Gujarat",
        "partner_name": "Gujarat Scheduled Caste Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Gandhinagar HQ",
        "address": "GSCDC Bhavan, Block No. 4, 3rd Floor, Udhyog Bhavan, Sector 11, Gandhinagar, Gujarat - 382017",
        "lat": 23.2156,
        "lon": 72.6369,
        "allocated_quota": 10000000.00,
        "utilized_quota": 2800000.00,
        "npa_percentage": 2.20,
        "officer_name": "J. H. Parmar",
        "officer_phone": "+91 79232 55443"
    },
    # West Bengal
    {
        "partner_id": 14,
        "state_code": "WB",
        "state_name": "West Bengal",
        "partner_name": "West Bengal SC/ST Dev Finance Corp",
        "partner_type": "SCA",
        "branch_name": "Bidhannagar Salt Lake Kolkata",
        "address": "WBSCSTDFC HQ, CF-217/A/1, Sector 1, Bidhannagar, Salt Lake City, Kolkata, West Bengal - 700064",
        "lat": 22.5726,
        "lon": 88.3639,
        "allocated_quota": 13000000.00,
        "utilized_quota": 3900000.00,
        "npa_percentage": 2.60,
        "officer_name": "S. Banerjee",
        "officer_phone": "+91 33235 88990"
    },
    # Madhya Pradesh
    {
        "partner_id": 15,
        "state_code": "MP",
        "state_name": "Madhya Pradesh",
        "partner_name": "MP State SC Finance Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Arera Hills Bhopal",
        "address": "Rajiv Gandhi Bhawan, Parisar 2, Jail Road, Arera Hills, Bhopal, Madhya Pradesh - 462011",
        "lat": 23.2599,
        "lon": 77.4126,
        "allocated_quota": 11500000.00,
        "utilized_quota": 3100000.00,
        "npa_percentage": 2.90,
        "officer_name": "R. C. Ahirwar",
        "officer_phone": "+91 75525 56677"
    },
    # Rajasthan
    {
        "partner_id": 16,
        "state_code": "RJ",
        "state_name": "Rajasthan",
        "partner_name": "Anuprati SC Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Nehru Palace Jaipur",
        "address": "Nehru Sahakar Bhavan, 4th Floor, 22 Godam Circle, Tonk Road, Jaipur, Rajasthan - 302015",
        "lat": 26.9124,
        "lon": 75.7873,
        "allocated_quota": 10500000.00,
        "utilized_quota": 2900000.00,
        "npa_percentage": 2.50,
        "officer_name": "B. L. Meghwal",
        "officer_phone": "+91 14127 44332"
    },
    # Bihar
    {
        "partner_id": 17,
        "state_code": "BR",
        "state_name": "Bihar",
        "partner_name": "Bihar State SC Co-op Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Boring Road Patna",
        "address": "Bihar State SC Co-op Building, Near Alankar Place, Boring Canal Road, Patna, Bihar - 800001",
        "lat": 25.5941,
        "lon": 85.1376,
        "allocated_quota": 15000000.00,
        "utilized_quota": 4200000.00,
        "npa_percentage": 3.70,
        "officer_name": "K. P. Paswan",
        "officer_phone": "+91 61225 33221"
    },
    # Kerala
    {
        "partner_id": 18,
        "state_code": "KL",
        "state_name": "Kerala",
        "partner_name": "Kerala State SC/ST Dev Corp",
        "partner_type": "SCA",
        "branch_name": "Museum Junction Thiruvananthapuram",
        "address": "Kerala SC/ST Corp Building, Museum Junction, Near Zoo, Vellayambalam, Thiruvananthapuram, Kerala - 695033",
        "lat": 8.5241,
        "lon": 76.9366,
        "allocated_quota": 9500000.00,
        "utilized_quota": 2100000.00,
        "npa_percentage": 1.60,
        "officer_name": "V. K. Rajan",
        "officer_phone": "+91 47123 22334"
    },
    # Odisha
    {
        "partner_id": 19,
        "state_code": "OD",
        "state_name": "Odisha",
        "partner_name": "OSFDC Head Office",
        "partner_type": "SCA",
        "branch_name": "Saheed Nagar Bhubaneswar",
        "address": "OSFDC Complex, Plot No. 121, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha - 751007",
        "lat": 20.2961,
        "lon": 85.8245,
        "allocated_quota": 10000000.00,
        "utilized_quota": 2700000.00,
        "npa_percentage": 2.70,
        "officer_name": "S. C. Sethi",
        "officer_phone": "+91 67425 44556"
    },
    # Punjab
    {
        "partner_id": 20,
        "state_code": "PB",
        "state_name": "Punjab",
        "partner_name": "Punjab Land Dev & Finance Corp",
        "partner_type": "SCA",
        "branch_name": "Sector 34 Chandigarh",
        "address": "Punjab Land Dev Bhawan, SCO 14-15, Sub-City Center, Sector 34-A, Chandigarh, Punjab - 160022",
        "lat": 30.7333,
        "lon": 76.7794,
        "allocated_quota": 12500000.00,
        "utilized_quota": 3400000.00,
        "npa_percentage": 2.30,
        "officer_name": "H. S. Gill",
        "officer_phone": "+91 17226 00112"
    }
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes geodesic distance between two coordinates in Kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def compute_r_score(distance_km: float, remaining_quota: float, allocated_quota: float, npa_percentage: float) -> float:
    """
    R_score = 0.40 * (1 / (1 + d/10)) + 0.40 * (F_remaining / F_allocated) - 0.20 * (NPA% / 100)
    """
    if allocated_quota <= 0:
        quota_ratio = 0.0
    else:
        quota_ratio = min(1.0, max(0.0, remaining_quota / allocated_quota))

    distance_term = 0.40 * (1.0 / (1.0 + (distance_km / 10.0)))
    quota_term = 0.40 * quota_ratio
    npa_penalty = 0.20 * (npa_percentage / 100.0)

    return round(distance_term + quota_term - npa_penalty, 4)

def route_pan_india_branches(
    state_code: str = "ALL",
    lat: float = 16.9820,
    lon: float = 82.2380,
    radius_km: float = 50.0,
    db: Session = None
) -> Dict[str, Any]:
    """
    Executes spatial search across Pan-India branches, applies pruning gates (NPA < 15%),
    computes R_score index, and returns sorted channel partner cards with detailed address.
    """
    candidates = []

    # Filter seeds by state code if provided
    for b in PAN_INDIA_BRANCH_SEEDS:
        if state_code != "ALL" and b["state_code"].upper() != state_code.upper():
            continue
        d = haversine_distance(lat, lon, b["lat"], b["lon"])
        item = dict(b)
        item["distance_km"] = d
        candidates.append(item)

    # If state filtered and candidates empty, return all seeds with distance
    if not candidates:
        for b in PAN_INDIA_BRANCH_SEEDS:
            d = haversine_distance(lat, lon, b["lat"], b["lon"])
            item = dict(b)
            item["distance_km"] = d
            candidates.append(item)

    processed = []
    valid_count = 0

    for b in candidates:
        allocated = float(b["allocated_quota"])
        utilized = float(b["utilized_quota"])
        remaining = max(0.0, allocated - utilized)
        npa = float(b["npa_percentage"])
        dist_km = float(b["distance_km"])

        # PRUNING GATE: Exclude branches where remaining <= 0 OR npa >= 15.0%
        is_pruned = (remaining <= 0) or (npa >= 15.0)

        r_score = compute_r_score(dist_km, remaining, allocated, npa)

        if is_pruned:
            pin_status = "RED_PRUNED"
        elif r_score >= 0.70:
            pin_status = "GREEN"
            valid_count += 1
        elif r_score >= 0.50:
            pin_status = "YELLOW"
            valid_count += 1
        else:
            pin_status = "RED_PRUNED"

        processed.append({
            "partner_id": b["partner_id"],
            "state_code": b["state_code"],
            "state_name": b["state_name"],
            "partner_name": b["partner_name"],
            "partner_type": b["partner_type"],
            "branch_name": b["branch_name"],
            "address": b.get("address", f"{b['branch_name']}, {b['state_name']}"),
            "lat": b["lat"],
            "lon": b["lon"],
            "distance_km": round(dist_km, 2),
            "allocated_quota": round(allocated, 2),
            "utilized_quota": round(utilized, 2),
            "remaining_quota": round(remaining, 2),
            "npa_percentage": round(npa, 2),
            "r_score": r_score,
            "officer_name": b.get("officer_name"),
            "officer_phone": b.get("officer_phone"),
            "officer_contact": f"{b.get('officer_name', 'Desk Officer')} ({b.get('officer_phone', '')})",
            "pin_status": pin_status
        })

    processed.sort(key=lambda x: (x["pin_status"] != "RED_PRUNED", x["r_score"]), reverse=True)

    return {
        "applicant_lat": lat,
        "applicant_lon": lon,
        "state_filter": state_code,
        "total_found": len(processed),
        "valid_routes": valid_count,
        "branches": processed
    }
