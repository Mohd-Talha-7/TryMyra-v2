import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Showcase } from '../components/Showcase';
import { Features } from '../components/Features';
import { WorkflowVisualizer } from '../components/WorkflowVisualizer';
import { AdGeneratorForm } from '../components/AdGeneratorForm';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { CallToAction } from '../components/CallToAction';
import { Footer } from '../components/Footer';

export const Landing = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Showcase />
                <Features />
                <WorkflowVisualizer />
                <AdGeneratorForm />
                <Pricing />
                <FAQ />
                <CallToAction />
            </main>
            <Footer />
        </>
    );
};
