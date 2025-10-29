import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import Icon from '@/components/ui/icon'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  image: string
  badge?: string
}

const products: Product[] = [
  { id: 1, name: 'Неоновые наушники Pro', price: 4990, category: 'Электроника', brand: 'SoundMax', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/25622c0b-8792-4d1d-a0f1-9a5f573cb18e.jpg', badge: 'Хит' },
  { id: 2, name: 'Кроссовки Urban Style', price: 7990, category: 'Обувь', brand: 'StreetWear', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/1d2dee6b-fcb2-4c21-8972-cdc4b2f4fcae.jpg', badge: 'New' },
  { id: 3, name: 'Рюкзак City Life', price: 3490, category: 'Аксессуары', brand: 'UrbanGear', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/fee0dff8-4b56-478a-bbeb-15023c9e8aea.jpg' },
  { id: 4, name: 'Смарт-часы Neo X', price: 12990, category: 'Электроника', brand: 'TechLife', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/25622c0b-8792-4d1d-a0f1-9a5f573cb18e.jpg', badge: 'Хит' },
  { id: 5, name: 'Футболка Retro Vibe', price: 1990, category: 'Одежда', brand: 'RetroStyle', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/fee0dff8-4b56-478a-bbeb-15023c9e8aea.jpg' },
  { id: 6, name: 'Беспроводная колонка Boom', price: 5490, category: 'Электроника', brand: 'SoundMax', image: 'https://cdn.poehali.dev/projects/26c38740-7c6d-4eaa-b4aa-db62604b09ce/files/25622c0b-8792-4d1d-a0f1-9a5f573cb18e.jpg' },
]

interface CartItem extends Product {
  quantity: number
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [priceRange, setPriceRange] = useState([0, 15000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const categories = Array.from(new Set(products.map(p => p.category)))
  const brands = Array.from(new Set(products.map(p => p.brand)))

  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    return matchesPrice && matchesCategory && matchesBrand
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NeoShop
            </h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative border-2 border-primary/20 hover:border-primary/40 transition-all">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-white px-2">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ShoppingBag" size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <Card key={item.id} className="p-4">
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-primary font-bold">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="font-semibold w-8 text-center">{item.quantity}</span>
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                <Icon name="Plus" size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)} className="ml-auto">
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{totalPrice} ₽</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-opacity" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl animate-fade-in">
            <Badge className="mb-4 bg-secondary text-white">Новая коллекция 2024</Badge>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Стиль для тех, кто <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">всегда в движении</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Откройте для себя самые крутые товары сезона — от электроники до уличной моды
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-opacity text-lg px-8">
              Смотреть каталог
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6 animate-fade-in">
            <Card className="p-6 border-2 border-primary/10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={20} />
                Фильтры
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Цена</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={15000}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0]} ₽</span>
                    <span>{priceRange[1]} ₽</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Категории</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Бренды</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedBrands([])
                    setPriceRange([0, 15000])
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </Card>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                Каталог товаров
                <span className="text-muted-foreground text-lg ml-2">
                  ({filteredProducts.length})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-secondary text-white">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-2 border-primary/30">
                      {product.category}
                    </Badge>
                    <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
                      >
                        <Icon name="ShoppingCart" size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
              </div>
            )}
          </main>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-primary via-secondary to-accent text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-4">NeoShop</h4>
              <p className="text-white/80">Ваш стиль — наша миссия</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-white/80">
                <li>Электроника</li>
                <li>Одежда</li>
                <li>Обувь</li>
                <li>Аксессуары</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-white/80">
                <li>О нас</li>
                <li>Доставка</li>
                <li>Оплата</li>
                <li>Контакты</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-white/80">
                <p>8 (800) 555-35-35</p>
                <p>info@neoshop.ru</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            © 2024 NeoShop. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index;