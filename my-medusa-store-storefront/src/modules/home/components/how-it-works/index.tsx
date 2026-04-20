import { Search, CalendarCheck, Car } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    title: "Find Your Car",
    description: "Browse our extensive inventory of verified premium cars.",
  },
  {
    icon: CalendarCheck,
    title: "Book Test Drive",
    description: "Schedule a free test drive at your convenience.",
  },
  {
    icon: Car,
    title: "Drive Home",
    description: "Complete the paperwork and drive home your dream car.",
  },
]

export default function HowItWorks() {
  return (
    <section className=" bg-white">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Buying a car has never been easier. Follow these three simple steps to own your dream car.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300 relative z-10">
                <step.icon size={32} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border-4 border-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
