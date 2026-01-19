const products = [
  {
    name: "Turmeric Powder",
    description: "Pure ground turmeric with rich color and earthy aroma. Perfect for curries and stews.",
    image: "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg",
    price: 250,
    category: "Spice",
    stock: 50,
    rating: 4.7,
    reviews: [
      { name: "Sarah M.", date: "2 days ago", rating: 5, text: "Amazing quality! Very fresh and aromatic. Perfect for my daily golden milk." },
      { name: "John D.", date: "1 week ago", rating: 4, text: "Good quality turmeric, though a bit pricey. Worth it for the organic certification." },
      { name: "Lisa K.", date: "2 weeks ago", rating: 5, text: "Rich color and authentic taste. Highly recommend!" }
    ]
  },
  {
    name: "Cinnamon Sticks",
    description: "Sweet aromatic cinnamon sticks ideal for desserts, porridge, and spiced tea.",
    image: "https://images.pexels.com/photos/71128/cinnamon-cinnamon-stick-rod-kitchen-71128.jpeg",
    price: 320,
    category: "Blend",
    stock: 30,
    rating: 4.8,
    reviews: [
      { name: "Emily R.", date: "3 days ago", rating: 5, text: "Perfect for baking and morning coffee. Highly recommend!" },
      { name: "Mike P.", date: "5 days ago", rating: 5, text: "The real deal! So much better than regular cinnamon." }
    ]
  },
  {
    name: "Black Pepper",
    description: "Whole black peppercorns — strong, spicy, and bold. A kitchen essential.",
    image: "https://images.pexels.com/photos/39069/pepper-pepper-mill-pfefferkorn-pepper-ground-39069.jpeg",
    price: 400,
    category: "Spice",
    stock: 50,
    rating: 4.6,
    reviews: [
      { name: "Chef Antonio", date: "1 day ago", rating: 5, text: "Authentic and aromatic! Makes the most beautiful biryani." },
      { name: "Priya S.", date: "4 days ago", rating: 4, text: "Good quality pepper, nice flavor for cooking." }
    ]
  },
  {
    name: "Cloves",
    description: "Richly aromatic cloves, perfect for tea, baking, and stews.",
    image: "https://media.istockphoto.com/id/471346177/photo/cloves-closeup.jpg?s=1024x1024&w=is&k=20&c=9JwBwcgAL2ev6z4q_a4RSkVcw1011FsCCBfj-u3y4-Y=",
    price: 350,
    category: "Spice",
    stock: 40,
    rating: 4.7,
    reviews: [
      { name: "Tea Lover", date: "5 days ago", rating: 5, text: "Perfect for my chai masala. Strong aroma!" },
      { name: "Baker", date: "1 week ago", rating: 4, text: "Good quality cloves for baking." },
      { name: "Chef", date: "2 weeks ago", rating: 5, text: "Essential for authentic Indian cooking." }
    ]
  },
  {
    name: "Coriander Seeds",
    description: "Fresh, golden coriander seeds — great for spice blends and curries.",
    image: "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg",
    price: 220,
    category: "Spice",
    stock: 60,
  },
  {
    name: "Cardamom Pods",
    description: "Premium green cardamom pods with a sweet, floral fragrance.",
    image: "https://images.pexels.com/photos/10487768/pexels-photo-10487768.jpeg",
    price: 500,
    category: "Spice",
    stock: 25,
    rating: 4.9,
    reviews: [
      { name: "Indian Chef", date: "3 days ago", rating: 5, text: "Authentic Malabar cardamom! Perfect for biryani." },
      { name: "Baking Enthusiast", date: "1 week ago", rating: 5, text: "Amazing flavor in my cardamom buns." },
      { name: "Tea Master", date: "2 weeks ago", rating: 5, text: "Elevates any chai to perfection." }
    ]
  },
  {
    name: "Moringa Powder",
    description: "Nutrient-rich herbal powder packed with vitamins and antioxidants.",
    image: "https://images.pexels.com/photos/7149595/pexels-photo-7149595.jpeg",
    price: 450,
    category: "Herb",
    stock: 35,
    rating: 4.8,
    reviews: [
      { name: "Health Guru", date: "3 days ago", rating: 5, text: "Amazing superfood! Boosts my energy levels." },
      { name: "Nutritionist", date: "1 week ago", rating: 5, text: "Rich in nutrients, perfect for smoothies." },
      { name: "Wellness Seeker", date: "2 weeks ago", rating: 4, text: "Good quality, but a bit pricey." }
    ]
  },
  {
    name: "Ginger Powder",
    description: "Zesty, warm ginger powder ideal for cooking and health drinks.",
    image: "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg",
    price: 300,
    category: "Spice",
    stock: 45,
    rating: 4.7,
    reviews: [
      { name: "Ayurvedic Practitioner", date: "3 days ago", rating: 5, text: "Authentic ginger powder for immunity." },
      { name: "Home Cook", date: "1 week ago", rating: 5, text: "Perfect for adding zing to curries." },
      { name: "Health Enthusiast", date: "2 weeks ago", rating: 4, text: "Good quality, but could be more affordable." }
    ]
  },
  {
    name: "Chamomile",
    description: "Dried chamomile flowers — soothing and calming for relaxation and sleep.",
    image: "https://images.pexels.com/photos/6694166/pexels-photo-6694166.jpeg",
    price: 380,
    category: "Herb",
    stock: 40,
    rating: 4.9,
    reviews: [
      { name: "Relaxation Seeker", date: "3 days ago", rating: 5, text: "Perfect for calming teas." },
      { name: "Sleep Enthusiast", date: "1 week ago", rating: 5, text: "Helps me wind down every night." },
      { name: "Herbalist", date: "2 weeks ago", rating: 4, text: "Good quality, but could be more affordable." }
    ]
  },
  {
    name: "Peppermint Leaves",
    description: "Fresh dried peppermint leaves — refreshing aroma and digestive benefits.",
    image: "https://images.pexels.com/photos/34284560/pexels-photo-34284560.jpeg",
    price: 280,
    category: "Herb",
    stock: 55,
    rating: 4.8,
    reviews: [
      { name: "Digestive Health User", date: "3 days ago", rating: 5, text: "Great for soothing digestion." },
      { name: "Tea Lover", date: "1 week ago", rating: 5, text: "Perfect for minty teas." },
      { name: "Herbalist", date: "2 weeks ago", rating: 4, text: "Good quality, but could be more affordable." }
    ]
  },
  {
    name: "Bay Leaves",
    description: "Dried bay leaves — enhance soups, stews, and sauces with deep aroma.",
    image: "https://images.pexels.com/photos/4871156/pexels-photo-4871156.jpeg",
    price: 200,
    category: "Spice",
    stock: 70,
    rating: 4.7,
    reviews: [
      { name: "Cooking Enthusiast", date: "3 days ago", rating: 5, text: "Essential for my cooking!" },
      { name: "Home Cook", date: "1 week ago", rating: 5, text: "Perfect for adding zing to curries." },
]
},
  {
    name: "Rosemary",
    description: "Fragrant rosemary leaves — perfect for meat dishes and herbal teas.",
    image: "https://images.pexels.com/photos/699374/pexels-photo-699374.jpeg",
    price: 260,
    category: "Herb",
    stock: 78,
    rating: 4.3,
    reviews: [
      { name: "Cooking Enthusiast", date: "3 days ago", rating: 5, text: "Essential for my cooking!" },
      { name: "Home Cook", date: "1 week ago", rating: 5, text: "Perfect for adding zing to curries." },
]
  },
  {
    name: "Thyme",
    description: "Dried thyme — adds rich, savory flavor to meat and stews.",
    image: "https://images.pexels.com/photos/7717985/pexels-photo-7717985.jpeg",
    price: 270,
    category: "Herb",
    stock: 62,
    rating: 4.1,
    reviews: [
      {name:"johstone kenyeta", date:"2 days ago", rating:5, text:"Great thyme for my recipes!"},
      {name:"Linda May", date:"1 week ago", rating:4, text:"Good quality thyme, will buy again."},
]
  },
  {
    name: "Garlic Powder",
    description: "Pure garlic powder — convenient and flavorful alternative to fresh garlic.",
    image: "https://media.istockphoto.com/id/1357269214/photo/garlic-powder.jpg?b=1&s=612x612&w=0&k=20&c=eT_WyGT6GYrnfYED_JkM6w5iOPv799U_7R8E1R1JzCQ=",
    price: 330,
    category: "Spice",
    stock: 48,
    rating:4.5,
    reviews: [
      {name:"Chef Alex", date:"3 days ago", rating:5, text:"Excellent garlic powder, very flavorful."},
      {name:"Ivy Muthoni", date:"1 week ago", rating:4, text:"Good quality, will repurchase."},
]
  },
  {
    name: "Cumin Seeds",
    description: "Warm, nutty cumin seeds — essential for curries and masalas.",
    image: "https://images.pexels.com/photos/6252741/pexels-photo-6252741.jpeg",
    price: 310,
    category: "Spice",
    stock: 53,
    rating:4.4,
    reviews: [
      {name:"jackie omollo", date:"2 days ago", rating:5, text:"Great cumin seeds for my recipes!"},
      {name:"Mark Twain", date:"1 week ago", rating:4, text:"Good quality cumin, will buy again."},
]
  },
{
    name: "Paprika",
    description: "Sweet and smoky paprika made from dried red peppers.",
    image:"https://images.pexels.com/photos/5877904/pexels-photo-5877904.jpeg",
    price: 290,
    category: "Spice",
    stock: 30,
    rating:4.2,
    reviews:[
      {name:"sarah wanjiku", date:"2 days ago", rating:5, text:"Great paprika for my recipes!"},
      {name:"Tom Hanks", date:"1 week ago", rating:4, text:"Good quality paprika, will buy again."},
    ]
  },
  {
    name: "Fenugreek Seeds",
    description: "Bitter aromatic seeds used in Indian and African dishes.",
    image:"https://images.pexels.com/photos/27867128/pexels-photo-27867128.jpeg",
    price: 230,
    category: "Spice",
    stock: 36,
    rating:4.0,
    reviews:[
      {name:"nancy wairimu", date:"2 days ago", rating:5, text:"Great fenugreek seeds for my recipes!"},
      {name:"Emma Stone", date:"1 week ago", rating:4, text:"Good quality fenugreek, will buy again."},
    ]
  },
  {
    name: "Mustard Seeds",
    description: "Tiny mustard seeds perfect for curries, pickles, and sauces.",
    image: "https://media.istockphoto.com/id/1493740548/photo/yellow-mustard-seeds.jpg?b=1&s=612x612&w=0&k=20&c=J-J7yv9lfViownLEeRpgrd3vzxS8SE5o8_kbfezLlbI=",
    price: 210,
    category: "Spice",
    stock: 65,
    rating:4.3,
    reviews:[
      {name:"kevin ochieng", date:"2 days ago", rating:5, text:"Great mustard seeds for my recipes!"},
      {name:"Olivia Brown", date:"1 week ago", rating:4, text:"Good quality mustard seeds, will buy again."},
    ]
  },
  {
    name: "Nutmeg",
    description: "Whole nutmeg seeds — freshly grated for sweet and savory dishes.",
    image: "https://images.pexels.com/photos/672046/pexels-photo-672046.jpeg",
    price: 480,
    category: "Spice",
    stock: 58,
    rating:4.6,
    reviews:[
      {name:"jane wairimu", date:"2 days ago", rating:5, text:"Great nutmeg for my recipes!"},
      {name:"Sophia Davis", date:"1 week ago", rating:4, text:"Good quality nutmeg, will buy again."},
    ]
  },
  {
    name: "Oregano",
    description: "Dried oregano leaves — a must-have for Italian and Mediterranean cuisine.",
    image: "https://media.istockphoto.com/id/653084104/photo/fresh-and-dried-oregano-herb-on-wooden-background.jpg?b=1&s=612x612&w=0&k=20&c=n9cPmNeKCaYzzOCN8YL9jJwem3lxU5fyw6I0Y7RnVCE=",
    price: 260,
    category: "Herb",
    stock: 28,
    rating:4.2,
    reviews:[
      {name:"paul kamau", date:"2 days ago", rating:5, text:"Great oregano for my recipes!"},
      {name:"James Wilson", date:"1 week ago", rating:4, text:"Good quality oregano, will buy again."},
    ]
  },
  {
    name: "Parsley",
    description: "Dried parsley flakes — fresh green flavor for soups and sauces.",
    image: "https://images.pexels.com/photos/13354860/pexels-photo-13354860.jpeg",
    price: 250,
    category: "Herb",
    stock: 75,
    rating:4.4,
    reviews:[
      {name:"alice nyambura", date:"2 days ago", rating:5, text:"Great parsley for my recipes!"},
      {name:"William Johnson", date:"1 week ago", rating:4, text:"Good quality parsley, will buy again."},
    ]
  },
  {
    name: "Basil",
    description: "Dried basil leaves — great for tomato-based dishes and salads.",
    image: "https://images.pexels.com/photos/2575375/pexels-photo-2575375.jpeg",
    price: 240,
    category: "Herb",
    stock: 80,
    rating:4.5,
    reviews:[
      {name:"grace wanjiku", date:"2 days ago", rating:5, text:"Great basil for my recipes!"},
      {name:"Isabella Martinez", date:"1 week ago", rating:4, text:"Good quality basil, will buy again."},
    ]
  },
  {
    name: "Sage",
    description: "Dried sage leaves — aromatic, earthy, and perfect for meat dishes.",
    image: "https://images.pexels.com/photos/4040610/pexels-photo-4040610.jpeg",
    price: 275,
    category: "Herb",
    stock: 90,
    rating:4.1,
    reviews:[ 
      {name:"paul kamau", date:"2 days ago", rating:5, text:"Great sage for my recipes!"},
      {name:"James Wilson", date:"1 week ago", rating:4, text:"Good quality sage, will buy again."},
    ]
  },
  {
    name: "Lemongrass",
    description: "Dried lemongrass stalks — adds a citrusy flavor to tea and soups.",
    image: "https://images.pexels.com/photos/4753646/pexels-photo-4753646.jpeg",
    price: 300,
    category: "Herb",
    stock: 67,
    rating:4.3,
    reviews:[
      {name:"anna nyambura", date:"2 days ago", rating:5, text:"Great lemongrass for my recipes!"},
      {name:"Michael Smith", date:"1 week ago", rating:4, text:"Good quality lemongrass, will buy again."},
    ]
  },
  {
    name: "Curry Powder",
    description: "A blend of ground spices for rich, flavorful stews and sauces.",
    image: "https://images.pexels.com/photos/4198929/pexels-photo-4198929.jpeg",
    price: 350,
    category: "Spice",
    stock: 70,
    rating:4.6,
    reviews:[
      {name:"david kamau", date:"2 days ago", rating:5, text:"Great curry powder for my recipes!"},
      {name:"Charlotte Lee", date:"1 week ago", rating:4, text:"Good quality curry powder, will buy again."},
    ]
  },
  {
    name: "Chili Flakes",
    description: "Crushed red chili flakes for heat and spice in every bite.",
    image: "https://images.pexels.com/photos/6546429/pexels-photo-6546429.jpeg",
    price: 260,
    category: "Spice",
    stock: 85,
    rating:4.7,
    reviews:[
      {name:"brenda karimi", date:"2 days ago", rating:5, text:"Great chili flakes for my recipes!"},
      {name:"Daniel Garcia", date:"1 week ago", rating:4, text:"Good quality chili flakes, will buy again."},
]
},
  {
    name: "White Pepper",
    description:"Milder than black pepper — adds subtle heat to soups and sauces.",
    image:"https://media.istockphoto.com/id/1371163048/photo/white-ground-pepper-and-whole-peppercorn-spice-isolated-on-white-background.jpg?b=1&s=612x612&w=0&k=20&c=vnQFDblZ9lsibNm54HarhUE47UIBXYKwG5v5gKG6IE8=",
    price: 390,
    category: "Spice",
    stock: 40,
    rating:4.2,
    reviews:[
      {name:"charles omollo", date:"2 days ago", rating:5, text:"Great white pepper for my recipes!"},
      {name:"Matthew Rodriguez", date:"1 week ago", rating:4, text:"Good quality white pepper, will buy again."},
]
  },
  {
    name: "Turmeric Roots",
    description: "Dried whole turmeric roots for traditional grinding and herbal use.",
    image:"https://images.pexels.com/photos/31346461/pexels-photo-31346461.jpeg",
    price: 270,
    category: "Herb",
    stock: 55,
    rating:4.5,
    reviews:[
      {name:"edith wanjiku", date:"2 days ago", rating:5, text:"Great turmeric roots for my recipes!"},
      {name:"Anthony Hernandez", date:"1 week ago", rating:4, text:"Good quality turmeric roots, will buy again."},
]
  },
  {
    name: "Aloe Vera Powder",
    description: "Natural aloe vera powder for skin, hair, and health use.",
    image: "https://media.istockphoto.com/id/1333160323/photo/aloe-vera-powder-with-fresh-aloevera-leaf.jpg?b=1&s=612x612&w=0&k=20&c=KfZdA-BIiBKeysZQtRS-EgaFoxQVOdFtTx80a90H93I=",
    price: 420,
    category: "Herb",
    stock: 33,
    rating:4.8,
    reviews:[
      {name:"faith nyambura", date:"2 days ago", rating:5, text:"Great aloe vera powder for my recipes!"},
      {name:"Elizabeth Moore", date:"1 week ago", rating:4, text:"Good quality aloe vera powder, will buy again."},
]
  },
  {
    name: "Neem Leaves",
    description: "Dried neem leaves — known for detox and skin benefits.",
    image: "https://media.istockphoto.com/id/1186254998/photo/green-neem-leaves-and-twig-on-wooden-table-neem-twig-ayurvedic-neem-twig-on-wood-neem-leaves.jpg?b=1&s=612x612&w=0&k=20&c=gKsafQyz2T8pyN3LAmgBhyWfJJDS7erZoNYCCn4yOcw=",
    price: 310,
    category: "Herb",
    stock: 44,
  rating:4.6,
    reviews:[
      {name:"george omollo", date:"2 days ago", rating:5, text:"Great neem leaves for my recipes!"},
      {name:"Jennifer Taylor", date:"1 week ago", rating:4, text:"Good quality neem leaves, will buy again."},
]
  },
{
  name: "Star Anise",
  description: "Beautiful star-shaped spice with a licorice taste, used in Asian cuisine and teas.",
  image: "https://images.pexels.com/photos/753725/pexels-photo-753725.jpeg",
  price: 270,
  category: "Spice",
  stock: 77,
  rating:4.5,
    reviews:[
      {name:"james mbugua", date:"2 days ago", rating:5, text:"Great star anise for my recipes!"},
      {name:"Karen Wilson", date:"1 week ago", rating:4, text:"Good quality star anise, will buy again."},
]

},
{
  name: "Curry Leaves",
  description: "Dried curry leaves that add a rich aroma to Indian-style curries.",
  image: "https://media.istockphoto.com/id/956693940/photo/fresh-curry-leaves-in-coconut-bowl-on-wooden-background.jpg?b=1&s=612x612&w=0&k=20&c=_uTFmuTxN6Kk987y2UQP5R8o3V65XddE0yIIaKSB2yU=",
  price: 220,
  category: "Herb",
  stock: 66,
  rating:4.4, 
    reviews:[
      {name:"james mbugua", date:"2 days ago", rating:5, text:"Great curry leaves for my recipes!"},
      {name:"Karen Wilson", date:"1 week ago", rating:4, text:"Good quality curry leaves, will buy again."}, 
]
},
 {
   name: "Saffron Threads",
   description: "Luxurious saffron threads with rich aroma and golden color — prized for cooking and tea.",
   image: "https://images.pexels.com/photos/10487658/pexels-photo-10487658.jpeg",
   price: 1500,
   category: "Spice",
    stock: 25,
    rating: 5.0,
    reviews: [
      { name: "Luxury Chef", date: "1 week ago", rating: 5, text: "The finest saffron I've ever used. Worth every penny!" },
      { name: "Tea Connoisseur", date: "2 weeks ago", rating: 5, text: "Transforms any dish into something extraordinary." },
      { name: "Home Cook", date: "3 weeks ago", rating: 5, text: "Perfect for special occasions. Amazing quality." }
    ]
  },
  {
    name: "Lavender Flowers",
    description: "Fragrant dried lavender — perfect for tea, baking, and aromatherapy.",
    image: "https://images.pexels.com/photos/34298302/pexels-photo-34298302.jpeg",
    price: 420,
    category: "Herb",
    stock: 38,
    rating: 4.8,
    reviews: [
      { name: "Baker", date: "1 week ago", rating: 5, text: "Adds a beautiful aroma to my pastries!" },
      { name: "Tea Lover", date: "2 weeks ago", rating: 4, text: "Great for herbal tea, but a bit pricey." },
      { name: "Garden Enthusiast", date: "3 weeks ago", rating: 5, text: "Perfect for drying and preserving." }
    ]
  },
  {
    name: "Black Cumin (Nigella Seeds)",
    description: "Tiny black seeds with peppery flavor — used in breads and pickles.",
    image: "https://media.istockphoto.com/id/1021641446/photo/nigella.jpg?b=1&s=612x612&w=0&k=20&c=t3Lh-kc18Nu6HONE-YGHIzFK7Fu-splpMhSECYiGdRo=",
    price: 310,
    category: "Spice",
    stock: 50,
    rating:4.5,
    reviews:[
      { name: "Baker", date: "1 week ago", rating: 5, text: "Adds a beautiful aroma to my pastries!" },
      { name: "Garden Enthusiast", date: "3 weeks ago", rating: 5, text: "Perfect for drying and preserving." }
    ]
  },
  {
    name: "Tamarind",
    description: "Tangy-sweet tamarind fruit pulp — perfect for sauces and chutneys.",
    image: "https://images.pexels.com/photos/12188530/pexels-photo-12188530.jpeg",
    price: 270,
    category: "Spice",
    stock: 45,
    rating:4.3,
    reviews:[
      { name: "Baker", date: "1 week ago", rating: 5, text: "Adds a beautiful aroma to my pastries!" },
      { name: "Garden Enthusiast", date: "3 weeks ago", rating: 5, text: "Perfect for drying and preserving." }
    ]
  },
  {
    name: "Asafoetida (Hing)",
    description: "Strong aromatic spice used in Indian cooking to enhance flavor.",
    image:"https://media.istockphoto.com/id/860778428/photo/asafoetida-cake-and-powder-or-hing-or-heeng.jpg?b=1&s=612x612&w=0&k=20&c=A8OAuhsCZ9gq0TNESLVZMtmvD2x_wLBzqinUMxoua5U=",
    price: 450,
    category: "Spice",
    stock: 29,
    rating:4.6,
    reviews:[
      {name:"jame kimani", date:"2 days ago", rating:5, text:"Great asafoetida for my recipes!"},
      {name:"Sarah Johnson", date:"1 week ago", rating:4, text:"Good quality asafoetida, will buy again."},
]
  },
  {
    name: "Dill Seeds",
    description: "Sweet and aromatic seeds used for pickling and soups.",
    image: "https://media.istockphoto.com/id/863096638/photo/background-of-dried-dill-seeds-dill-weed-in-wooden-spoon.jpg?b=1&s=612x612&w=0&k=20&c=M8s4IFlZtB4CUnGeIilrTNeWv6eEOrV1ovr_45OaVfk=",
    price: 260,
    category: "Spice",
    stock: 60,
    rating:4.5,
    reviews:[
      {name:"jame kimani", date:"2 days ago", rating:5, text:"Great asafoetida for my recipes!"},
      {name:"Sarah Johnson", date:"1 week ago", rating:4, text:"Good quality asafoetida, will buy again."},
]
  },
  {
    name: "Bay Laurel Powder",
    description: "Fine ground laurel leaves — convenient for seasoning sauces and stews.",
    image: "https://media.istockphoto.com/id/1313868357/photo/garam-masala.jpg?b=1&s=612x612&w=0&k=20&c=W_7JDEvW9MuFfkvZel0U02ThrOLLmuSBV4ewtdxnJ4U=",
    price: 240,
    category: "Spice",
    stock: 70,
    rating:4.4,
    reviews:[
      {name:"jack karua", date:"2 days ago", rating:5, text:"Great bay laurel powder for my recipes!"},
      {name:"Saran  karimi", date:"1 week ago", rating:4, text:"Good quality bay laurel powder, will buy again."},
]
  },
  {
    name: "Holy Basil (Tulsi)",
    description: "Sacred herb known for its medicinal properties and soothing tea flavor.",
    image: "https://media.istockphoto.com/id/1245095474/photo/holy-basil-or-tulsi-leaves.jpg?b=1&s=612x612&w=0&k=20&c=EVBx8eMtUBPPDz67vcJY93xPpXnp8qrfbcyB6ps3BXw=",
    price: 300,
    category: "Herb",
    stock: 42,
    rating:4.7,
    reviews:[
      {name:"jeremiah mwangi", date:"2 days ago", rating:5, text:"Great holy basil for my recipes!"},
      {name:"Laura Scott", date:"1 week ago", rating:4, text:"Good quality holy basil, will buy again."},
]
  },
  {
    name: "Fenugreek Leaves (Kasuri Methi)",
    description: "Dried fenugreek leaves with distinctive aroma for Indian curries.",
    image: "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg",
    price: 290,
    category: "Herb",
    stock: 55,
    rating:4.3,
    reviews:[
      {name:"matthew ngochi", date:"2 days ago", rating:5, text:"Great fenugreek leaves for my recipes!"},
      {name:"Emily Davis", date:"1 week ago", rating:4, text:"Good quality fenugreek leaves, will buy again."},
]
  },
  {
    name: "Cocoa Powder",
    description: "Pure unsweetened cocoa powder for baking and hot beverages.",
    image: "https://images.pexels.com/photos/691152/pexels-photo-691152.jpeg",
    price: 360,
    category: "Spice",
    stock: 33,
    rating:4.6,
    reviews:[
      {name:"joseph mwangi", date:"2 days ago", rating:5, text:"Great cocoa powder for my recipes!"},
      {name:"Olivia Garcia", date:"1 week ago", rating:4, text:"Good quality cocoa powder, will buy again."},
]
  },
  {
    name: "Tarragon",
    description: "Aromatic herb used in French cuisine — adds a sweet, anise-like flavor.",
    image: "https://media.istockphoto.com/id/504070278/photo/tarragon.jpg?b=1&s=612x612&w=0&k=20&c=yWugTqaKo2bE4a7iih7w6LFzN53PSatZMbjY98CPWT4=",
    price: 310,
    category: "Herb",
    stock: 48,
    rating:4.2,
    reviews:[
      {name:"paul kimani", date:"2 days ago", rating:5, text:"Great tarragon for my recipes!"},
      {name:"Sophia Wilson", date:"1 week ago", rating:4, text:"Good quality tarragon, will buy again."},
]
  },
  {
    name: "Black Salt (Kala Namak)",
    description: "Mineral-rich salt with unique sulfurous flavor — used in Indian dishes.",
    image: "https://media.istockphoto.com/id/1026396226/photo/black-indian-salt-crystals-and-powder.jpg?b=1&s=612x612&w=0&k=20&c=TEanmLdbe6AvEmczM1b0JNkb6ZR_kZESO1zlvWa_nQM=",
    price: 220,
    category: "Spice",
    stock: 75,
    rating:4.5,
    reviews:[
      {name:"jack karua", date:"2 days ago", rating:5, text:"Great black salt for my recipes!"},
      {name:"Saran  karimi", date:"1 week ago", rating:4, text:"Good quality black salt, will buy again."},
]
  },
  {
    name: "Sea Salt Crystals",
    description: "Coarse natural sea salt — ideal for seasoning and preserving.",
    image: "https://media.istockphoto.com/id/165820985/photo/heap-of-salt.jpg?b=1&s=612x612&w=0&k=20&c=Maz1oLCQNVzGUTAmYNz4JpcdNWwyrVNx9F8aCtZypyU=",
    price: 200,
    category: "Spice",
    stock: 80,
    rating:4.4,
    reviews:[
      {name:"luke oginga", date:"2 days ago", rating:5, text:"Great sea salt crystals for my recipes!"},
      {name:"James Brown", date:"1 week ago", rating:4, text:"Good quality sea salt crystals, will buy again."},
]
  },
  {
    name: "Coconut Powder",
    description: "Finely ground dried coconut — adds richness to curries and desserts.",
    image:"https://media.istockphoto.com/id/1307917023/photo/grated-coconut-powder-falling-out-of-a-coconut-shell-with-copy-space.jpg?s=612x612&w=0&k=20&c=1P2WOKfWwlB_DliRdODx5ILE16TFN1Ww0iiZlQo-_wk=",
    price: 340,
    category: "Spice",
    stock: 50,
    rating:4.5,
    reviews:[
      {name:"malachi mambo", date:"2 days ago", rating:5, text:"Great coconut powder for my recipes!"},
      {name:"Saran namimi", date:"1 week ago", rating:4, text:"Good quality coconut powder, will buy again."},
]
  },
  {
    name: "Licorice Root",
    description: "Sweet herb root with medicinal properties and natural sweetness.",
    image: "https://media.istockphoto.com/id/637366858/photo/the-herbal-plant-liquorice.jpg?b=1&s=612x612&w=0&k=20&c=oF_D5pSQGKuPPKT6Vq8jcyDf7kudJyFIprDA3AZiWGE=",
    price: 390,
    category: "Herb",
    stock: 27,
    rating:4.7,
    reviews:[
      {name:"joseph mwangi", date:"2 days ago", rating:5, text:"Great licorice root for my recipes!"},
      {name:"Emily Clark", date:"1 week ago", rating:4, text:"Good quality licorice root, will buy again."},
]
  },
  {
    name: "Celery Seeds",
    description: "Tiny seeds with earthy, salty flavor — used in soups and spice mixes.",
    image: "https://media.istockphoto.com/id/1288921578/photo/celery-seeds-spilled-from-a-teaspoon.jpg?b=1&s=612x612&w=0&k=20&c=L4cDua9rae5RJL0nQixn_Cc_15rTKgdkn6H2Hv-0iHA=",
    price: 260,
    category: "Spice",
    stock: 60,
    rating:4.3,
    reviews:[
      {name:"David mukami", date:"2 days ago", rating:5, text:"Great celery seeds for my recipes!"},
      {name:"Sharon  wanjiru", date:"1 week ago", rating:4, text:"Good quality celery seeds, will buy again."},
]
  },
  {
    name: "Guava Leaves",
    description: "Dried guava leaves — used for making herbal tea and natural remedies.",
    image: "https://media.istockphoto.com/id/1445366920/photo/rain-soaked-ripe-guava.jpg?b=1&s=612x612&w=0&k=20&c=pmP4T_0yUkp8I3fxm5b1lkjRfcSGpsTzvhB92ZJO-Zc=",
    price: 310,
    category: "Herb",
    stock: 35,
    rating:4.6,
    reviews:[
      {name:"joseph mwangi", date:"2 days ago", rating:5, text:"Great guava leaves for my recipes!"},
      {name:"Emily Clark", date:"1 week ago", rating:4, text:"Good quality guava leaves, will buy again."},
]

  },
  {
    name: "Chia Seeds",
    description: "Nutritious superfood rich in omega-3 and fiber — great for smoothies.",
    image: "https://images.pexels.com/photos/938699/pexels-photo-938699.jpeg",
    price: 350,
    category: "Herb",
    stock: 47,
    rating:4.4,
    reviews:[
      {name:"jack karua", date:"2 days ago", rating:5, text:"Great chia seeds for my recipes!"},
      {name:"Saran  karimi", date:"1 week ago", rating:4, text:"Good quality chia seeds, will buy again."},
]
  },
  {
    name: "Vanilla Pods",
    description: "Whole premium vanilla pods — aromatic and rich for baking and desserts.",
    image: "https://media.istockphoto.com/id/1211914108/photo/scattered-protein-and-measuring-spoon-on-white-background-top-view-concert-of-sports-nutrition.jpg?b=1&s=612x612&w=0&k=20&c=zltYuyOGx9ML_A8Kt98tSKTuMfrJKW9aTJ62I2IRQPA=",
    price: 1600,
    category: "Spice",
    stock: 20,
    rating:4.4,
    reviews:[
      {name:"jack karua", date:"2 days ago", rating:5, text:"Great vanilla pods for my recipes!"},
      {name:"Saran  karimi", date:"1 week ago", rating:4, text:"Good quality vanilla pods, will buy again."},
]
  },
];

export default products;