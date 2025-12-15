import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Upload,
  FileText,
  Award
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Your Materials',
      description: 'Simply upload your study notes, PDFs, or documents and let AI do the rest.',
    },
    {
      icon: Brain,
      title: 'AI-Generated Exams',
      description: 'Advanced AI creates relevant questions tailored to your content.',
    },
    {
      icon: Target,
      title: 'Adaptive Difficulty',
      description: 'Choose from easy, medium, or hard questions to match your skill level.',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate results with detailed explanations for each answer.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with comprehensive analytics and insights.',
    },
    {
      icon: Award,
      title: 'Multiple Question Types',
      description: 'Practice with MCQs, True/False, Identification, and Short Answer questions.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '50,000+', label: 'Exams Generated' },
    { value: '98%', label: 'Success Rate' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Medical Student',
      content: 'ExamGenie helped me ace my finals! The AI-generated questions were spot-on and the instant feedback was incredibly helpful.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Major',
      content: 'Best study tool I\'ve ever used. Being able to turn my notes into practice exams saved me so much time.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Law Student',
      content: 'The analytics feature is game-changing. I can see exactly where I need to improve and focus my studying.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '5 exams per month',
        'Basic question types',
        'Standard difficulty',
        'Basic analytics',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited exams',
        'All question types',
        'All difficulty levels',
        'Advanced analytics',
        'Priority support',
        'Export results',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$49.99',
      period: 'per month',
      features: [
        'Everything in Premium',
        'Up to 10 team members',
        'Shared exam library',
        'Team analytics',
        'Admin dashboard',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-dark-900 dark:to-dark-800 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Transform Your Study
              <span className="block text-gradient">Materials Into Exams</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload your notes and let AI create personalized practice exams. 
              Study smarter, not harder, and ace your exams with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="#features" className="btn-outline inline-flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Powerful Features for Better Learning</h2>
            <p className="section-subtitle">
              Everything you need to prepare for your exams in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card hover:shadow-xl transition-shadow group">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload', description: 'Upload your study materials in PDF format', icon: FileText },
              { step: '2', title: 'Generate', description: 'AI creates customized practice exams', icon: Brain },
              { step: '3', title: 'Practice', description: 'Take exams and track your progress', icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <Icon className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Join thousands of successful students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{testimonial.content}</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Choose the plan that's right for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card ${
                  plan.highlighted
                    ? 'ring-2 ring-primary-600 dark:ring-primary-400 transform scale-105'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === 'Free' ? '/signup' : '/premium'}
                  className={`block text-center ${
                    plan.highlighted ? 'btn-primary' : 'btn-outline'
                  } w-full`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">Ready to Ace Your Exams?</h2>
          <p className="section-subtitle">
            Join thousands of students who are already studying smarter with ExamGenie
          </p>
          <Link to="/signup" className="btn-primary inline-flex items-center">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;