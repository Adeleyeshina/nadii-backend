import mongoose  from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected");
        console.log(conn.connection.host);
    } catch (error) {
        console.log("Error connecting to database server", error.message);
        
    }
}

export default connectDB