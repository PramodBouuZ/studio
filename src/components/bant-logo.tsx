import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const BANTLogo = ({ className, textClassName }: { className?: string; textClassName?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckCircle className="h-8 w-8 text-primary" />
      <span className={cn('text-2xl font-bold font-headline', textClassName)}>
        <span className="text-primary">BANT</span><span className="text-accent">Confirm</span>
      </span>
    </div>
  );
};

export default BANTLogo;
