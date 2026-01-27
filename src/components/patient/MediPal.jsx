import React from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const MediPal = () => {
    return (
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg shadow-primary/25">
            <CardHeader className="border-primary-foreground/10 pb-2">
                <CardTitle className="flex items-center gap-2 text-primary-foreground">
                    <div className="bg-primary-foreground/20 p-1.5 rounded-lg backdrop-blur-sm">
                        <Bot className="text-primary-foreground" size={20} />
                    </div>
                    Medi-Pal Assistant
                    <Sparkles size={16} className="text-accent-foreground animate-pulse" />
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="bg-primary-foreground/10 backdrop-blur-md rounded-xl p-4 mb-4 text-primary-foreground min-h-[100px] flex items-end border border-primary-foreground/5 shadow-inner">
                    <p className="leading-relaxed italic opacity-90">"Don't forget to take your <span className="font-bold">Metformin</span> with lunch today!"</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 bg-primary-foreground/10 border-primary-foreground/10 placeholder:text-primary-foreground/50 text-primary-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:bg-primary-foreground/20 transition-all border"
                    />
                    <Button size="icon" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl">
                        <Send size={18} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MediPal;
