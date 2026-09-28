import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				md: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				heading: ['var(--font-playfair)', 'Georgia', 'serif'],
				body: ['var(--font-outfit)', 'var(--font-garet)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
				editorial: ['var(--font-cormorant)', 'Georgia', 'serif'],
				playfair: ['var(--font-playfair)', 'serif'],
				cormorant: ['var(--font-cormorant)', 'serif'],
				outfit: ['var(--font-outfit)', 'sans-serif'],
				garet: ['var(--font-outfit)', 'var(--font-manrope)', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				maroon: {
					DEFAULT: '#661818',
					mid: '#5A1616',
					deep: '#4E1212',
				},
				cream: {
					DEFAULT: '#FFF2DE',
					light: '#FFF9F0',
				},
				sand: '#F7E8D2',
				gold: '#B98D4E',
				ink: {
					DEFAULT: '#2E211C',
					soft: '#5A433A',
					mute: '#7A5C4E',
				},
				line: 'rgba(102, 24, 24, 0.14)',
				espresso: '#661818',
				vanilla: '#F7E8D2',
				mocha: '#5A1616',
				hazelnut: '#B98D4E',
				burgundy: '#4E1212',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: '#7A5C4E',
				},
				primary: {
					DEFAULT: '#661818',
					foreground: '#FFF2DE'
				},
				secondary: {
					DEFAULT: '#FFF2DE',
					foreground: '#661818'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				accent: {
					DEFAULT: '#B98D4E',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#2E211C'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'travel-teal': 'hsl(var(--travel-teal))',
				'travel-navy': 'hsl(var(--travel-navy))',
				'travel-light-teal': 'hsl(var(--travel-light-teal))',
				'travel-light-bg': 'hsl(var(--travel-light-bg))',
				romoire: {
					maroon: '#661818',
					'maroon-mid': '#5A1616',
					'maroon-deep': '#4E1212',
					cream: '#FFF2DE',
					sand: '#F7E8D2',
					gold: '#B98D4E',
					espresso: '#661818',
					vanilla: '#F7E8D2',
					mocha: '#5A1616',
					hazelnut: '#B98D4E',
					burgundy: '#4E1212',
					text: '#2E211C',
					muted: '#7A5C4E',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 1px)',
				sm: 'calc(var(--radius) - 2px)'
			},
			boxShadow: {
				editorial: '0 8px 30px rgba(76, 43, 8, 0.08)',
				'editorial-lg': '0 12px 36px rgba(76, 43, 8, 0.1)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
