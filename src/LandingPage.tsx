// HMJ

import VerticalDivider from './ui/VerticalDivider';

type LandingPagePropsType = {};

const LandingPage = (): React.ReactElement<LandingPagePropsType> => (
  <div className="flex flex-col items-center p-12 text-center text-white">
    <h1 className="w-full pb-2 md:w-98"> SpaceMaker AI </h1>
    <VerticalDivider />
    <h1 className="w-full pb-2 text-center"> solar system rendered using webgl</h1>
    <VerticalDivider />
    
    <div className="pt-4 space-y-1">
      <p className="text-xs">.wav or .mp3</p>
      <p className="text-xs">We do not store your music.</p>
    </div>
  </div>
);

export default LandingPage;
