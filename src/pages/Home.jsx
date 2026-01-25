import React from 'react';
import { ArrowRight, Activity, ShieldCheck, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { isAuthenticated, user, login } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = async () => {
        if (!isAuthenticated || user?.role !== 'patient') {
            await login({ 
                userData: { id: 'user-1', name: 'Ilyass', role: 'patient' } 
            });
        }
        navigate('/patient');
    };

    const handlePartnerWithUs = async () => {
        if (!isAuthenticated || user?.role !== 'pharmacy') {
            await login({ 
                userData: { id: 'user-2', name: 'Pharmacy Admin', role: 'pharmacy' } 
            });
        }
        navigate('/pharmacy');
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                <div className="container max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                        Reimagining Healthcare Management
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                        Your Health, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                            Connected & Simplified.
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        A unified platform for patients, pharmacies, and delivery services.
                        Manage medications, track orders, and stay healthy with MediLink.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                            size="lg" 
                            className="rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/25"
                            onClick={handleGetStarted}
                        >
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="rounded-full px-8 text-lg h-14 bg-background/50 backdrop-blur-sm"
                            onClick={handlePartnerWithUs}
                        >
                            Partner with Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Activity}
                            title="Smart Tracking"
                            description="Automated medication schedules and refill reminders so you never miss a dose."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Secure Verified"
                            description="Direct connection with licensed pharmacies ensuring authentic medications every time."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Fast Delivery"
                            description="Real-time tracking of your medical supplies from the pharmacy to your doorstep."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = (props) => {
    const { icon: DisplayIcon, title, description } = props;
    return (
        <Card className="border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <DisplayIcon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
};

export default Home;
