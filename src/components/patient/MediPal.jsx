import React from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const MediPal = () => {
    return (
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg shadow-primary/25">
            <CardHeader className="border-primary-foreground/10 pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                        <Bot className="text-white" size={20} />
                    </div>
                    Medi-Pal Assistant
                    <Sparkles size={16} className="text-accent animate-pulse" />
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 text-white min-h-[100px] flex items-end border border-white/5 shadow-inner">
                    <p className="leading-relaxed">"Don't forget to take your <span className="font-semibold text-accent">Metformin</span> with lunch today!"</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 bg-white/10 border-white/10 placeholder-white/50 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white/20 transition-all border"
                    />
                    <Button size="icon" className="bg-white text-primary hover:bg-white/90 rounded-xl">
                        <Send size={18} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MediPal;
