import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Listings from '@/components/Listings';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Listings />
            <Contact />
            <Footer />
            <ScrollToTop />
        </main>
    );
}
