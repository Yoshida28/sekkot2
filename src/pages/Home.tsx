import React from 'react';
import { Factory, Settings, Cog, Wrench, Package, Globe, Award, Clock, Users, CheckCircle } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <header className="relative bg-black">
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1565439371131-f5e1c91e7bb0?auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)'
          }}
        />
        <div 
          className="absolute inset-0 z-1"
          style={{
            background: 'linear-gradient(45deg, rgba(76, 29, 149, 0.7), rgba(0, 0, 0, 0.8))'
          }}
        />
        <div className="relative z-10 px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-100">
              Sekkot Engineering Export India
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-xl text-purple-200">
              Precision Engineering Excellence in Manufacturing and Export
            </p>
          </div>
        </div>
      </header>

      {/* Core Capabilities */}
      <section className="py-16 bg-black bg-opacity-95">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-purple-300 sm:text-4xl">
              Core Manufacturing Capabilities
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-400">
              Delivering precision-engineered solutions with state-of-the-art machinery and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Factory className="w-8 h-8" />,
                title: "Coal Forging",
                description: "Advanced forging processes with precise temperature control and superior finish"
              },
              {
                icon: <Settings className="w-8 h-8" />,
                title: "Thread Rolling",
                description: "High-precision thread rolling for superior thread quality and strength"
              },
              {
                icon: <Cog className="w-8 h-8" />,
                title: "VMC & CNC Machining",
                description: "State-of-the-art LD25 machines for complex geometries and tight tolerances"
              },
              {
                icon: <Wrench className="w-8 h-8" />,
                title: "Precision Job Work",
                description: "Custom machining solutions for specialized industrial applications"
              },
              {
                icon: <Package className="w-8 h-8" />,
                title: "OEM Development",
                description: "Comprehensive OEM part development for multiple industrial sectors"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Export Ready",
                description: "Global quality standards and reliable international shipping solutions"
              }
            ].map((capability, index) => (
              <div key={index} className="p-6 bg-gray-900 rounded-lg backdrop-blur-lg bg-opacity-50 border border-purple-900 hover:border-purple-500 transition-all duration-300">
                <div className="text-purple-400">{capability.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-purple-200">{capability.title}</h3>
                <p className="mt-2 text-gray-400">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-to-b from-black to-purple-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: "Quality Assured",
                description: "ISO certified manufacturing processes"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Quick Turnaround",
                description: "Efficient production and delivery systems"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Expert Team",
                description: "Skilled engineers and technicians"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Custom Solutions",
                description: "Tailored to your specific requirements"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center backdrop-blur-sm bg-black bg-opacity-30 p-6 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-600 rounded-full">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-purple-200">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 bg-black">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center text-purple-300">
            Industries We Serve
          </h2>
          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80",
                title: "Automotive",
                description: "Precision components for automotive manufacturers"
              },
              {
                image: "https://images.unsplash.com/photo-1595974482597-4b8dc7ef8c6c?auto=format&fit=crop&q=80",
                title: "Agriculture",
                description: "Durable parts for agricultural machinery"
              },
              {
                image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80",
                title: "Heavy Machinery",
                description: "Robust components for industrial equipment"
              }
            ].map((industry, index) => (
              <div key={index} className="overflow-hidden bg-gray-900 rounded-lg backdrop-blur-lg bg-opacity-50 border border-purple-900 hover:border-purple-500 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={industry.image} 
                    alt={industry.title}
                    className="object-cover w-full h-48 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"/>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-purple-200">{industry.title}</h3>
                  <p className="mt-2 text-gray-400">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-black">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-purple-200 sm:text-4xl">
              Ready to Partner with Excellence?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-purple-100">
              Contact us today to discuss your manufacturing needs and discover how we can deliver precision-engineered solutions for your business.
            </p>
            <button className="px-8 py-3 mt-8 text-lg font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-300">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-300">Sekkot Engineering Export India</h2>
            <p className="mt-2 text-gray-500">Excellence in Manufacturing Since 1995</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;