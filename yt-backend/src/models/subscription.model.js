import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }, // Normal users // subscribers // One who is subscribing
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }, // A channels // one to whom subscriber is subscribing
    },
    { timestamps: true }
);

const Subscription = model("Subscription", subscriptionSchema);
export default Subscription;
