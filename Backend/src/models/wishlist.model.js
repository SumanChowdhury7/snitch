import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
            },
        }
    ]
});

const wishlistModel = mongoose.model('wishlist', wishlistSchema);

export default wishlistModel;