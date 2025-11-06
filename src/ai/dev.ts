import { config } from 'dotenv';
config();

import '@/ai/flows/refine-customer-inquiry.ts';
import '@/ai/flows/improve-lead-qualification.ts';
import '@/ai/flows/generate-content.ts';
