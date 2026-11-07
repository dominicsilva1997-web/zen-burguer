import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Clock, 
  Motorcycle, 
  X, 
  Search, 
  AlertCircle,
  Eye,
  Settings,
  Flame,
  Send,
  Phone,
  Save,
  Key,
  Database,
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';

// Default initial menu items for Zen Burguer
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Zen Smash Bacon',
    category: 'burgers',
    price: 29.90,
    description: 'Dois smashs de 90g de blend artesanal, cheddar cremoso derretido, bastante bacon bem crocante e maionese especial da casa no pão brioche.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 2,
    name: 'Zen Gourmet Trufado',
    category: 'burgers',
    price: 42.00,
    description: 'Hambúrguer 180g angus grelhado no fogo, queijo brie empanado, cebola caramelizada e maionese trufada no pão australiano.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 3,
    name: 'Combo Zen Duplo + Fritas',
    category: 'combos',
    price: 49.90,
    description: '1 Zen Smash Duplo + 1 Porção de Batata Rústica Pequena + 1 Refrigerante em lata 350ml à sua escolha.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 4,
    name: 'Batata Rústica Zen Cheddar & Bacon',
    category: 'sides',
    price: 22.90,
    description: '300g de batata rústica crocante por fora e macia por dentro, coberta com nosso molho de cheddar especial e tiras de bacon.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 5,
    name: 'Onion Rings Zen',
    category: 'sides',
    price: 19.90,
    description: 'Anéis de cebola super crocantes (12 unidades) servidos com maionese temperada de alho verde.',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 6,
    name: 'Milkshake Doce de Leite com Churros',
    category: 'drinks',
    price: 21.00,
    description: '500ml de milkshake cremoso de baunilha mesclado com doce de leite caseiro e mini churros no topo.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    available: true
  },
  {
    id: 7,
    name: 'Coca-Cola Zero 350ml',
    category: 'drinks',
    price: 7.00,
    description: 'Lata 350ml gelada.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    available: true
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Todos os Itens' },
  { id: 'burgers', label: 'Hambúrgueres Artesanais' },
  { id: 'combos', label: 'Combos' },
  { id: 'sides', label: 'Porções & Entradas' },
  { id: 'drinks', label: 'Bebidas & Sobremesas' }
];

const STORE_WHATSAPP = '5581999442366';

