#  JFFT - Jackal Furious Finger Typing


## Overview

JFFT is a typing practice platform with real-time metrics, voice typing, leaderboards, and performance tracking. Practice typing tests, track your progress, and compete with others.

---

##  Features

- **Typing Tests** - Customizable duration, text types, and difficulty levels
- **Voice Typing** - Practice using speech recognition
- **Leaderboard** - Global rankings and performance tracking
- **Achievements** - Unlock badges and milestones
- **Dark/Light Mode** - Theme toggle with auto-save
- **Premium Plans** - Free, Pro ($8/mo), and Team ($20/mo) subscriptions
- **Responsive** - Works on desktop, tablet, and mobile

---

##  Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Context API** - State management

---

##  Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # React Context
│   ├── layouts/        # Layout components
│   ├── assets/         # Images & media
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

##  Installation

**Prerequisites:** Node.js 16+ and npm

```bash
# Clone repository
git clone https://github.com/yourusername/Web_app_Jfft.git
cd Web_app_Jfft/Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

##  Quick Start

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Create an account on the signup page
4. Start a typing test and practice

**Routes:**
- `/` - Home
- `/signup` - Sign up
- `/signin` - Sign in
- `/typing` - Typing practice
- `/voice` - Voice typing
- `/pricing` - Subscription plans
- `/leaderboard` - Rankings

---

##  How to Use

1. **Start Test** - Choose duration, text type, and difficulty
2. **Type** - Real-time WPM, accuracy, and errors display
3. **View Results** - Check metrics and compare with previous tests
4. **Voice Mode** - Click voice button to practice with speech
5. **Check Leaderboard** - View rankings and performance trends

---

##  Environment Variables

Create `.env.local` in the Frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_key
VITE_GOOGLE_CLIENT_ID=your_id
```

---

##  Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Check code quality
```

---

##  Payment Methods

**Supported:** Card, PayPal, Google Play, Apple Pay, Stripe, MTN Momo Pay

**Plans:**
- Free - Basic lessons
- Pro ($8/mo) - Unlimited access + voice typing
- Team ($20/mo) - Manage up to 50 users + analytics

---

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

##  License

MIT License - See [LICENSE](LICENSE) file for details

---

##  Support

- Report issues on [GitHub Issues](../../issues)
- Email: support@jfft.com

---


**Made with ❤️ by the JFFT Team**

 Star us on GitHub if you find this project helpful!
