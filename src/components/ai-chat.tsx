'use client';

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { Button } from './ui/button';
import { MessageSquare, X, Send, Loader2, UserPlus, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Textarea } from './ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { refineCustomerInquiry, RefineCustomerInquiryOutput } from '@/ai/flows/refine-customer-inquiry';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { type Lead } from '@/lib/data';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

interface AIChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  highlightedProductIds: string[];
  setHighlightedProductIds: (ids: string[]) => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};

export const AIChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedProductIds, setHighlightedProductIds] = useState<string[]>([]);
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <AIChatContext.Provider value={{ isOpen, openChat, closeChat, highlightedProductIds, setHighlightedProductIds }}>
      {children}
      <AIChat />
    </AIChatContext.Provider>
  );
};


function AIChat() {
  const { isOpen, closeChat, openChat, setHighlightedProductIds } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [inquirySummary, setInquirySummary] = useState<string | null>(null);

  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if(isOpen && messages.length === 0){
        setLoading(true);
        refineCustomerInquiry({ inquiry: '', isNewConversation: true }).then((output) => {
            setMessages([{ role: 'assistant', content: output.refinedInquiry }]);
        }).finally(() => setLoading(false));
        setIsNewConversation(true);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
        const conversationHistory = newMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
        const result: RefineCustomerInquiryOutput = await refineCustomerInquiry({ inquiry: conversationHistory, isNewConversation: isNewConversation && newMessages.length <= 1 });

        setMessages(prev => [...prev, { role: 'assistant', content: result.refinedInquiry }]);
        
        if (result.suggestedProductIds && result.suggestedProductIds.length > 0) {
            setHighlightedProductIds(result.suggestedProductIds);
        }

        if (result.isFinished) {
            setInquirySummary(result.summaryForAdmin || 'Customer needs follow-up.');
            if (!user) {
              setAuthModalOpen(true);
            } else {
              await saveLead(result.summaryForAdmin || 'Customer needs follow-up.');
            }
        }
        setIsNewConversation(false);

    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
        setLoading(false);
    }
  };

  const saveLead = async (summary: string) => {
    if (!user || !firestore) return;

    const leadRef = doc(collection(firestore, 'leads'));

    const newLead: Lead = {
      id: leadRef.id,
      name: user.displayName || user.email || 'Anonymous',
      company: '', // This could be fetched from user's profile if available
      email: user.email || '',
      phone: user.phoneNumber || '',
      inquiry: summary,
      status: 'New',
      assignedVendor: '',
    };
    
    await setDoc(leadRef, newLead);

    toast({
      title: 'Inquiry Submitted!',
      description: "Our team will review your request and get back to you shortly.",
    });

    closeChat();
    setMessages([]);
    setIsNewConversation(true);
    // Navigate admin to see the new lead. This assumes 'admin' role can be identified.
    if (user.email === 'admin@bantconfirm.com') {
        router.push('/admin'); 
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-80 md:w-96 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
                  <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeChat}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent ref={chatContentRef} className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                     <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                           <p className="text-sm">{msg.content}</p>
                        </div>
                     </div>
                  ))}
                   {loading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-secondary">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                   )}
                </CardContent>
                <CardFooter className="p-2 border-t">
                  <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="text-sm h-10 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                      }}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='relative'
            >
                <div className='absolute -top-4 -right-2'>
                    <div className="relative flex">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-lg blur opacity-50 animate-pulse"></div>
                        <p className='relative text-xs bg-accent text-accent-foreground rounded-full px-2 py-1 shadow-lg'>Need help?</p>
                    </div>
                </div>
            <Button
              size="lg"
              className="rounded-full shadow-lg h-14 w-14 mt-2"
              onClick={openChat}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       <AuthModal 
        isOpen={isAuthModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={async () => {
          if (inquirySummary) {
            await saveLead(inquirySummary);
          }
          setAuthModalOpen(false);
        }}
       />
    </>
  );
}


function AuthModal({ isOpen, onOpenChange, onSuccess }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Logged In Successfully!" });
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", cred.user.uid), {
        id: cred.user.uid,
        email: cred.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'customer',
      });
      toast({ title: "Account Created Successfully!" });
      onSuccess();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLoginView ? 'Sign In to Continue' : 'Create an Account to Continue'}</DialogTitle>
          <DialogDescription>
            Your inquiry is ready. Please {isLoginView ? 'sign in' : 'create an account'} to submit it to our vendors.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-modal">Email</Label>
            <Input id="email-modal" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-modal">Password</Label>
            <Input id="password-modal" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <DialogFooter className='gap-2 sm:justify-between'>
          <Button variant="ghost" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
          </Button>
          <Button onClick={isLoginView ? handleLogin : handleSignup} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLoginView ? <><LogIn className="mr-2 h-4 w-4" /> Sign In & Submit</> : <><UserPlus className="mr-2 h-4 w-4" /> Sign Up & Submit</>)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
