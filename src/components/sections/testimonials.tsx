import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonials } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          What Our Customers Say
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
          Hear from businesses who have found success through our platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => {
          const image = PlaceHolderImages.find((img) => img.id === testimonial.imageId);
          const nameInitials = testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('');

          return (
            <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardContent className="p-6 flex-grow flex flex-col justify-between">
                <blockquote className="text-lg text-foreground mb-6 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    {image && (
                      <AvatarImage
                        src={image.imageUrl}
                        alt={testimonial.name}
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <AvatarFallback>{nameInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
