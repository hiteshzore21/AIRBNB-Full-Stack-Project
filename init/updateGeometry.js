const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../MODELS/listing");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

main().then(() => {
    console.log("DB Connected");
}).catch(err => console.log(err));

const updateGeometry = async() => {
    let listings = await Listing.find({ geometry: null });
    console.log(`Found ${listings.length} listings without geometry`);

    for(let listing of listings) {
        try {
            let response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${listing.location}&format=json&limit=1`,
                { headers: { 'User-Agent': 'WanderlustApp/1.0' } }
            );

            if(response.data.length > 0) {
                let { lat, lon } = response.data[0];
                listing.geometry = {
                    type: "Point",
                    coordinates: [parseFloat(lon), parseFloat(lat)]
                };
                await listing.save();
                console.log(`Updated: ${listing.title} → [${lon}, ${lat}]`);
            }

          
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch(err) {
            console.log(`Failed for ${listing.title}:`, err.message);
        }
    }
    console.log("All listings updated!");
}

updateGeometry();