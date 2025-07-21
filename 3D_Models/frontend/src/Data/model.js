// featuredCollectionModels.js
const featuredCollectionModels = [
  {
    id: 'sports-car',
    name: 'Classic Sports Car',
    thumbnailUrl: '/images/Sports-car.jpg',
    glbUrl: '/car_1.glb',
    scale: 1.0,
    position: [0, -0.5, 0], // Move car slightly down to sit on the ground
    rotation: [0, Math.PI / 4, 0], // Rotate 45 degrees around Y-axis for a nice view
    environmentPreset: 'studio', // Bright studio lighting
    castShadows: true,
    receiveShadows: true,
    description: 'A beautifully classic sports car.',
    category: 'vehicle',
    specs: { /* ... */ },
    creator: { /* ... */ },
  },
  {
    id: 'shoes',
    name: 'Classic Sports Shoe',
    thumbnailUrl: '/images/running-shoe.jpg',
    glbUrl: '/shoe_2.glb',
    scale: 0.1,
    position: [0, 0, 0], // Keep shoe centered
    rotation: [0, 0, 0], // No rotation
    environmentPreset: 'warehouse', // Industrial look
    castShadows: true,
    receiveShadows: true,
    description: 'Lightweight and durable shoe for athletic performance.',
    category: 'apparel',
    specs: { /* ... */ },
    creator: { /* ... */ }
  },
  {
    id: 'cartoon-girl',
    name: 'Anime Cartoon Girl',
    thumbnailUrl: '/images/cartoon-girl.png',
    glbUrl: '/cartoon_1.glb',
    scale: 0.8,
    position: [0, -0.8, 0], // Move character down to stand on the plane
    rotation: [0, -Math.PI / 8, 0], // Slight rotation for personality
    environmentPreset: 'park', // Outdoor, natural lighting
    castShadows: true,
    receiveShadows: true,
    description: 'A charming anime-style character model, perfect for animations or games.',
    category: 'character',
    specs: { /* ... */ },
    creator: { /* ... */ }
  },
  {
    id: 'the-nature',
    name: 'Nature',
    thumbnailUrl: '/images/nature.jpg',
    glbUrl: '/nature_1.glb',
    scale: 0.1, 
    position: [0, -0.8, 0],
    rotation: [0, -Math.PI / 8, 0],
    environmentPreset: 'dawn',
    castShadows: true,
    receiveShadows: true,
    description: 'A serene nature scene model.',
    specs: { /* ... */ },
  },
  {
    id: 'beautiful-animals',
    name: 'Animals',
    thumbnailUrl: '/images/wallpaper-cat.jpg',
    glbUrl: '/cat_2.glb',
    scale: 0.05,
    position: [0, -0.05, 0], // Small adjustment down for the cat
    rotation: [0, Math.PI / 6, 0], // Slight rotation
    environmentPreset: 'forest', // Natural forest environment
    castShadows: true,
    receiveShadows: true,
    description: 'A cute and detailed cat model.', // Updated description
  },
  {
    id: 'the-sky',
    name: 'Sky',
    thumbnailUrl: '/images/sky.jpg',
    glbUrl: '/sky_1.glb',
    scale: 0.9,
    position: [0, 0, 0], // Default position
    rotation: [0, 0, 0], // Default rotation
    environmentPreset: 'sunset', // Warm, dramatic lighting
    castShadows: true,
    receiveShadows: true,
    description: 'A vast sky scene with clouds.', // Updated description
  },
];

export default featuredCollectionModels;