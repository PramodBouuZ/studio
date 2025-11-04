'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AdminAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Placeholder for AI response
    setTimeout(() => {
        setMessages([...newMessages, { role: 'assistant', content: 'This is a placeholder AI response for the admin chat.' }]);
        setLoading(false);
    }, 1000);
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
              <Card className="w-80 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
                  <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="h-80 overflow-y-auto p-4 space-y-4">
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
                      placeholder="Ask me anything..."
                      className="text-sm h-10 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
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
            >
            <Button
              size="lg"
              className="rounded-full shadow-lg h-14 w-14"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
