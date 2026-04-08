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
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20",
    subtitle: "hyundai-elite-i20",
    handle: "hyundai-elite-i20",
    description:
      "The Hyundai Elite i20 is a premium hatchback known for its stylish design, feature-rich cabin, and refined performance. It comes with petrol and diesel engine options, offering a balance of power and fuel efficiency. With premium features like a touchscreen infotainment system, automatic climate control, and a comfortable interior, the Elite i20 is ideal for both city commutes and long drives.",
  
    variants: [
      ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 10,
      year: "2021",
      km_driven: "25000",
      price: "750000",
      color: "Blue",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "1st Owner",
      city: "Noida",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sunroof", value: "no" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (7-inch)" },
          { key: "Android Auto / Apple CarPlay", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Automatic Climate Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
          { key: "Steering Mounted Controls", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "11-13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual / CVT Automatic",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "25000" },
          { key: "Color", value: "Blue" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Noida" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "750000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          }
        ]
      }
    },
  },
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Era",
    subtitle: "hyundai-elite-i20-era",
    handle: "hyundai-elite-i20-era",
    description:
      "The Hyundai Elite i20 Era is the base variant of the Elite i20 lineup, offering essential features with Hyundai’s reliability and refined performance. Powered by a 1.2L petrol and 1.4L diesel engine, it delivers a comfortable driving experience with good fuel efficiency. The Era variant is ideal for budget-conscious buyers looking for a premium hatchback feel with practical features for daily commuting.",
  
    variants: [
      ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2020",
      km_driven: "32000",
      price: "650000",
      color: "White",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "2nd Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sunroof", value: "no" },
          { key: "Halogen Headlamps", value: "yes" },
          { key: "Infotainment System", value: "basic audio system" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Power Windows Front", value: "yes" },
          { key: "Manual AC", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "175 km/h" },
          { key: "0-100 km/h", value: "13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
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
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2020" },
          { key: "Kilometers Driven", value: "32000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "650000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          }
        ]
      }
    },
  },
  
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Magna",
    subtitle: "hyundai-elite-i20-magna",
    handle: "hyundai-elite-i20-magna",
    description:
      "The Hyundai Elite i20 Magna is a mid-level variant that offers a perfect balance of affordability and essential features. Powered by a 1.2L petrol and 1.4L diesel engine options, it delivers reliable performance and good fuel efficiency. The Magna variant includes practical features like power windows, central locking, infotainment system compatibility, and improved interior comfort, making it a great choice for daily commuting.",
  
    variants: [
      ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2021",
      km_driven: "20000",
      price: "720000",
      color: "Grey",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "1st Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "Touchscreen Infotainment", value: "optional" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Power Windows", value: "yes" },
          { key: "Central Locking", value: "yes" },
          { key: "Manual AC", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "175 km/h" },
          { key: "0-100 km/h", value: "12-13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual / CVT",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "20000" },
          { key: "Color", value: "Grey" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "720000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          }
        ]
      }
    },
  },
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Sportz",
    subtitle: "hyundai-elite-i20-sportz",
    handle: "hyundai-elite-i20-sportz",
    description:
      "The Hyundai Elite i20 Sportz is a mid-range variant that offers a great balance of features, performance, and value. Powered by a 1.2L petrol or 1.4L diesel engine, it delivers smooth driving performance and good fuel efficiency. The Sportz variant comes with features like a touchscreen infotainment system, steering-mounted controls, rear camera, and enhanced comfort, making it a practical and feature-rich choice for daily driving.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 7,
      year: "2021",
      km_driven: "22000",
      price: "780000",
      color: "Grey",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "1st Owner",
      city: "Delhi",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (7-inch)" },
          { key: "Android Auto / Apple CarPlay", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Steering Mounted Controls", value: "yes" },
          { key: "Manual Air Conditioning", value: "yes" },
          { key: "Keyless Entry", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "11-13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
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
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "22000" },
          { key: "Color", value: "Grey" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Delhi" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "780000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          }
        ]
      }
    },
  },
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Asta",
    subtitle: "hyundai-elite-i20-asta",
    handle: "hyundai-elite-i20-asta",
    description:
      "The Hyundai Elite i20 Asta is a premium mid-top variant that offers a perfect balance of features, comfort, and performance. Powered by refined petrol and diesel engine options, it delivers smooth driving and good fuel efficiency. The Asta variant comes equipped with premium features like touchscreen infotainment, automatic climate control, push-button start, and enhanced safety features, making it an ideal choice for urban drivers seeking comfort and value.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2021",
      km_driven: "20000",
      price: "820000",
      color: "White",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "1st Owner",
      city: "Ghaziabad",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sunroof", value: "no" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (7-inch)" },
          { key: "Android Auto / Apple CarPlay", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Automatic Climate Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
          { key: "Steering Mounted Controls", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "11-13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
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
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "20000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Ghaziabad" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "820000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          }
        ]
      }
    },
  },
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Asta(O)",
    subtitle: "hyundai-elite-i20-astao",
    handle: "hyundai-elite-i20-astao",
    description:
      "The Hyundai Elite i20 Asta(O) is the top-end variant of the Elite i20 lineup, offering premium features, enhanced comfort, and advanced safety. Powered by refined petrol and diesel engines, it delivers smooth performance along with excellent fuel efficiency. The Asta(O) variant stands out with features like projector headlamps, touchscreen infotainment system, push-button start, automatic climate control, and premium interiors, making it one of the most feature-rich hatchbacks in its segment.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2021",
      km_driven: "20000",
      price: "900000",
      color: "White",
      engine: "1.2L Petrol / 1.4L Diesel",
      mileage: "18 - 25 km/l",
      owner: "1st Owner",
      city: "Delhi",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "yes" },
          { key: "Sunroof", value: "no" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "LED DRLs", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (7-inch)" },
          { key: "Android Auto / Apple CarPlay", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "yes" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Automatic Climate Control", value: "yes" },
          { key: "Push Button Start", value: "yes" },
          { key: "Smart Key", value: "yes" },
          { key: "Steering Mounted Controls", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol / 1.4L Diesel" },
          { key: "Displacement (cc)", value: "1197 / 1396" },
          { key: "Power", value: "83 bhp (Petrol) / 90 bhp (Diesel)" },
          { key: "Torque", value: "114 Nm / 220 Nm (Diesel)" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "180 km/h" },
          { key: "0-100 km/h", value: "11-13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "18 - 25 km/l" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "Manual / CVT Automatic",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "20000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Delhi" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "900000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna-cvt",
            fuelType: ["Petrol"],
            transmission: ["Automatic"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          }
        ]
      }
    },
  },
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Elite i20 Magna CVT",
    subtitle: "hyundai-elite-i20-magna-cvt",
    handle: "hyundai-elite-i20-magna-cvt",
    description:
      "The Hyundai Elite i20 Magna CVT is a mid-range automatic variant offering a perfect balance of convenience, comfort, and affordability. Powered by a 1.2L petrol engine paired with a smooth CVT automatic transmission, it delivers a relaxed and efficient driving experience. The Magna CVT comes with essential features like touchscreen infotainment, rear parking sensors, and good cabin space, making it ideal for city driving.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2021",
      km_driven: "20000",
      price: "820000",
      color: "Grey",
      engine: "1.2L Petrol",
      mileage: "17 km/l (CVT)",
      owner: "1st Owner",
      city: "Ghaziabad",
      vehicle_type: "old",
      condition: "excellent",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Projector Headlamps", value: "yes" },
          { key: "Touchscreen Infotainment", value: "yes (7-inch)" },
          { key: "Android Auto / Apple CarPlay", value: "yes" },
          { key: "Bluetooth Connectivity", value: "yes" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Automatic Climate Control", value: "no" },
          { key: "Push Button Start", value: "no" },
          { key: "Steering Mounted Controls", value: "yes" },
          { key: "ABS", value: "yes" },
          { key: "Airbags", value: "Dual Front Airbags" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "1.2L Petrol" },
          { key: "Displacement (cc)", value: "1197" },
          { key: "Power", value: "83 bhp @ 6000 rpm" },
          { key: "Torque", value: "114 Nm @ 4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "45 Liters" },
          { key: "Boot Space", value: "285 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "170 km/h" },
          { key: "0-100 km/h", value: "13 sec" },
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "17 km/l (CVT)" },
        ],
  
        Transmission: [
          {
            key: "Transmission Type",
            value: "CVT Automatic",
          },
        ],
  
        Dimensions: [
          {
            key: "Length x Width x Height",
            value: "3985 x 1734 x 1505 mm",
          },
          { key: "Wheelbase", value: "2570 mm" },
          { key: "Ground Clearance", value: "165 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2021" },
          { key: "Kilometers Driven", value: "20000" },
          { key: "Color", value: "Grey" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Ghaziabad" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "820000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-elite-i20-era",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-magna",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-sportz",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-asta",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-elite-i20-astao",
            fuelType: ["Petrol", "Diesel"],
            transmission: ["Manual"],
          }
        ]
      }
    },
  },
  
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon",
    subtitle: "hyundai-eon",
    handle: "hyundai-eon",
    description:
      "The Hyundai Eon is an entry-level hatchback designed for budget-conscious buyers looking for a reliable and fuel-efficient city car. Powered by a 0.8L petrol engine, it offers decent performance for urban driving along with low maintenance costs. With compact dimensions, simple features, and good mileage, the Eon is ideal for first-time car buyers and daily commuting.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 15,
      year: "2019",
      km_driven: "35000",
      price: "350000",
      color: "Silver",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "2nd Owner",
      city: "Kanpur",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "no" },
          { key: "LED DRLs", value: "no" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "front only" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "135 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "35000" },
          { key: "Color", value: "Silver" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Kanpur" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "350000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-dlite",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-era",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magna",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magnaplus",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-sportz",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  },
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon Era",
    subtitle: "hyundai-eon-era",
    handle: "hyundai-eon-era",
    description:
      "The Hyundai Eon Era is a mid-entry variant offering essential features with improved comfort over the base model. Powered by a 0.8L petrol engine, it delivers reliable performance and excellent fuel efficiency for city commuting. The Era variant adds basic convenience features like air conditioning, power steering, and improved interior quality, making it a practical choice for daily use.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 5,
      year: "2019",
      km_driven: "32000",
      price: "340000",
      color: "White",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "2nd Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "no" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Immobilizer", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "no" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "no" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "135 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "32000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "340000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-dlite",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magna",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magnaplus",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-sportz",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  },
  
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon Magna",
    subtitle: "hyundai-eon-magna",
    handle: "hyundai-eon-magna",
    description:
      "The Hyundai Eon Magna is a mid-range variant of the Eon lineup, offering a balance of affordability and essential comfort features. Powered by a 0.8L petrol engine, it delivers reliable performance for city driving along with good fuel efficiency. The Magna variant adds features like power steering, air conditioning, front power windows, and improved interior comfort, making it a practical choice for daily commuting.",
  
    variants: [
        ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 7,
      year: "2019",
      km_driven: "30000",
      price: "380000",
      color: "White",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "1st Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "no" },
          { key: "LED DRLs", value: "no" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Immobilizer", value: "yes" },
          { key: "Child Safety Locks", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "front only" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "135 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "30000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "1st Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "380000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-era",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-dlite",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-sportz",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magnaplus",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  },
  
  
  
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon D-Lite",
    subtitle: "hyundai-eon-dlite",
    handle: "hyundai-eon-dlite",
    description:
      "The Hyundai Eon D-Lite is the base variant of the Eon lineup, designed for budget-conscious buyers who need a simple and reliable city car. Powered by a 0.8L petrol engine, it offers basic mobility with excellent fuel efficiency and low maintenance cost. The D-Lite focuses on essential functionality, making it ideal for first-time car owners and daily commuting.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 6,
      year: "2018",
      km_driven: "42000",
      price: "300000",
      color: "White",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "2nd Owner",
      city: "Kanpur",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "no" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "no" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "no" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "130 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2018" },
          { key: "Kilometers Driven", value: "42000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Kanpur" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "300000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-era",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magna",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magnaplus",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-sportz",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  },
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon Sportz",
    subtitle: "hyundai-eon-sportz",
    handle: "hyundai-eon-sportz",
    description:
      "The Hyundai Eon Sportz is the top-end variant of the Eon lineup, offering improved comfort, styling, and convenience features over lower variants. Powered by a 0.8L petrol engine, it delivers smooth performance for city driving along with good fuel efficiency. The Sportz variant adds features like front power windows, central locking, and a more refined interior, making it a better-equipped choice for daily commuting.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 3,
      year: "2019",
      km_driven: "30000",
      price: "420000",
      color: "White",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "2nd Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Immobilizer", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "front" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "135 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "30000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "420000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-era",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magna",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-dlite",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magnaplus",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  },
  
  
  
  
  {
    brand: "Hyundai",
    categoryName: "Car",
    model: "Hyundai Eon Magna+",
    subtitle: "hyundai-eon-magnaplus",
    handle: "hyundai-eon-magnaplus",
    description:
      "The Hyundai Eon Magna+ is a higher mid-variant in the Eon lineup, offering better comfort and convenience features compared to lower trims. Powered by a 0.8L petrol engine, it provides smooth city performance and excellent fuel efficiency. The Magna+ variant adds features like front power windows, central locking, improved interiors, and better practicality, making it a great choice for daily commuting.",
  
    variants: [
       ],
  
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1609520505214-6c7c49dff8e5",
      "https://images.unsplash.com/photo-1597007030739-6d2e3f7c3b4b"
    ],
  
    metadata: {
      available: true,
      category: "Car",
      inventory: 4,
      year: "2019",
      km_driven: "30000",
      price: "400000",
      color: "White",
      engine: "0.8L Petrol Engine",
      mileage: "20.3 km/l",
      owner: "2nd Owner",
      city: "Lucknow",
      vehicle_type: "old",
      condition: "Good",
  
      features: {
        General: [
          { key: "Alloy Wheels", value: "no" },
          { key: "Sun-Roof", value: "no" },
          { key: "Front Fog Lights", value: "no" },
          { key: "Rear Spoiler", value: "yes" },
          { key: "Touchscreen Infotainment", value: "no" },
          { key: "Bluetooth Connectivity", value: "no" },
          { key: "Rear Parking Camera", value: "no" },
          { key: "Rear Parking Sensors", value: "yes" },
          { key: "Anti-Lock Braking System", value: "yes" },
          { key: "Driver Air-Bags", value: "yes" },
          { key: "Passenger Air-Bags", value: "no" },
          { key: "Immobilizer", value: "yes" },
          { key: "Air Conditioner", value: "yes" },
          { key: "Power Windows", value: "front" },
          { key: "Power Steering", value: "yes" },
          { key: "Central Locking", value: "yes" },
        ],
      },
  
      specifications: {
        Engine: [
          { key: "Engine Type", value: "0.8L Petrol" },
          { key: "Displacement (cc)", value: "814" },
          { key: "Power", value: "55 bhp @5500 rpm" },
          { key: "Torque", value: "75 Nm @4000 rpm" },
        ],
  
        Capacities: [
          { key: "Seating Capacity", value: "5" },
          { key: "Fuel Tank", value: "32 Liters" },
        ],
  
        Performance: [
          { key: "Top Speed", value: "135 km/h" }
        ],
  
        "Fuel Economy": [
          { key: "Mileage Overall", value: "20.3 km/l" }
        ],
  
        Transmission: [
          { key: "Transmission Type", value: "5-Speed Manual" }
        ],
  
        Dimensions: [
          { key: "Length x Width x Height", value: "3495 x 1550 x 1500 mm" },
          { key: "Wheelbase", value: "2380 mm" },
          { key: "Ground Clearance", value: "170 mm" },
        ],
  
        Overview: [
          { key: "Year", value: "2019" },
          { key: "Kilometers Driven", value: "30000" },
          { key: "Color", value: "White" },
          { key: "Owner", value: "2nd Owner" },
          { key: "City", value: "Lucknow" },
          { key: "Car Type", value: "used" },
          { key: "Price (INR)", value: "400000" },
        ],
      },
  
      variant_filters: {
        variants: [
          {
            variant: "hyundai-eon-dlite",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-era",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-magna",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          },
          {
            variant: "hyundai-eon-sportz",
            fuelType: ["Petrol"],
            transmission: ["Manual"],
          }
        ],
      },
    },
  }
  
  
  
]
