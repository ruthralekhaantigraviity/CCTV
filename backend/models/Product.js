const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 5 },
    description: { type: String },
    image: { type: String }, // Base64 or URL
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    }
}, { timestamps: true });

// Middleware to update status based on stockQuantity
productSchema.pre('save', function (next) {
    if (this.stockQuantity <= 0) {
        this.status = 'Out of Stock';
    } else if (this.stockQuantity <= this.reorderLevel) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
