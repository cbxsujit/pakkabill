import React, { useEffect, useState } from 'react';

// --- Types ---

interface ServiceItem {
    id: string;
    name: string;
    price: number;
}

interface CartItem extends ServiceItem {
    cartId: string;
    quantity: number;
}

interface BusinessProfile {
    name: string;
    phone: string;
    terms: string;
}

// --- Icons ---

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

// --- Main App Component ---

const App = () => {
    // --- State ---
    const [activeTab, setActiveTab] = useState<'saved' | 'quote'>('quote');

    // Business Profile
    const [profile, setProfile] = useState<BusinessProfile>({
        name: '',
        phone: '',
        terms: '50% Advance Required. Goods once sold will not be returned.'
    });
    const [isProfileOpen, setIsProfileOpen] = useState(true);

    // Saved Services (Master List)
    const [savedServices, setSavedServices] = useState<ServiceItem[]>([]);

    // Quote State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isGstEnabled, setIsGstEnabled] = useState(false);

    // Input States (For Make Quote)
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState('');

    // Input States (For Saved Items Tab)
    const [masterItemName, setMasterItemName] = useState('');
    const [masterItemPrice, setMasterItemPrice] = useState('');

    // --- Effects ---

    // Load data on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('pakkaBill_profile');
        if (savedProfile) setProfile(JSON.parse(savedProfile));

        const savedList = localStorage.getItem('pakkaBill_services');
        if (savedList) setSavedServices(JSON.parse(savedList));
    }, []);

    // Save profile on change
    useEffect(() => {
        localStorage.setItem('pakkaBill_profile', JSON.stringify(profile));
    }, [profile]);

    // Save services on change
    useEffect(() => {
        localStorage.setItem('pakkaBill_services', JSON.stringify(savedServices));
    }, [savedServices]);

    // --- Handlers: Business Profile ---

    const handleProfileChange = (field: keyof BusinessProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    // --- Handlers: Saved Items (Tab 1) ---

    const addMasterItem = () => {
        if (!masterItemName || !masterItemPrice) return;
        const newItem: ServiceItem = {
            id: Date.now().toString(),
            name: masterItemName,
            price: parseFloat(masterItemPrice)
        };
        setSavedServices([...savedServices, newItem]);
        setMasterItemName('');
        setMasterItemPrice('');
    };

    const deleteMasterItem = (id: string) => {
        setSavedServices(savedServices.filter(item => item.id !== id));
    };

    // --- Handlers: Make Quote (Tab 2) ---

    const handleServiceSelect = (id: string) => {
        setSelectedServiceId(id);
        const service = savedServices.find(s => s.id === id);
        if (service) {
            setNewItemName(service.name);
            setNewItemPrice(service.price.toString());
        } else {
            setNewItemName('');
            setNewItemPrice('');
        }
    };

    const addToCart = () => {
        if (!newItemName || !newItemPrice) return;

        const price = parseFloat(newItemPrice);

        // 1. Add to Cart
        const cartItem: CartItem = {
            id: selectedServiceId || Date.now().toString(), // Use existing ID if from dropdown, else new
            cartId: Date.now().toString() + Math.random(), // Unique ID for cart instance
            name: newItemName,
            price: price,
            quantity: newItemQty
        };
        setCart([...cart, cartItem]);

        // 2. Smart Save Logic
        // Check if this item exists in savedServices (case insensitive check on name)
        const exists = savedServices.some(s => s.name.toLowerCase() === newItemName.trim().toLowerCase());

        if (!exists) {
            const newSavedItem: ServiceItem = {
                id: Date.now().toString(),
                name: newItemName,
                price: price
            };
            // Add to saved services list automatically
            setSavedServices([...savedServices, newSavedItem]);
        }

        // Reset inputs
        setNewItemName('');
        setNewItemPrice('');
        setNewItemQty(1);
        setSelectedServiceId('');
    };

    const updateQuantity = (cartId: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.cartId === cartId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    // --- Calculations ---

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = isGstEnabled ? subtotal * 0.18 : 0;
    const grandTotal = subtotal + gstAmount;

    // --- WhatsApp Export ---

    const copyForWhatsapp = () => {
        let text = `*ESTIMATE from ${profile.name || 'Service Provider'}*\n`;
        if (profile.phone) text += `📞 ${profile.phone}\n`;
        text += `--------------------------------\n`;

        cart.forEach((item, index) => {
            text += `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
        });

        text += `--------------------------------\n`;
        text += `*Subtotal: ₹${subtotal}*\n`;
        if (isGstEnabled) text += `GST (18%): ₹${gstAmount.toFixed(2)}\n`;
        text += `*GRAND TOTAL: ₹${grandTotal.toFixed(0)}*\n\n`;

        if (profile.terms) {
            text += `[Terms & Conditions]\n${profile.terms}`;
        }

        navigator.clipboard.writeText(text).then(() => {
            alert('Quote copied to clipboard! Open WhatsApp to paste.');
        });
    };

    // --- Render ---

    return (
        <div className="min-h-screen pb-20 font-sans text-slate-800">

            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tight">Pakka Bill</h1>
                    <div className="flex space-x-1 bg-blue-700 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTab === 'saved' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:bg-blue-600'}`}
                        >
                            Items
                        </button>
                        <button
                            onClick={() => setActiveTab('quote')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTab === 'quote' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:bg-blue-600'}`}
                        >
                            Quote
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* --- Tab 1: Saved Items (Master List) --- */}
                {activeTab === 'saved' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <ListIcon /> Manage Products
                            </h2>

                            {/* Add New Master Item */}
                            <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Service / Product Name"
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={masterItemName}
                                    onChange={(e) => setMasterItemName(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={masterItemPrice}
                                        onChange={(e) => setMasterItemPrice(e.target.value)}
                                    />
                                    <button
                                        onClick={addMasterItem}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        <PlusIcon /> Add
                                    </button>
                                </div>
                            </div>

                            {/* List of Saved Items */}
                            <div className="space-y-2">
                                {savedServices.length === 0 ? (
                                    <p className="text-center text-slate-400 py-4 italic">No saved items yet.</p>
                                ) : (
                                    savedServices.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <div>
                                                <p className="font-semibold text-slate-800">{item.name}</p>
                                                <p className="text-slate-500 text-sm">₹{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteMasterItem(item.id)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Tab 2: Make Quote --- */}
                {activeTab === 'quote' && (
                    <div className="space-y-6 animate-fade-in">

                        {/* Section A: Business Setup */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div
                                className="bg-slate-50 p-4 flex justify-between items-center cursor-pointer select-none"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                                    Business Details
                                </h2>
                                {isProfileOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </div>

                            {isProfileOpen && (
                                <div className="p-4 space-y-3 animate-slide-down">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Business Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Rahul Electronics"
                                            value={profile.name}
                                            onChange={(e) => handleProfileChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                                        <input
                                            type="tel"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                                            placeholder="e.g. 9876543210"
                                            value={profile.phone}
                                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Terms & Conditions</label>
                                        <textarea
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-sm"
                                            rows={2}
                                            placeholder="e.g. 50% Advance"
                                            value={profile.terms}
                                            onChange={(e) => handleProfileChange('terms', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section B: The Calculator */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <FileTextIcon /> Add Item
                            </h2>

                            {/* Item Input Form */}
                            <div className="space-y-3">
                                {/* Dropdown from Saved Items */}
                                <select
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700"
                                    value={selectedServiceId}
                                    onChange={(e) => handleServiceSelect(e.target.value)}
                                >
                                    <option value="">Select a service (or type manually)...</option>
                                    {savedServices.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} - ₹{s.price}</option>
                                    ))}
                                </select>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        className="w-2/3 p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newItemName}
                                        onChange={(e) => {
                                            setNewItemName(e.target.value);
                                            if (selectedServiceId) setSelectedServiceId(''); // Clear selection if user edits manually
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="w-1/3 p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newItemPrice}
                                        onChange={(e) => setNewItemPrice(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                                    <span className="text-sm font-medium text-slate-600 ml-2">Quantity:</span>
                                    <div className="flex items-center bg-white rounded-md shadow-sm border border-slate-200">
                                        <button
                                            onClick={() => setNewItemQty(Math.max(1, newItemQty - 1))}
                                            className="p-3 text-slate-500 hover:text-blue-600 active:bg-slate-100"
                                        >
                                            <MinusIcon />
                                        </button>
                                        <span className="w-8 text-center font-bold text-slate-700">{newItemQty}</span>
                                        <button
                                            onClick={() => setNewItemQty(newItemQty + 1)}
                                            className="p-3 text-slate-500 hover:text-blue-600 active:bg-slate-100"
                                        >
                                            <PlusIcon />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={addToCart}
                                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-sm active:transform active:scale-95 transition-all"
                                >
                                    Add to Bill
                                </button>
                                <p className="text-xs text-center text-slate-400">
                                    *New items will be auto-saved to your Master List
                                </p>
                            </div>

                            {/* Cart List */}
                            {cart.length > 0 && (
                                <div className="mt-6">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <th className="py-2">Item</th>
                                                <th className="py-2 text-center">Qty</th>
                                                <th className="py-2 text-right">Price</th>
                                                <th className="py-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((item) => (
                                                <tr key={item.cartId} className="border-b border-slate-50 last:border-0 group">
                                                    <td className="py-3 font-medium text-slate-700">{item.name}</td>
                                                    <td className="py-3">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button onClick={() => updateQuantity(item.cartId, -1)} className="text-slate-300 hover:text-blue-600"><MinusIcon /></button>
                                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.cartId, 1)} className="text-slate-300 hover:text-blue-600"><PlusIcon /></button>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-right font-medium">₹{item.price * item.quantity}</td>
                                                    <td className="py-3 text-right">
                                                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-300 hover:text-red-500 ml-2">
                                                            <TrashIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Total Section */}
                            {cart.length > 0 && (
                                <div className="mt-6 pt-4 border-t-2 border-slate-100 space-y-3">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={isGstEnabled}
                                                onChange={(e) => setIsGstEnabled(e.target.checked)}
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            Add 18% GST
                                        </label>
                                        {isGstEnabled && <span className="text-slate-500">₹{gstAmount.toFixed(2)}</span>}
                                    </div>

                                    <div className="flex justify-between items-center text-xl font-black text-slate-800 pt-2">
                                        <span>Total</span>
                                        <span>₹{grandTotal.toFixed(0)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section C: Actions */}
                        {cart.length > 0 && (
                            <div className="pb-8">
                                <button
                                    onClick={copyForWhatsapp}
                                    className="w-full bg-green-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-green-600 shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:transform active:scale-95 transition-all"
                                >
                                    <WhatsAppIcon /> Copy for WhatsApp
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

