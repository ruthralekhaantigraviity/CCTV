import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                toast.success('Removed from Wishlist', {
                    style: { borderRadius: '0', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                });
                return prev.filter(item => item.id !== product.id);
            } else {
                toast.success('Added to Wishlist', {
                    icon: '💖',
                    style: { borderRadius: '0', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                });
                return [...prev, product];
            }
        });
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
