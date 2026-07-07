import mongoose from "mongoose";
import dns from "dns";

// Override DNS servers to Google and Cloudflare to resolve SRV records properly
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB is connected");
    }
    catch (err) {
        console.log(err);
    }
}
export default connectDB;
