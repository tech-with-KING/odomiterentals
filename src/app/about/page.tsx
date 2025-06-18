import Image from "next/image"
import { Building, Rocket, Globe, Users, Code, Handshake, Lightbulb, Award, Target, Heart } from "lucide-react"
import NewsletterSection from "@/components/newsletter"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">About DevConnect</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg lg:text-xl leading-relaxed mb-6">
              DevConnect is the leading online platform connecting businesses with top-tier freelance software
              developers. Our mission is to empower businesses to innovate and grow by providing access to a global
              network of skilled professionals. We strive to create a seamless and efficient experience for both clients
              and developers, fostering collaboration and delivering exceptional results.
            </p>
            <p className="text-base lg:text-lg leading-relaxed mb-6">
              Since our founding in 2018, we've facilitated over 50,000 successful projects, connecting more than 25,000
              developers with businesses across 150+ countries. Our platform specializes in matching the right talent
              with the right projects, ensuring quality outcomes and long-term partnerships.
            </p>
            <p className="text-base lg:text-lg leading-relaxed">
              We believe that great software is built by great people, and our commitment to excellence drives
              everything we do. From rigorous developer vetting to comprehensive project management tools, we provide
              the infrastructure needed for successful remote collaboration.
            </p>
          </div>
        </div>

        {/* Our Team Section */}
        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Sarah Chen, CEO"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Sarah Chen</h3>
              <p className="text-sm text-gray-600 mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Former VP of Engineering at TechCorp. 15+ years building scalable platforms and leading distributed
                teams.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="David Rodriguez, CTO"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">David Rodriguez</h3>
              <p className="text-sm text-gray-600 mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Full-stack architect with expertise in cloud infrastructure. Previously led engineering at three
                successful startups.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Emily Carter, Head of Product"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Emily Carter</h3>
              <p className="text-sm text-gray-600 mb-2">Head of Product</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Product strategist with a passion for user experience. Former product lead at major SaaS companies.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Michael Lee, Head of Engineering"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Michael Lee</h3>
              <p className="text-sm text-gray-600 mb-2">Head of Engineering</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Systems engineer focused on platform reliability and performance. Expert in microservices and DevOps
                practices.
              </p>
            </div>
          </div>
        </section>

        {/* Our History Section */}
        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Our Journey</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-px bg-gray-300 h-16 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Company Founded</h3>
                  <span className="text-sm text-gray-600 font-medium">2018</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  DevConnect was founded by Sarah Chen and David Rodriguez with a vision to revolutionize how businesses
                  find and work with freelance developers. Starting with a small team of 5 people in San Francisco.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-green-600" />
                </div>
                <div className="w-px bg-gray-300 h-16 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Launch</h3>
                  <span className="text-sm text-gray-600 font-medium">2019</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  After a year of development, we launched our beta platform with 500 vetted developers and secured our
                  first 100 client projects. Introduced our proprietary matching algorithm and project management tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div className="w-px bg-gray-300 h-16 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Global Expansion</h3>
                  <span className="text-sm text-gray-600 font-medium">2020</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Expanded our services globally, reaching developers in over 50 countries. Launched specialized tracks
                  for mobile development, AI/ML, and blockchain technologies. Reached 5,000 active developers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="w-px bg-gray-300 h-16 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Series A Funding</h3>
                  <span className="text-sm text-gray-600 font-medium">2021</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Raised $15M in Series A funding led by Venture Partners. Expanded team to 50+ employees and launched
                  enterprise solutions for Fortune 500 companies. Introduced AI-powered project matching.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Industry Recognition</h3>
                  <span className="text-sm text-gray-600 font-medium">2022-Present</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Named "Best Freelance Platform" by TechReview Magazine. Reached 25,000+ developers and 10,000+
                  completed projects. Launched DevConnect Academy for continuous learning and certification programs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We believe in the power of teamwork and open communication. Great software is built when talented people
                work together towards a common goal.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We are committed to delivering high-quality solutions and exceeding expectations. Every project is an
                opportunity to showcase exceptional craftsmanship.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We uphold the highest ethical standards in all our interactions. Trust is the foundation of every
                successful partnership we build.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We embrace creativity and continuously seek new ways to improve and grow. Innovation drives us to push
                boundaries and explore new possibilities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission & Vision Section */}
        <section className="mb-12 lg:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To democratize access to world-class software development talent, enabling businesses of all sizes to
                build exceptional digital products. We bridge the gap between ambitious projects and skilled developers,
                creating opportunities for innovation and growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the global standard for remote software development collaboration, where the best talent meets
                the most exciting projects. We envision a world where geographical boundaries don't limit innovation and
                creativity.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12 lg:mb-16">
          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">DevConnect by the Numbers</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">25,000+</div>
                <div className="text-sm text-gray-600">Vetted Developers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">50,000+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">150+</div>
                <div className="text-sm text-gray-600">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
      <NewsletterSection />
    </div>
  )
}
