import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
    // HeroSlideSection
    const slides = [
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674421/jade4_gsrdpy.jpg', order: 1, isActive: true },
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674421/jade3_uq8uc9.jpg', order: 2, isActive: true },
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674421/jade2_bgxn13.jpg', order: 3, isActive: true },
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674059/WhatsApp_Image_2026-05-14_at_10.14.09_AM_5_irwlwg.jpg', order: 4, isActive: true },
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674421/jade1_rn6uuj.jpg', order: 5, isActive: true },
        { imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674058/WhatsApp_Image_2026-05-14_at_10.14.09_AM_2_f7rxbk.jpg', order: 6, isActive: true },
    ];

    for (const slide of slides) {
        await prisma.heroSlide.upsert({
            where: { order: slide.order },
            update: slide,
            create: slide
        })
    }

    // Welcome Section
    const welcome = {
        subheading: "Welcome to",
        heading: "Jade River Resort",
        paragraphs: "Set across more than 10 acres of pristine landscape in the Pahalgam            region of Kashmir, Jade River Resort by Defoy offers a rare blend of untouched natural beauty and refined hospitality. The property is uniquely defined by gushing river streams that flow through the estate, creating a constantly soothing oundscape and an immersive connection with nature. \n\n The resort features elegantly designed wooden cottages that reflect the region’s architectural charm while maintaining modern comfort standards. Guests can choose from premium rooms with private balconies, spacious suites, and exclusive duplex suites—all thoughtfully positioned to offer uninterrupted views of the surrounding greenery and flowing waters. \n\n A standout feature of the resort is its natural swimming pool, designed to harmonize with the environment rather than disrupt it, offering a refreshing and authentic experience. The on-site restaurant serves a curated selection of local and multi-cuisine dishes, while the café provides a relaxed setting for lighter meals and conversations against scenic backdrops. \n\n For corporate and group travelers, the resort includes a well-equipped conference hall, making it suitable for offsites, retreats, and private events. Despite its tranquil setting, the     property is structured to cater to both leisure and business needs with equal finesse. Jade River Resort by Defoy is positioned as a destination for slow, immersive travel—where guests are encouraged to unwind, reconnect, and experience Kashmir beyond the usual pace."
    }

    await prisma.welcome.upsert({
        where: { id: 1 },
        update: welcome,
        create: { id: 1, ...welcome }
    })


    // Rooms
    const roomTypesData = [
        {
            category: 'DOUBLE',
            price: 5000,
            image: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781933944/jaderooms4_hiq79a.jpg',
            description: 'Double rooms promise simple and smart comfort. The newly made rooms offer a king-size bed, high-speed Wi-Fi, tea-coffee-making facilities, a minibar, and indulgent bath amenities. These rooms are perfect to recharge after a day full of hilly excursions.',
            area: 200,
            maxGuests: 2,
        },
        {
            category: 'DELUXE',
            price: 7000,
            image: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781933940/jaderooms1_vjqotn.jpg',
            description: 'Elevate your stay with refreshing mountain views. Featuring a premium king-size bed, contemporary interiors, high-speed Wi-Fi, minibar and tea-coffee making facilities, these rooms made for the guests who like to wake up to good views while still choosing the rooms that offer subtle elegance and functional detail.',
            area: 250,
            maxGuests: 4,
        },
        {
            category: 'EXECUTIVE_SUITE',
            price: 10926,
            image: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781933940/jaderoom2_kkqy7k.jpg',
            description: 'Indulge in the breathtaking beauty of Pahalgam with our meticulously designed Suite Rooms with Balcony and enjoy an elevated experience with club benefits. These rooms feature a seating area, work desk, LED TV, wooden closet and spacious interiors. With Executive Suites, you will get an exclusive access to the benefits like welcome drink on arrival, early check-in and late check-out, buffet breakfast and dinner, daily hi-tea and much more, to enhance your stay experience.',
            area: 300,
            maxGuests: 6,
        },
        {
            category: 'EXECUTIVE_SUITE_DUPLEX',
            price: 11472,
            image: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781933940/jaderooms3_trpdwt.jpg',
            description: 'The elegant Mountain View Suite, offers breath-taking views of the surrounding valley and spectacular hill scenery in the backdrop. The spacious living room with sofa and a dining area is ideal to witness fresh mornings and dreamy sunsets. The suite provides a serene and comfortable retreat for guests seeking a relaxing, upscale experience in the lap of nature.',
            area: 323,
            maxGuests: 6,
        }
    ]

    const roomTypeByCategory = {}
    for (const rt of roomTypesData) {
        const roomType = await prisma.roomType.upsert({
            where: { category: rt.category },
            update: rt,
            create: rt
        })
        roomTypeByCategory[rt.category] = roomType
    }

    const roomsData = [
        { number: '101', category: 'DOUBLE' },
        { number: '102', category: 'DELUXE' },
        { number: '103', category: 'EXECUTIVE_SUITE' },
        { number: '104', category: 'EXECUTIVE_SUITE_DUPLEX' },
        { number: '201', category: 'DOUBLE' },
    ]

    for (const room of roomsData) {
        const roomTypeId = roomTypeByCategory[room.category].id
        await prisma.room.upsert({
            where: { number: room.number },
            update: { roomTypeId },
            create: { number: room.number, roomTypeId }
        })
    }

    // Dining
    const dinings = [
        {
            title: 'Dining hall entrance',
            description: 'The entrance to our dining hall',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674060/WhatsApp_Image_2026-05-14_at_10.14.09_AM_8_wldmiq.jpg',
            category: 'DINING',
            isActive: true
        },
        {
            title: 'Dining hall',
            description: 'Enjoy your meal in our dining hall',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674059/WhatsApp_Image_2026-05-14_at_10.14.09_AM_11_shjfs0.jpg',
            category: 'DINING',
            isActive: true
        },
        {
            title: 'Buffet',
            description: 'Enjoy your meal in our dining hall',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1781674059/WhatsApp_Image_2026-05-14_at_10.14.09_AM_6_mqatsm.jpg',
            category: 'DINING',
            isActive: true
        },
        {
            title: 'Bar',
            description: 'Enjoy our premium bevrages in the open environment near the bonfire',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1783054046/pexels-nafihx-sulaika-3484032-12117189_zbuyvw.jpg',
            category: 'BAR',
            isActive: true
        },
        {
            title: 'Bar-2',
            description: 'Enjoy our premium bevrages in the open environment near the bonfire',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1783054042/pexels-bertellifotografia-33870513_wy3spb.jpg',
            category: 'BAR',
            isActive: true
        },
        {
            title: 'Bar-3',
            description: 'Enjoy our premium bevrages in the open environment near the bonfire',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1783054621/pexels-mikhail-nilov-6623922_kn9lly.jpg',
            category: 'BAR',
            isActive: true
        }
    ]

    for (const dining of dinings) {
        await prisma.diningGallery.upsert({
            where: { title: dining.title },
            update: dining,
            create: dining
        })
    }
    // Attraction
    const attractions = [
        {
            title: 'Lidder Amusement Park',
            description: 'Packed with scenic walkways, miniature trains and an array of exciting rides and swings, this amusement park promises a fun-filled day out in the lap of snow with pristine-white mountains as the backdrop.',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1782372119/attraction1_fohak9.jpg',
            distance: '18.2 km',
            isActive: true
        },
        {
            title: 'Chandanwari',
            description: 'With Lidder River meandering on one side and pristine mountain peaks on the other, Chandanwari is an ideal picnic spot famous for snow sledging on a snow bridge. Feast your eyes on the breath-taking mountain scenery.',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1782372125/attraction2_n39zae.jpg',
            distance: '16.4 km',
            isActive: true
        },
        {
            title: 'Poshwan Park',
            description: 'Just think of a place where the Himalayas rise to the heavens, and the Lidder River sings stories as it meanders. Poshwan Park, located in the centre of Pahalgam, is not just a park but a place of calm, serenity and beauty.',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1782372100/attraction3_pohfh0.jpg',
            distance: '17.5 km',
            isActive: true
        },
        {
            title: 'Betaab Valley',
            description: 'Betaab Valley is named after the Bollywood movie “Betaab” which was shot here and is a paradise for nature lovers and photographers. The valley is described as green, with clear flowing streams and snowy mountains.',
            imageUrl: 'https://res.cloudinary.com/dyoxqmbvt/image/upload/v1782372101/attraction4_m8gdef.jpg',
            distance: '23.7 km',
            isActive: true
        },
    ]

    for (const attraction of attractions) {
        await prisma.attraction.upsert({
            where: { title: attraction.title },
            update: attraction,
            create: attraction
        })
    }

    // Amenities
    const amenities = [
        { title: "Air Conditioning", icon: "TbAirConditioning" },
        { title: "Heater", icon: "LuHeater" },
        { title: "Tv", icon: "ImTv" },
        { title: "Minibar", icon: "BiFridge" },
        { title: "Restaurant", icon: "MdRestaurant" },
        { title: "Free Parking", icon: "FaParking" },
        { title: "Free WiFi", icon: "FaWifi" },
        { title: "Adventure Sports", icon: "GiMountainClimbing" },
        { title: "Room Service", icon: "FaConciergeBell" },
        { title: "Garden View", icon: "MdNature" },
        { title: "Bonfire", icon: "FaFire" },
        { title: "Housekeeping", icon: "MdCleaningServices" },
        { title: "Check-in", icon: "FaRegClock" },
        { title: "Check-out", icon: "FaRegClock" },
        { title: "Minimum-age", icon: "IoPerson" },
    ]

    for (const amenity of amenities) {
        await prisma.amenity.upsert({
            where: { title: amenity.title },
            update: amenity,
            create: amenity
        })
    }

    const reviews = [
        {
            name: "Rahul Sharma",
            rating: 5,
            comment: "Absolutely breathtaking location! The rooms were luxurious and the staff was incredibly hospitable. Will definitely visit again.",
            isActive: true
        },
        {
            name: "Kajal",
            rating: 4,
            comment: "The best resort experience I've ever had. Waking up to the view of the mountains every morning was magical.",
            isActive: true
        },
        {
            name: "Amit Verma",
            rating: 4,
            comment: "Beautiful property with excellent amenities. The dining experience was top notch. Highly recommended for couples.",
            isActive: true
        },
        {
            name: "Sneha Kapoor",
            rating: 5,
            comment: "Perfect getaway from the city chaos. The river view from our room was stunning and the food was delicious.",
            isActive: true
        },
    ]

    for (const review of reviews) {
        await prisma.review.upsert({
            where: { name: review.name },
            update: review,
            create: review
        })
    }

    // About
    const abouts = [
        {
            ownerName: "Mir Qaiser",
            storyParagraphs: "Nestled in the breathtaking valley of Pahalgam, Jade River Resort was born from a dream — a dream to create a sanctuary where the timeless beauty of Kashmir could be experienced in the lap of luxury. Founded in 2022, our resort has been a labor of love, carefully crafted to blend seamlessly with the natural landscape that surrounds it. \n\n The Lidder River, which flows gently beside our property, has been the soul of our resort since its inception. It was this river — jade green in color, serene in nature — that inspired our name. We wanted our guests to feel the same sense of peace and wonder that we felt when we first discovered this magical place nestled between the mighty Himalayas. \n\n Over the years, Jade River Resort has grown from a small boutique property into one of Pahalgam's most celebrated destinations. Yet through every expansion and every new addition, we have remained true to our founding philosophy — that true luxury lies not in opulence alone, but in the harmony between comfort, nature, and authentic Kashmiri hospitality. \n\n Today, our resort stands as a testament to that vision. From our carefully designed rooms that frame the mountains like living paintings, to our restaurant that celebrates the rich culinary heritage of Kashmir, every corner of Jade River Resort tells a story — a story of passion, perseverance, and an unwavering commitment to making every guest's stay truly unforgettable.",
            ownerImage: "https://res.cloudinary.com/dyoxqmbvt/image/upload/v1784004120/WhatsApp_Image_2026-07-14_at_10.07.20_AM_j91mvb.jpg",
            visionParagraphs: "When I first stood by the banks of the Lidder River and felt the cool mountain breeze on my face, I knew this was where I wanted to build something special. Not just a hotel, but a home — a place where every guest would feel the warmth of Kashmiri culture and the magic of this land. \n\n My vision for Jade River Resort has always been simple — to offer our guests an experience that goes beyond the ordinary. To show them the real Kashmir, with its rich traditions, its breathtaking landscapes, and its people who have an innate gift for hospitality. \n\n Every decision we make at Jade River Resort is guided by this vision. From the locally sourced materials we use in our construction, to the authentic Kashmiri cuisine we serve, to the community initiatives we support — everything is done with the intention of creating something meaningful and sustainable for generations to come."
        }
    ]

    for (const about of abouts) {
        await prisma.about.upsert({
            where: { ownerName: about.ownerName },
            update: about,
            create: about
        })
    }

    console.log('data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })