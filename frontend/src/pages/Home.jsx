import HeroSection from '../components/HeroSection.jsx';
import StorySection from '../components/StorySection.jsx';
import FeatureSection from '../components/FeatureSection.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import BottomCta from '../components/BottomCta.jsx';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <FeatureSection />
      <HowItWorks />
      <BottomCta />
    </>
  );
}
