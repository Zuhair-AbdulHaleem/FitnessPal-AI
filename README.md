# FitnessPalAI 🏋️‍♂️

FitnessPalAI is a modern, AI-powered fitness and nutrition planning application that creates personalized workout and diet plans based on your individual goals, preferences, and constraints. Leveraging the power of Claude AI, it generates comprehensive fitness plans tailored to your specific needs.

![FitnessPalAI Logo](public/preview.png)

## 🌟 Features

### Personalized Plan Generation
- **Custom Workout Plans**: Tailored exercises based on your experience level and available equipment
- **Nutrition Guidance**: Personalized meal suggestions considering dietary restrictions and preferences
- **Time-Adaptive**: Plans that fit your available workout and cooking time
- **Progress-Oriented**: Recommendations for progression and motivation

### Smart Form Interface
- **Intuitive Input**: Easy-to-use form with dropdown selections and validation
- **Height Selection**: US standard format (feet and inches)
- **Time Preferences**: Preset options for workout and cooking duration
- **Multi-select Options**: For dietary restrictions and available equipment
- **Additional Notes**: Space for specific requirements or health conditions

### Professional Output
- **Clean Layout**: Well-organized sections with clear headers
- **Visual Elements**: Custom icons for different plan sections
- **Interactive Design**: Hover effects and smooth animations
- **PDF Export**: One-click download of your personalized plan
- **Mobile Responsive**: Seamless experience across all devices

### User Experience
- **Real-time Validation**: Immediate feedback on form inputs
- **Loading States**: Visual feedback during plan generation
- **Error Handling**: Clear error messages and guidance
- **Profile Summary**: Overview of selected preferences
- **Easy Regeneration**: Option to generate new plans instantly

## 🛠️ Technologies Used

### Frontend
- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **html2pdf.js**: PDF generation

### Backend
- **Anthropic Claude AI**: Advanced language model for plan generation
- **Next.js API Routes**: Serverless functions
- **Node.js**: Runtime environment

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **npm**: Package management
- **Git**: Version control

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitnesspalai.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## 👤 Author

**Zuhair Haleem**
- LinkedIn: [@zuhair-haleem](https://www.linkedin.com/in/zuhair-haleem)

## 💫 Acknowledgments

- Thanks to Anthropic for providing the Claude AI API
- All the open-source libraries that made this project possible
