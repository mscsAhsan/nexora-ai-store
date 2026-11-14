export const categories = ["All", "Writing", "Image", "Video", "Coding", "Audio", "Marketing", "Productivity"];

export const categoryColors = {
  Writing: "#7C5CFF", Image: "#F472B6", Video: "#22D3EE", Coding: "#34D399",
  Audio: "#FBBF24", Marketing: "#FB7185", Productivity: "#60A5FA",
};

export const iconNames = ["pen", "image", "video", "code", "mic", "megaphone", "bolt", "shield", "sparkle"];

// Seed data: inserted into the database the first time the site starts. Edit later from /admin/tools
export const seedTools = [
  { slug: "chatpilot", name: "ChatPilot", category: "Writing", icon: "pen", price: 19, rating: 4.9, reviews: 2400, from: "#7C5CFF", to: "#22D3EE", desc: "AI assistant for emails, blogs and ad copy in seconds.", features: ["Long-form blog writer", "50+ tone presets", "Plagiarism check", "Team templates"] },
  { slug: "pixelforge", name: "PixelForge", category: "Image", icon: "image", price: 24, rating: 4.8, reviews: 2400, from: "#F472B6", to: "#7C5CFF", desc: "Turn text prompts into stunning, brand-ready visuals.", features: ["4K image generation", "Brand style memory", "Background remover", "Commercial license"] },
  { slug: "clipwave", name: "ClipWave", category: "Video", icon: "video", price: 29, rating: 4.7, reviews: 2400, from: "#22D3EE", to: "#3B82F6", desc: "Edit, caption and repurpose videos with one click.", features: ["Auto captions", "Shorts / Reels cutter", "AI b-roll", "1080p export"] },
  { slug: "codemate", name: "CodeMate", category: "Coding", icon: "code", price: 15, rating: 4.9, reviews: 2400, from: "#34D399", to: "#22D3EE", desc: "Autocomplete, debug and review code inside your IDE.", features: ["VS Code & JetBrains", "Bug explainer", "Test generator", "Private mode"] },
  { slug: "voicenest", name: "VoiceNest", category: "Audio", icon: "mic", price: 12, rating: 4.6, reviews: 2400, from: "#FBBF24", to: "#F472B6", desc: "Lifelike voiceovers and podcasts in 40+ languages.", features: ["40+ languages", "Voice cloning", "Podcast mixer", "Noise removal"] },
  { slug: "adgenius", name: "AdGenius", category: "Marketing", icon: "megaphone", price: 22, rating: 4.8, reviews: 2400, from: "#FB7185", to: "#7C5CFF", desc: "Generate campaigns, SEO briefs and social calendars.", features: ["Campaign planner", "SEO briefs", "Social calendar", "A/B copy tests"] },
  { slug: "slidesmith", name: "SlideSmith", category: "Productivity", icon: "bolt", price: 18, rating: 4.7, reviews: 1800, from: "#60A5FA", to: "#7C5CFF", desc: "Turn any outline into a polished presentation deck.", features: ["Outline to deck", "Brand themes", "Speaker notes", "PPTX export"] },
  { slug: "logolab", name: "LogoLab", category: "Image", icon: "sparkle", price: 14, rating: 4.5, reviews: 1500, from: "#F472B6", to: "#FBBF24", desc: "Design logos and brand kits in minutes, not weeks.", features: ["Vector logo export", "Brand colour kit", "Social avatars", "Unlimited revisions"] },
  { slug: "bugshield", name: "BugShield", category: "Coding", icon: "shield", price: 27, rating: 4.8, reviews: 1200, from: "#34D399", to: "#3B82F6", desc: "Scan your code for security bugs before hackers do.", features: ["Dependency scan", "Secret detection", "PR comments", "Weekly reports"] },
  { slug: "transcribeit", name: "TranscribeIt", category: "Audio", icon: "mic", price: 10, rating: 4.6, reviews: 2100, from: "#FBBF24", to: "#22D3EE", desc: "Accurate transcripts and summaries from any recording.", features: ["99% accuracy", "Speaker labels", "Meeting summaries", "Urdu & English"] },
];

export const plans = [
  { name: "Starter", monthly: 0, desc: "For trying things out", features: ["5 tool trials / month", "Community support", "Basic search"], hot: false },
  { name: "Pro", monthly: 29, desc: "For creators & freelancers", features: ["Unlimited tool access", "Priority support", "Exclusive discounts", "Early new releases"], hot: true },
  { name: "Team", monthly: 79, desc: "For agencies & startups", features: ["Up to 10 seats", "Shared workspace", "Invoices & analytics"], hot: false },
];