export default function App() {
  // Load initial products from LocalStorage if available
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('zenburguer_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('menu_manager'); // 'menu_manager' | 'orders' | 'deploy'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  // Saved Orders in LocalStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('zenburguer_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: '#1001',
        customerName: 'Cliente Exemplo',
        phone: '(81) 99999-8888',
        address: 'Rua Principal, 100 - Boa Viagem',
        items: [{ name: 'Zen Smash Bacon', qty: 2, price: 29.90 }],
        total: 65.80,
        status: 'Em Preparo',
        time: '20:15',
        type: 'Entrega',
        paymentMethod: 'Pix'
      }
    ];
  });

  // Admin PIN Auth & Settings
  const [adminPin, setAdminPin] = useState(() => {
    return localStorage.getItem('zenburguer_pin') || '1234';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Toast System
  const [toast, setToast] = useState(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'burgers',
    price: '',
    description: '',
    image: '',
    available: true
  });

  // Customer Checkout Form
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    type: 'delivery',
    address: '',
    paymentMethod: 'Pix',
    notes: ''
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('zenburguer_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zenburguer_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Handlers
  const addToCart = (product) => {
    if (!product.available) {
      showToast('Este item está esgotado no momento.', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} adicionado ao carrinho!`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = checkoutData.type === 'delivery' ? 6.00 : 0;
  const cartTotal = cartSubtotal + (cart.length > 0 ? deliveryFee : 0);

  // Send Order to WhatsApp
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!checkoutData.name || (checkoutData.type === 'delivery' && !checkoutData.address)) {
      showToast('Por favor, preencha o nome e o endereço de entrega!', 'error');
      return;
    }

    const newOrder = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: checkoutData.name,
      phone: checkoutData.phone || 'Não informado',
      address: checkoutData.type === 'delivery' ? checkoutData.address : 'Retirada no Balcão',
      items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      total: cartTotal,
      status: 'Pendente',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: checkoutData.type === 'delivery' ? 'Entrega' : 'Retirada',
      paymentMethod: checkoutData.paymentMethod,
      notes: checkoutData.notes
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCartOpen(false);

    // Format WhatsApp Message
    let text = `*🍔 NOVO PEDIDO - ZEN BURGUER*%0A`;
    text += `*Pedido:* ${newOrder.id}%0A`;
    text += `*Cliente:* ${newOrder.customerName}%0A`;
    text += `*Telefone:* ${newOrder.phone}%0A`;
    text += `*Tipo:* ${newOrder.type}%0A`;
    if (newOrder.type === 'Entrega') text += `*Endereço:* ${newOrder.address}%0A`;
    text += `*Forma de Pagamento:* ${newOrder.paymentMethod}%0A`;
    if (newOrder.notes) text += `*Observações:* ${newOrder.notes}%0A`;
    text += `%0A*ITENS SOLICITADOS:*%0A`;
    newOrder.items.forEach(item => {
      text += `• ${item.qty}x ${item.name} (R$ ${(item.price * item.qty).toFixed(2)})%0A`;
    });
    if (newOrder.type === 'Entrega') text += `• Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}%0A`;
    text += `%0A*TOTAL DO PEDIDO:* R$ ${newOrder.total.toFixed(2)}`;

    showToast('Pedido realizado! Redirecionando para o WhatsApp...', 'success');
    window.open(`https://api.whatsapp.com/send?phone=${STORE_WHATSAPP}&text=${text}`, '_blank');
  };

  // Admin Auth & PIN Reset
  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setIsAdminAuthenticated(true);
      setPinError(false);
      setPinInput('');
      showToast('Acesso de Administrador concedido!');
    } else {
      setPinError(true);
    }
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.length < 4) {
      showToast('A nova senha deve ter pelo menos 4 dígitos!', 'error');
      return;
    }
    setAdminPin(newPin);
    localStorage.setItem('zenburguer_pin', newPin);
    setNewPin('');
    showToast('Senha do Painel ADM atualizada com sucesso!');
  };

  // Product CRUD
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
        available: product.available
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'burgers',
        price: '',
        description: '',
        image: '',
        available: true
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      showToast('Preencha o nome, preço e foto do produto!', 'error');
      return;
    }

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    if (isNaN(priceNum)) {
      showToast('Preço numérico inválido!', 'error');
      return;
    }

    if (editingProduct) {
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: priceNum,
                description: formData.description,
                image: formData.image,
                available: formData.available
              }
            : p
        )
      );
      showToast(`Item "${formData.name}" atualizado!`);
    } else {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: priceNum,
        description: formData.description,
        image: formData.image,
        available: formData.available
      };
      setProducts([newItem, ...products]);
      showToast(`Novo hambúrguer "${formData.name}" adicionado!`);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir "${name}" do cardápio do Zen Burguer?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`"${name}" removido com sucesso.`, 'info');
    }
  };

  const handleToggleAvailability = (id) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = !p.available;
          showToast(`Item ${updated ? 'Disponível' : 'marcado como Esgotado'}`);
          return { ...p, available: updated };
        }
        return p;
      })
    );
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Restaurar o cardápio original do Zen Burguer? Isso sobrescreverá as alterações.')) {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.removeItem('zenburguer_products');
      showToast('Cardápio restaurado ao padrão!', 'info');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0f10] text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all transform animate-bounce ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          toast.type === 'info' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-neutral-950 font-black'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#161618]/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
              <div className="w-11 h-11 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Flame className="w-7 h-7 text-neutral-950 fill-neutral-950" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-amber-500">
                  ZEN <span className="text-white">BURGUER</span>
                </h1>
                <p className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-500" />
                  (81) 99944-2366
                </p>
              </div>
            </div>

            {/* Navigation & Cart Trigger */}
            <div className="flex items-center gap-3">
              <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'menu'
                      ? 'bg-amber-500 text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Cardápio</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Painel ADM</span>
                </button>
              </div>

              {activeTab === 'menu' && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all border border-neutral-800 text-white flex items-center justify-center"
                >
                  <ShoppingBag className="w-6 h-6 text-amber-500" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-neutral-950 font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-md">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* VIEW 1: CUSTOMER MENU */}
      {activeTab === 'menu' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Banner Hero */}
          <div className="relative rounded-3xl overflow-hidden mb-8 border border-neutral-800 bg-neutral-900 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f10] via-[#0f0f10]/80 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1600"
              alt="Zen Burguer Banner"
              className="w-full h-60 sm:h-72 object-cover opacity-60"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-widest rounded-full mb-3 w-max">
                <Sparkles className="w-3.5 h-3.5" /> O Verdadeiro Smash Burger
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2 uppercase">
                ZEN <span className="text-amber-500">BURGUER</span>
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm mb-4">
                Hambúrgueres artesanais preparados com blends de carnes nobres grelhadas na hora. Faça seu pedido e receba no conforto da sua casa!
              </p>
              <a
                href={`https://wa.me/${STORE_WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs w-max transition-all shadow-lg shadow-emerald-600/20"
              >
                <Phone className="w-4 h-4" />
                Falar no WhatsApp: (81) 99944-2366
              </a>
            </div>
          </div>

          {/* Categories & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar no Zen Burguer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              <AlertCircle className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-300">Nenhum hambúrguer encontrado</h3>
              <p className="text-neutral-500 text-sm mt-1">Tente pesquisar outro nome ou selecione outra categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`group bg-neutral-900 rounded-2xl border border-neutral-800/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-neutral-700 hover:shadow-xl ${
                    !product.available ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    {!product.available && (
                      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg">
                          Esgotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors leading-tight mb-2">
                        {product.name}
                      </h3>
                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Preço</span>
                        <span className="text-xl font-black text-amber-500 font-mono">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.available}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${
                          product.available
                            ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* VIEW 2: ADMIN PANEL */}
      {activeTab === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {!isAdminAuthenticated ? (
            /* PIN Security Screen */
            <div className="max-w-md mx-auto my-12 bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Painel ADM - Zen Burguer</h2>
              <p className="text-neutral-400 text-xs mb-6">
                Digite a senha para gerenciar o cardápio e ver os pedidos.<br/>
                <span className="text-amber-500 font-bold">(Senha padrão: 1234)</span>
              </p>

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <input
                  type="password"
                  placeholder="Senha ADM..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-white focus:outline-none focus:border-amber-500"
                />
                {pinError && (
                  <p className="text-red-500 text-xs font-semibold">Senha incorreta!</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl transition-all"
                >
                  Entrar no Painel
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard */
            <div className="space-y-8">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-amber-500" />
                    Painel ADM - Zen Burguer
                  </h2>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Gerencie o cardápio, acompanhe pedidos e configure a sincronização na nuvem.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  Novo Produto
                </button>
              </div>

              {/* Navigation Tabs inside Admin */}
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setAdminSubTab('menu_manager')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    adminSubTab === 'menu_manager'
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  Cardápio ({products.length})
                </button>
                <button
                  onClick={() => setAdminSubTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    adminSubTab === 'orders'
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  Pedidos ({orders.length})
                </button>
                <button
                  onClick={() => setAdminSubTab('deploy')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    adminSubTab === 'deploy'
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Como Publicar Online
                </button>
              </div>

              {/* SUBTAB 1: PRODUCT CRUD */}
              {adminSubTab === 'menu_manager' && (
                <div className="space-y-4">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-bold border-b border-neutral-800">
                          <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {products.map(product => (
                            <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800';
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-white">{product.name}</p>
                                  <p className="text-xs text-neutral-500 max-w-xs truncate">{product.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 capitalize font-medium text-neutral-400">
                                {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                              </td>
                              <td className="px-6 py-4 font-bold text-white font-mono">
                                R$ {product.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleToggleAvailability(product.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                    product.available
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                >
                                  {product.available ? 'Disponível' : 'Esgotado'}
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenProductModal(product)}
                                  className="p-2 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 rounded-xl text-neutral-300 transition-all inline-flex items-center justify-center"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-2 bg-neutral-800 hover:bg-red-600 hover:text-white rounded-xl text-neutral-300 transition-all inline-flex items-center justify-center"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleResetToDefaults}
                      className="text-xs text-neutral-500 hover:text-red-400 underline"
                    >
                      Restaurar cardápio padrão original
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: ORDERS */}
              {adminSubTab === 'orders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <div>
                          <span className="font-extrabold text-amber-500 text-lg">{order.id}</span>
                          <span className="text-xs text-neutral-400 block">{order.time} • {order.type}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          order.status === 'Em Preparo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-neutral-300">
                        <p className="font-bold text-white text-sm">{order.customerName}</p>
                        <p className="text-neutral-400">Tel: {order.phone}</p>
                        <p className="text-neutral-400">Endereço: {order.address}</p>
                        <p className="text-neutral-400">Pagamento: {order.paymentMethod}</p>
                      </div>

                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-300">
                            <span>{item.qty}x {item.name}</span>
                            <span className="font-mono text-neutral-400">R$ {(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-amber-500 pt-2 border-t border-neutral-800 mt-2">
                          <span>TOTAL:</span>
                          <span>R$ {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUBTAB 3: HOW TO DEPLOY ONLINE */}
              {adminSubTab === 'deploy' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-amber-500" />
                      Guia para Colocar o Zen Burguer Online Grátis
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Siga estas 3 etapas simples para ter seu link próprio e enviar aos seus clientes pelo Instagram e WhatsApp:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <div className="w-8 h-8 bg-amber-500/20 text-amber-500 font-bold rounded-lg flex items-center justify-center">1</div>
                      <h4 className="font-bold text-sm text-white">Criar Hospedagem Grátis</h4>
                      <p className="text-xs text-neutral-400">
                        Crie uma conta gratuita na <strong>Vercel.com</strong> ou <strong>Netlify.com</strong>.
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <div className="w-8 h-8 bg-amber-500/20 text-amber-500 font-bold rounded-lg flex items-center justify-center">2</div>
                      <h4 className="font-bold text-sm text-white">Salvar este Código</h4>
                      <p className="text-xs text-neutral-400">
                        Copie este código do aplicativo React gerado e publique no seu repositório GitHub.
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <div className="w-8 h-8 bg-amber-500/20 text-amber-500 font-bold rounded-lg flex items-center justify-center">3</div>
                      <h4 className="font-bold text-sm text-white">Banco de Dados Cloud</h4>
                      <p className="text-xs text-neutral-400">
                        Para sincronizar em tempo real em vários celulares, conecte gratuitamente ao <strong>Supabase</strong> ou <strong>Firebase</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Password Reset Section */}
                  <div className="pt-6 border-t border-neutral-800">
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      Alterar Senha do Painel ADM
                    </h4>
                    <form onSubmit={handleChangePin} className="flex gap-3 max-w-sm">
                      <input
                        type="password"
                        placeholder="Nova senha (mínimo 4 dígitos)"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 flex-1"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs"
                      >
                        Salvar Senha
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* SHOPPING CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-900 h-full border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
            
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-white">Seu Pedido no Zen Burguer</h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-bold text-sm text-white">{item.name}</p>
                            <p className="text-xs text-amber-500 font-mono">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="pt-4 border-t border-neutral-800 space-y-3">
                    <h4 className="font-bold text-sm text-white">Finalizar Pedido</h4>
                    
                    <input
                      type="text"
                      placeholder="Seu Nome *"
                      required
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="tel"
                      placeholder="Seu WhatsApp (Ex: 81 99999-8888) *"
                      required
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, type: 'delivery' })}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          checkoutData.type === 'delivery'
                            ? 'bg-amber-500 text-neutral-950 border-amber-500'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        Entrega (+R$ 6.00)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, type: 'pickup' })}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          checkoutData.type === 'pickup'
                            ? 'bg-amber-500 text-neutral-950 border-amber-500'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        Retirada no Balcão
                      </button>
                    </div>

                    {checkoutData.type === 'delivery' && (
                      <input
                        type="text"
                        placeholder="Endereço de Entrega Completo *"
                        required
                        value={checkoutData.address}
                        onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    )}

                    <select
                      value={checkoutData.paymentMethod}
                      onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Pix">Pagamento via Pix</option>
                      <option value="Cartão de Crédito/Débito">Cartão na Entrega</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Observações (Sem salada, ponto da carne...)"
                      value={checkoutData.notes}
                      onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </form>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-800 bg-neutral-950 space-y-4">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>R$ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  {checkoutData.type === 'delivery' && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Taxa de Entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                    <span>TOTAL</span>
                    <span className="text-amber-500">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 uppercase tracking-wider text-xs transition-all"
                >
                  <Send className="w-4 h-4 fill-white" />
                  Enviar Pedido para WhatsApp
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Hambúrguer'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Nome do Item *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Zen Smash Duplo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="burgers">Hambúrgueres Artesanais</option>
                    <option value="combos">Combos</option>
                    <option value="sides">Porções & Entradas</option>
                    <option value="drinks">Bebidas & Sobremesas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Preço (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="29.90"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">URL da Foto *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Descrição</label>
                <textarea
                  rows="3"
                  placeholder="Descreva os ingredientes saborosos..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 rounded border-neutral-800 text-amber-500 focus:ring-amber-500 bg-neutral-950"
                  />
                  Item disponível em estoque
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 text-sm hover:text-white font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold shadow-lg shadow-amber-500/10"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Criar Hambúrguer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}