// mock.js
export const bookings = [
  {
    id: 1,
    route: "Addis Ababa → Hawassa",
    travel_date: "2025-09-05",
    seat_no: "12A",
    station_name: "Selam Bus",
    station_rating: 4
  },
  {
    id: 2,
    route: "Adama → Bahir Dar",
    travel_date: "2025-09-10",
    seat_no: "7B",
    station_name: "Oda Bus",
    station_rating: 5
  },
  {
    id: 3,
    route: "Hawassa → Arba Minch",
    travel_date: "2025-09-12",
    seat_no: "3C",
    station_name: "Abay Bus",
    station_rating: 3
  }
];

// later you can add more mocks like busStations, availableBuses, etc.

// Mock.js
export const busStations = [
  {
    id: 1,
    name: "Selam Bus",
    route: "Addis Ababa → Hossana",
    rating: 4,
    contact: "0912 345 678",
    notes: "Fast and comfortable buses",
    amenities: ["Free Wi-Fi", "Air-conditioned waiting area", "Clean restrooms"],
    offers: ["10% off for students", "Buy 1 get 1 free on weekends"],
    testimonials: [
      { name: "Mulugeta", review: "Comfortable ride and punctual service." },
      { name: "Sofia", review: "Great value for money and friendly staff." }
    ]
  },
  {
    id: 2,
    name: "Oda Bus",
    route: "Addis Ababa → Bahir Dar",
    rating: 5,
    contact: "0911 987 654",
    notes: "Reliable service with online booking",
    amenities: ["Free Wi-Fi", "Charging ports", "Refreshments available"],
    offers: ["15% off for first-time users", "Weekend special: 20% off"],
    testimonials: [
      { name: "Tesfaye", review: "Seamless booking experience and timely departure." },
      { name: "Amina", review: "Comfortable seats and excellent service." }
    ]
  },
  {
    id: 3,
    name: "Sky Bus",
    route: "Addis Ababa → Mekelle",
    rating: 3,
    contact: "0920 112 233",
    notes: "Affordable and safe",
    amenities: ["Basic amenities", "Affordable fares", "Safety assured"],
    offers: ["Affordable fares for all", "Group discounts available"],
    testimonials: [
      { name: "Hassan", review: "Budget-friendly and safe travel option." },
      { name: "Lily", review: "Good service for the price." }
    ]
  }
];

export const routes = [
  {
    id: 1,
    from: "Addis Ababa",
    to: "Hawassa",
    duration: "5h 30m",
    distance: "275 km",
    buses_available: 5,
    fare: "ETB 250"
  },
  {
    id: 2,
    from: "Addis Ababa",
    to: "Bahir Dar",
    duration: "10h",
    distance: "565 km",
    buses_available: 3,
    fare: "ETB 500"
  },
  {
    id: 3,
    from: "Adama",
    to: "Dire Dawa",
    duration: "7h",
    distance: "330 km",
    buses_available: 4,
    fare: "ETB 350"
  }
];

export const userProfile = {
  name: "Honelign Yohannes",
  email: "honelign@example.com",
  phone: "0912 345 678",
  member_since: "2024-06-01",
  profile_picture: "https://via.placeholder.com/150",
  total_bookings: 12,
  favorite_routes: ["Addis Ababa → Hawassa", "Addis Ababa → Bahir Dar"]
};

export const availableBuses={

}


