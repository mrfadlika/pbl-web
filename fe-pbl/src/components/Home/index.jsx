import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Bell,
  User,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All" },
    { id: "wallet", name: "Wallet" },
    { id: "bag", name: "Bag" },
    { id: "phone", name: "Phone" },
    { id: "watch", name: "Watch" },
    { id: "keys", name: "Keys" },
    { id: "laptop", name: "Laptop" },
    { id: "id", name: "ID Card" },
  ];

  const foundItems = [
    {
      id: 1,
      type: "wallet",
      title: "Brown Leather Wallet",
      location: "Central Library, 2nd Floor",
      time: "3 hours ago",
      image: "https://placehold.co/400x300/967259/FFFFFF?text=Wallet",
    },
    {
      id: 2,
      type: "laptop",
      title: 'MacBook Pro 14"',
      location: "Science Building, Room 204",
      time: "5 hours ago",
      image: "https://placehold.co/400x300/999999/FFFFFF?text=MacBook",
    },
    {
      id: 3,
      type: "laptop",
      title: "Dell XPS 15",
      location: "Student Center, 1st Floor",
      time: "7 hours ago",
      image: "https://placehold.co/400x300/333333/FFFFFF?text=Dell+XPS",
    },
    {
      id: 4,
      type: "keys",
      title: "Car Keys with Green Keychain",
      location: "Parking Lot B",
      time: "12 hours ago",
      image: "https://placehold.co/400x300/22cc88/FFFFFF?text=Keys",
    },
  ];

  const lostItems = [
    {
      id: 5,
      type: "phone",
      title: "iPhone 15 Pro (Black)",
      location: "Sports Center",
      time: "2 hours ago",
      image: "https://placehold.co/400x300/111111/FFFFFF?text=iPhone",
    },
    {
      id: 6,
      type: "bag",
      title: "Blue Backpack",
      location: "Bus Stop Near North Gate",
      time: "8 hours ago",
      image: "https://placehold.co/400x300/3366cc/FFFFFF?text=Backpack",
    },
    {
      id: 7,
      type: "laptop",
      title: "Lenovo ThinkPad",
      location: "Engineering Building, Lab 3",
      time: "1 day ago",
      image: "https://placehold.co/400x300/444444/FFFFFF?text=ThinkPad",
    },
    {
      id: 8,
      type: "watch",
      title: "Silver Watch",
      location: "Gym Locker Room",
      time: "1 day ago",
      image: "https://placehold.co/400x300/cccccc/333333?text=Watch",
    },
  ];

  const matchedItems = [
    {
      id: 9,
      lost: {
        title: "AirPods Pro",
        user: "Sarah L.",
        date: "May 7, 2025",
      },
      found: {
        title: "AirPods Pro in White Case",
        user: "Mike T.",
        date: "May 8, 2025",
      },
      image: "https://placehold.co/400x300/ffffff/333333?text=AirPods",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="bg-white text-indigo-600 px-2 py-1 rounded">
                  Find
                </span>
                <span className="ml-1">It</span>
              </div>
            </div>
            <nav className="hidden md:flex gap-6 items-center">
              <a
                href="#"
                className="hover:text-indigo-200 transition font-medium"
              >
                List
              </a>
              <a
                href="#"
                className="hover:text-indigo-200 transition font-medium"
              >
                Minfess
              </a>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                Lost something? <br />
                Found something?
              </h1>
              <p className="text-indigo-100 mb-6 text-lg">
                We connect people who lost items with those who found them. A
                simple way to help each other and make someone's day better.
              </p>
            </div>

            <div className="md:w-1/2 relative flex justify-center">
              <div className="absolute -bottom-16 md:right-0 w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for lost or found items..."
                    className="w-full py-4 px-6 rounded-full shadow-lg border-0 focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="container mx-auto px-4 mt-24 md:mt-5 mb-12">
        <div className="relative">
          <div className="flex justify-center">
            <div className="flex overflow-x-auto scrollbar-hide py-2 gap-2 px-2 max-w-full">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-5 py-2.5 whitespace-nowrap rounded-full transition flex-shrink-0 ${
                    activeTab === category.id
                      ? "bg-indigo-600 text-white font-medium shadow-md"
                      : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                  }`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Found Items */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recently Found Items
          </h2>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-1.5 text-sm">
                  <MapPin size={16} className="mr-1.5 text-indigo-600" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock size={16} className="mr-1.5 text-indigo-600" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lost Items */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recently Lost Items
          </h2>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lostItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-1.5 text-sm">
                  <MapPin size={16} className="mr-1.5 text-red-500" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock size={16} className="mr-1.5 text-red-500" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These items were successfully returned to their owners thanks to our
            community members.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {matchedItems.map((match) => (
            <div
              key={match.id}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                      src={match.image}
                      alt={match.lost.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                      Mission Complete!
                    </span>
                    <Bell className="ml-2 text-yellow-500" size={18} />
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <p className="font-medium text-gray-800">
                      Lost by {match.lost.user} on {match.lost.date}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {match.lost.title}
                    </h3>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="font-medium text-gray-800">
                      Found by {match.found.user} on {match.found.date}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {match.found.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === 1 ? "bg-indigo-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-8 md:p-12 shadow-xl text-white">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">
                Lost or Found Something?
              </h2>
              <p className="mb-6 text-indigo-100">
                Report it now and help someone reunite with their belongings.
                Even small actions can make a big difference in someone's day!
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-indigo-700 hover:bg-indigo-50 transition px-6 py-3 rounded-lg font-semibold shadow-md">
                  Report Lost Item
                </button>
                <button className="bg-indigo-800 text-white hover:bg-indigo-900 transition px-6 py-3 rounded-lg font-semibold shadow-md">
                  Report Found Item
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://placehold.co/600x400/67b3ff/FFFFFF?text=Community"
                alt="Community helping each other"
                className="rounded-xl max-h-64 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                <span className="bg-white text-indigo-600 px-2 py-1 rounded">
                  Find
                </span>
                <span className="ml-1">It</span>
              </div>
              <p className="mb-4">
                Connecting people who lost items with those who found them.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Report Lost Item
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Report Found Item
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Lost Items
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Found Items
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">
                Subscribe to get updates on new features and success stories.
              </p>
              <form className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition w-full">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 FindIt. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
