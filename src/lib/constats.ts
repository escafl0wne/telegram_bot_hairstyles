import { ContentActions } from '../types';

export const SESSION_MESSAGES = {
  errors: 0,
  bookings: 0,
  selection: 0,
  calendar: 0,
  confirm: 0,
  result: 0,
  time: 0,
  cancelBooking: 0,
  admin: 0,
} as const;
export const CONTENT: ContentActions[] = [
  {
    title: 'Укладка 🤵‍♂️💍👰',
    content: `
    📸✨ Capture Your Perfect Day with Our Wedding Photoshoot Services! ✨📸\n\nAre you ready to make your wedding day unforgettable? Look no further! With 15 years of experience in the industry, we are here to turn your special moments into timeless memories. 💍❤️\n\n👰‍♀️🤵‍♂️ Our Services Include:\n✅ Stunning Wedding Photoshoots\n✅ Professional Posing and Guidance\n✅ Candid Shots Capturing Genuine Emotions\n✅ High-Quality Editing and Retouching\nOur goal is to ensure every smile, every tear, and every laugh is beautifully preserved for generations to come. 📷✨\n\n💰 Pricing:\nWe offer competitive rates at just £200 per hour, making it easy for you to have the perfect photographer capturing your day without breaking the bank. 💸👌\n\nDon't miss out on the chance to work with a passionate, experienced, and dedicated photographer. Contact us today to book your wedding photoshoot and secure your spot! 📅💌\n\nLet's create magic together! ✨👰‍♂️📸 #WeddingPhotography #MemoriesMadeInFrames #CaptureTheLove
    `,
    alias: 'hairstyle',
    description: 'укладку',
    time: 2,
  },
  {
    title: 'Покрaска c мелированием👼',
    content: `📸✨ Capture Your Child's Day with Our Child's Photoshoot Services! ✨📸

Are you ready to capture your child's essence in stunning portraits? Look no further! With 15 years of experience in the industry, we are here to transform your moments into timeless images. 📷🌟

👤📷 Our Services Include:
✅ Professional Child's Photoshoots
✅ Expert Posing and Guidance
✅ Creative Composition
✅ High-Quality Editing and Retouching

Our goal is to ensure your unique personality shines through every shot, creating portraits that you'll treasure forever. 🎨✨

💰 Pricing:
We offer competitive rates at just £100 per hour, making it accessible for you to have a top-notch portrait session. 💸👌`,
    alias: 'dying, white',
    description: 'покраску с мелированием',
    time: 3,
  },
  {
    title: 'Покрaска 👼',
    content: `📸✨ Capture Your Child's Day with Our Child's Photoshoot Services! ✨📸

Are you ready to capture your child's essence in stunning portraits? Look no further! With 15 years of experience in the industry, we are here to transform your moments into timeless images. 📷🌟

👤📷 Our Services Include:
✅ Professional Child's Photoshoots
✅ Expert Posing and Guidance
✅ Creative Composition
✅ High-Quality Editing and Retouching

Our goal is to ensure your unique personality shines through every shot, creating portraits that you'll treasure forever. 🎨✨

💰 Pricing:
We offer competitive rates at just £100 per hour, making it accessible for you to have a top-notch portrait session. 💸👌`,
    alias: 'dying',
    description: 'покраску',
    time: 6,
  },
  {
    title: 'Стрижка 💇‍♀️',
    content: `📸✨ Elevate Your Portrait Game with Our Photoshoot Services! ✨📸\n\n

    Are you ready to capture your essence in stunning portraits? Look no further! With 15 years of experience in the industry, we are here to transform your moments into timeless images. 📷🌟\n\n
    
    👤📷 Our Services Include:\n\n
    ✅ Professional Portrait Photoshoots\n\n
    ✅ Expert Posing and Guidance\n\n
    ✅ Creative Composition\n\n
    ✅ High-Quality Editing and Retouching\n\n
    
    Our goal is to ensure your unique personality shines through every shot, creating portraits that you'll treasure forever. 🎨✨
    
    💰 Pricing:
    We offer competitive rates at just £100 per hour, making it accessible for you to have a top-notch portrait session. 💸👌
    
    Don't miss out on the chance to work with a passionate, experienced, and dedicated photographer. Contact us today to book your portrait photoshoot and secure your spot! 📅💌
    
    Let's capture your essence together! 🌟📷 #PortraitPhotography #ExpressYourselfInFrames #TimelessPortraits`,
    alias: 'haircuts',
    description: 'подстрижку',
    time: 1,
  },
];
