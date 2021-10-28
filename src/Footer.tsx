// HMJ

import React from 'react';

const FOOTER_CONTENTS = [
  {
    role: '3D Design',
    name: 'Hector',
    link: 'https://uk.linkedin.com/in/hector-crean-016032141',
  },
];

const Footer = (): React.ReactElement => (
  <footer className="flex flex-col justify-between h-full px-8 pt-8 pb-12 mt-8 bg-transparent md:px-16 md:pb-24 md:flex-row md:space-x-4 space-y-8 md:space-y-0">
    {FOOTER_CONTENTS.map((person) => (
      <div key={person.name} className="font-sans text-sm text-center text-white">
        <p className="pb-2 font-extrabold">{person.role.toUpperCase()}</p>
        {person.link ? (
          <a href={person.link} rel="noreferrer" target="_blank">
            {person.name}
          </a>
        ) : (
          <>{person.name}</>
        )}
      </div>
    ))}
  </footer>
);

export default Footer;
