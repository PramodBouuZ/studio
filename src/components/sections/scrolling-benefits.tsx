import { CheckCircle, Award } from 'lucide-react';

const benefits = [
  'AI-Powered Vendor Matching',
  'Verified Leads',
  'Seamless Collaboration Tools',
  'Grow Your Business',
  'Expert Support',
  'Secure & Reliable',
  'Earn 10% Commission on Deals',
];

export default function ScrollingBenefits() {
  const repeatedBenefits = [...benefits, ...benefits];

  return (
    <div className="bg-primary text-primary-foreground py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {repeatedBenefits.map((benefit, index) => (
          <div key={index} className="flex items-center mx-6">
            {benefit.includes('Commission') ? (
                <Award className="h-5 w-5 mr-2 text-accent" />
            ) : (
                <CheckCircle className="h-5 w-5 mr-2 text-accent" />
            )}
            <span className="text-md font-medium">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
