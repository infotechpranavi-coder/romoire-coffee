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
				body: ['var(--font-garet)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
				editorial: ['var(--font-cormorant)', 'Georgia', 'serif'],
				playfair: ['var(--font-playfair)', 'serif'],
				cormorant: ['var(--font-cormorant)', 'serif'],
				garet: ['var(--font-garet)', 'var(--font-manrope)', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				espresso: '#4C2B08',
				vanilla: '#D7BDA6',
				mocha: '#85593E',
				hazelnut: '#996133',
				cream: '#F8F3EF',
				burgundy: '#5A0D0D',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: '#745F52',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
					espresso: '#4C2B08',
					vanilla: '#D7BDA6',
					mocha: '#85593E',
					hazelnut: '#996133',
					cream: '#F8F3EF',
					burgundy: '#5A0D0D',
					text: '#2E211B',
					muted: '#745F52',
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
