/**
 * Bulk car seed data for Maruti Suzuki, Mazda, Nissan, Volvo
 * Run via: npx medusa exec ./src/scripts/seed-cars.ts
 */

export type CarVariant = {
  label: string
  fuelType: string
  transmission: string
  exShowroomINR: number
  inventory: number
}

export type CarSeedEntry = {
  brand: string
  categoryName: string      // must match name in product_category table
  model: string             // full model name e.g. "Maruti Suzuki Swift"
  subtitle: string          // e.g. "maruti-suzuki-swift"
  handle: string            // unique slug
  description: string
  variants: CarVariant[]
  images: string[]
  metadata: {
    /** Total inventory for this product (all variants combined) */
    available?: boolean
    category?: string
    inventory?: number
    year?: string
    km_driven?: string
    price?: string
    color?: string
    engine?: string
    mileage?: string
    owner?: string
    city?: string
    vehicle_type?: string
    condition?: string
    features: Record<string, { key: string; value: string }[]>
    specifications: Record<string, { key: string; value: string }[]>
    /** Optional per-product variant filters (e.g. Fuel Type, Transmission, Variant Name) */
    variant_filters?: {
      variants: Array<{
        variant: string
        fuelType: string[]
        transmission: string[]
      }>
    }
  }
}

export const carsSeedData: CarSeedEntry[] = [
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport Ambiente",
    subtitle: "ford-ecosport-ambiente",
    handle: "ford-ecosport-ambiente",
    description:
      "The Ford EcoSport Ambiente is the base variant of the EcoSport lineup, offering a practical and reliable compact SUV experience. Powered by a 1.5L Ti-VCT petrol engine producing around 121 bhp and 150 Nm of torque, it is designed for efficient city and highway driving. The Ambiente variant focuses on essential features, robust build quality, and comfortable ride dynamics, making it an ideal choice for budget-conscious buyers seeking a durable and compact SUV.",
  
    variants: [
      {
        label: "EcoSport Ambiente Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 820000,
        inventory: 5,
      },
      {
        label: "EcoSport Ambiente Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 890000,
        inventory: 4,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 9,
      year: "2020",
      km_driven: "30000",
      price: "820000",
      color: "Silver",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "1st Owner",
      city: "Delhi",
      vehicle_type: "old",
      condition: "good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "no" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "front only" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "no" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "121 bhp (Petrol)" },
          { key: "Torque", value: "150 Nm (Petrol)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "170 km/h" },
          { key: "0-100 km/h", value: "12 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2020" },
          { key: "Kilometers Driven", value: "30000" },
          { key: "Color", value: "Silver" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Delhi" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "820000" },
        ],
      },
  variant_filters: {
    variants: [
          {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }  },
  },
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport Trend",
    subtitle: "ford-ecosport-trend",
    handle: "ford-ecosport-trend",
    description:
      "The Ford EcoSport Trend is a mid-level variant offering a balanced combination of features, performance, and value. Powered by a 1.5L Ti-VCT petrol engine and also available in diesel, it delivers around 121 bhp and 150 Nm of torque. The Trend variant enhances comfort and convenience with additional features like a touchscreen infotainment system, steering-mounted controls, and improved interior quality, making it a practical choice for daily commuting and long drives.",
  
    variants: [
      {
        label: "EcoSport Trend Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 950000,
        inventory: 6,
      },
      {
        label: "EcoSport Trend Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 1050000,
        inventory: 5,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 11,
      year: "2021",
      km_driven: "22000",
      price: "950000",
      color: "Grey",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "1st Owner",
      city: "Mumbai",
      vehicle_type: "old",
      condition: "good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "no" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "121 bhp (Petrol)" },
          { key: "Torque", value: "150 Nm (Petrol)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "175 km/h" },
          { key: "0-100 km/h", value: "11.5 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "22000" },
          { key: "Color", value: "Grey" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Mumbai" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "950000" },
        ],
      },
        variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
         {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }
  
       },
  },
  
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport Titanium",
    subtitle: "ford-ecosport-titanium",
    handle: "ford-ecosport-titanium",
    description:
      "The Ford EcoSport Titanium is a premium mid-variant offering advanced features, strong performance, and a refined driving experience. Powered by a 1.5L Ti-VCT petrol engine delivering around 121 bhp and 149 Nm of torque, and also available in diesel, it offers a smooth and responsive ride. The Titanium variant includes features like touchscreen infotainment, push-button start, automatic climate control, and enhanced safety, making it an ideal choice for buyers seeking comfort and modern technology in a compact SUV.",
  
    variants: [
      {
        label: "EcoSport Titanium Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 1000000,
        inventory: 5,
      },
      {
        label: "EcoSport Titanium Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 1050000,
        inventory: 4,
      },
      {
        label: "EcoSport Titanium Petrol AT",
        fuelType: "Petrol",
        transmission: "Automatic",
        exShowroomINR: 1150000,
        inventory: 3,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 12,
      year: "2021",
      km_driven: "18000",
      price: "1000000",
      color: "White",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "1st Owner",
      city: "Bangalore",
      vehicle_type: "old",
      condition: "good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "automatic climate control" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "121 bhp @6500 rpm (Petrol)" },
          { key: "Torque", value: "149 Nm @4500 rpm (Petrol)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "10.5 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual / Automatic",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "18000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Bangalore" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "1000000" },
        ],
      },
        variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
          {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }
  
       },
  },
  
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport S",
    subtitle: "ford-ecosport-s",
    handle: "ford-ecosport-s",
    description:
      "The Ford EcoSport S is the top sporty variant in the EcoSport lineup, designed for enthusiasts who want a more dynamic driving experience. It features a 1.5L Ti-VCT petrol engine producing around 121 bhp and 149 Nm torque, along with a diesel option delivering strong low-end torque. The S variant stands out with sportier styling, blacked-out elements, premium interiors, and advanced features like a sunroof, push-button start, and enhanced infotainment system. It is ideal for buyers looking for a compact SUV with performance, style, and premium features.",
  
    variants: [
      {
        label: "EcoSport S Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 1099000,
        inventory: 4,
      },
      {
        label: "EcoSport S Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 1149000,
        inventory: 3,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 7,
      year: "2021",
      km_driven: "15000",
      price: "1099000",
      color: "Black",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "1st Owner",
      city: "Hyderabad",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes (sport design)" },
          { key: "Sun-Roof", value: "yes" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (SYNC 3)" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "automatic climate control" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "121 bhp (Petrol) / 100 bhp (Diesel)" },
          { key: "Torque", value: "149 Nm (Petrol) / 215 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "10 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "15000" },
          { key: "Color", value: "Black" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Hyderabad" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "1099000" },
        ],
      },
        variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
          {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }
       },
  },
  
  
  
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport SE",
    subtitle: "ford-ecosport-se",
    handle: "ford-ecosport-se",
    description:
      "The Ford EcoSport SE is a special edition variant positioned between the Titanium and S trims, offering premium features at a more accessible price. Powered by a 1.5L petrol engine producing around 122 PS and a 1.5L diesel engine delivering 100 PS, it combines performance with practicality. The SE variant borrows several premium features from the S variant, including a sunroof, SYNC 3 touchscreen infotainment, and enhanced safety systems, making it a strong value-for-money compact SUV.",
  
    variants: [
      {
        label: "EcoSport SE Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 1049000,
        inventory: 5,
      },
      {
        label: "EcoSport SE Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 1099000,
        inventory: 4,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 9,
      year: "2021",
      km_driven: "17000",
      price: "1049000",
      color: "Blue",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "1st Owner",
      city: "Chennai",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sun-Roof", value: "yes" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (8-inch SYNC 3)" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Side Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "automatic climate control" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
          { key: "Rain Sensing Wipers", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "122 PS (Petrol) / 100 PS (Diesel)" },
          { key: "Torque", value: "149 Nm (Petrol) / 215 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "10.5 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "17000" },
          { key: "Color", value: "Blue" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Chennai" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "1049000" },
        ],
      },
          variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
         {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }
       },
  },
  
  
  
  
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport Trend Plus",
    subtitle: "ford-ecosport-trend-plus",
    handle: "ford-ecosport-trend-plus",
    description:
      "The Ford EcoSport Trend Plus is an upgraded version of the Trend variant, offering additional comfort and convenience features along with improved driving flexibility. Positioned between Trend and Titanium, it includes enhancements like automatic transmission options, improved infotainment, and additional safety features. Powered by a 1.5L petrol and diesel engine, the Trend+ variant provides a balanced mix of performance, practicality, and value, making it ideal for daily commuting and highway driving.",
  
    variants: [
      {
        label: "EcoSport Trend Plus Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 900000,
        inventory: 5,
      },
      {
        label: "EcoSport Trend Plus Petrol AT",
        fuelType: "Petrol",
        transmission: "Automatic",
        exShowroomINR: 977000,
        inventory: 4,
      },
      {
        label: "EcoSport Trend Plus Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 950000,
        inventory: 4,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 13,
      year: "2019",
      km_driven: "25000",
      price: "900000",
      color: "Red",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel)",
      owner: "2nd Owner",
      city: "Pune",
      vehicle_type: "old",
      condition: "good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "manual" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "no" },
          { key: "Keyless Entry", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / Diesel" },
          { key: "Displacement (cc)", value: "1496 / 1498" },
          { key: "Power", value: "121 bhp (Petrol) / 100 bhp (Diesel)" },
          { key: "Torque", value: "149 Nm (Petrol) / 215 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "175 km/h" },
          { key: "0-100 km/h", value: "11 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual / Automatic",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "25000" },
          { key: "Color", value: "Red" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Pune" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "900000" },
        ],
      },
           variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
         {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-signature-edition",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      }
    ]
  }
       },
  },
  
  
  
  
  {
    brand: "Ford",
    categoryName: "Car",
    model: "Ford EcoSport Signature Edition",
    subtitle: "ford-ecosport-signature-edition",
    handle: "ford-ecosport-signature-edition",
    description:
      "The Ford EcoSport Signature Edition is a limited special variant based on the Titanium trim, offering premium styling and additional features. It comes with a sunroof, unique exterior elements, and upgraded interior accents, making it more stylish than the standard variants. Powered by a 1.5L petrol and diesel engine, and in some versions a 1.0L EcoBoost turbo petrol, it delivers a balanced combination of performance and comfort. The Signature Edition is ideal for buyers looking for a premium compact SUV with exclusive design elements and added convenience features.",
  
    variants: [
      {
        label: "EcoSport Signature Petrol",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 1040000,
        inventory: 4,
      },
      {
        label: "EcoSport Signature Diesel",
        fuelType: "Diesel",
        transmission: "Manual",
        exShowroomINR: 1099000,
        inventory: 3,
      },
      {
        label: "EcoSport Signature EcoBoost",
        fuelType: "Petrol",
        transmission: "Manual",
        exShowroomINR: 1100000,
        inventory: 2,
      },
    ],
  
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 9,
      year: "2019",
      km_driven: "22000",
      price: "1040000",
      color: "Blue",
      engine: "1.5L Ti-VCT Petrol / 1.5L Diesel / 1.0L EcoBoost",
      mileage: "15.9 km/l (Petrol) / 21.7 km/l (Diesel) / 18 km/l (EcoBoost)",
      owner: "1st Owner",
      city: "Delhi",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes (17-inch diamond cut)" },
          { key: "Sun-Roof", value: "yes" },
          { key: "Front Fog Lights", value: "yes" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Roof Rails", value: "yes" },
          { key: "Tachometer", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (9-inch Signature system)" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "yes" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "automatic climate control" },
          { key: "Power Windows", value: "all" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Cruise Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
          { key: "Signature Badging", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.5L Ti-VCT Petrol / 1.5L Diesel / 1.0L EcoBoost" },
          { key: "Displacement (cc)", value: "1496 / 1498 / 999" },
          { key: "Power", value: "121 bhp (Petrol) / 100 bhp (Diesel) / 125 PS (EcoBoost)" },
          { key: "Torque", value: "149 Nm (Petrol) / 205 Nm (Diesel) / 170 Nm (EcoBoost)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "52 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "10.5 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "15.9 km/l Petrol / 21.7 km/l Diesel / 18 km/l EcoBoost" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3998 x 1765 x 1647 mm",
          },
          { key: "Wheelbase", value: "2519 mm" },
          { key: "Ground Clearance", value: "200 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "22000" },
          { key: "Color", value: "Blue" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Delhi" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "1040000" },
        ],
      },
           variant_filters: {
    variants: [
      {
        variant: "ford-ecosport-ambiente",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-trend-plus",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-titanium",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual", "Automatic"],
      },
      {
        variant: "ford-ecosport-se",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
      {
        variant: "ford-ecosport-s",
        fuelType: ["Petrol", "Diesel"],
        transmission: ["Manual"],
      },
       ]
  }
       },
  },  
  
  
  
  
  
]
