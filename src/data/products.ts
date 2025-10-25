export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  orderIndex: number;
  isActive: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Double Sink Station',
    description: 'Professional stainless steel double sink station with storage shelf, perfect for commercial kitchens and food service operations. Built with high-grade 304 stainless steel, featuring deep basin design for efficient washing and sanitizing. The integrated storage shelf provides convenient space for cleaning supplies and utensils.',
    imageUrl: '/sink1 copy.png',
    slug: 'double-sink-station',
    orderIndex: 1,
    isActive: true
  },
  {
    id: '2',
    title: 'Commercial Kitchen Hood',
    description: 'Heavy-duty stainless steel kitchen exhaust hood with ventilation system, designed for professional restaurant environments. Features powerful extraction capabilities to remove smoke, steam, and cooking odors. Built-in grease filters ensure clean air circulation and easy maintenance.',
    imageUrl: '/Gemini_Generated_Image_5gipdd5gipdd5gip.png',
    slug: 'commercial-kitchen-hood',
    orderIndex: 2,
    isActive: true
  },
  {
    id: '3',
    title: 'Service Counter',
    description: 'Custom-built stainless steel service counter with storage compartments and shelving, ideal for cafes and restaurants. Designed for durability and functionality, featuring multiple storage options and a spacious work surface. Perfect for food prep, service, and display.',
    imageUrl: '/Gemini_Generated_Image_g4pezdg4pezdg4pe copy.jpg',
    slug: 'service-counter',
    orderIndex: 3,
    isActive: true
  },
  {
    id: '4',
    title: 'Professional Gas Range',
    description: 'Four-burner commercial gas range with stainless steel construction and storage base, built for high-volume cooking. Features powerful BTU output for rapid heating and precise temperature control. Durable construction withstands demanding commercial kitchen environments.',
    imageUrl: '/Gemini_Generated_Image_jmj9n1jmj9n1jmj9 copy.png',
    slug: 'professional-gas-range',
    orderIndex: 4,
    isActive: true
  },
  {
    id: '5',
    title: 'Exhaust Canopy',
    description: 'Industrial stainless steel exhaust canopy with grease filters and ventilation system for commercial kitchen safety. Engineered to meet health and safety standards, featuring efficient smoke and heat extraction. Easy-to-clean design with removable filter system.',
    imageUrl: '/Gemini_Generated_Image_ymi0i4ymi0i4ymi0.png',
    slug: 'exhaust-canopy',
    orderIndex: 5,
    isActive: true
  },
  {
    id: '6',
    title: 'Brick Pizza Oven',
    description: 'Traditional brick pizza oven with stainless steel base cabinet and sliding doors, perfect for authentic wood-fired cooking. Retains heat efficiently for consistent baking results. The stainless steel base provides storage and complements any commercial kitchen aesthetic.',
    imageUrl: '/unnamed copy.png',
    slug: 'brick-pizza-oven',
    orderIndex: 6,
    isActive: true
  },
  {
    id: '7',
    title: 'Metal Sculpture Monument',
    description: 'Elegant stainless steel sculptural monument featuring intricate bending and polished finish, showcasing artistic metalwork expertise. This piece demonstrates our capability in creating custom artistic installations and architectural features. Each curve and angle precisely crafted to achieve stunning visual impact.',
    imageUrl: '/Gemini_Generated_Image_5tsbvd5tsbvd5tsb copy.png',
    slug: 'metal-sculpture-monument',
    orderIndex: 7,
    isActive: true
  },
  {
    id: '8',
    title: 'BBQ Grill Station',
    description: 'Custom BBQ grill station with brick base and stainless steel canopy, combining traditional grilling with modern design elements. Perfect for outdoor cooking operations, featuring robust construction and efficient heat management. The hood system effectively manages smoke while protecting the cooking area.',
    imageUrl: '/Gemini_Generated_Image_acy70qacy70qacy7.jpg',
    slug: 'bbq-grill-station',
    orderIndex: 8,
    isActive: true
  },
  {
    id: '9',
    title: 'Spiral Staircase',
    description: 'Premium stainless steel spiral staircase with curved railings, demonstrating advanced bending and welding capabilities. Combines structural integrity with elegant design, suitable for both interior and exterior applications. Each component precisely fabricated and assembled for safety and aesthetics.',
    imageUrl: '/Gemini_Generated_Image_exjfxaexjfxaexjf copy.png',
    slug: 'spiral-staircase',
    orderIndex: 9,
    isActive: true
  },
  {
    id: '10',
    title: 'Service Kiosk',
    description: 'Modern outdoor service kiosk with durable metal frame and protective panels, ideal for food service and retail applications. Weather-resistant construction ensures longevity in outdoor environments. Features customizable serving windows and storage compartments for efficient operations.',
    imageUrl: '/Gemini_Generated_Image_jfyylnjfyylnjfyy copy.png',
    slug: 'service-kiosk',
    orderIndex: 10,
    isActive: true
  }
];
