import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, DollarSign, AlertTriangle, ListOrdered, Bell, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout.optimized';
import SELLER_NAV from '../../../components/dashboard/sellerNav';
import StatsCard from '../../../components/dashboard/StatsCard.optimized';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';
import { AuthContext } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/formatPrice';
import api from '../../../services/api.optimized';

interface SellerStats {
  overview: { totalProducts: number; activeProducts: number; lowStockProducts: number; totalOrders: number; thisMonthOrders: number; thisMonthRevenue: number; netRevenue: number; commission: number; lastMonthRevenue: number; revenueGrowth: number; unreadNotifications: number };
  ordersByStatus: Record<string, number>;
  topProducts: Array<{ id: string; name: string; sold: number; price: number; images: string[]; stock: number }>;
  recentOrders: Array<{ id: string; customer: { name: string }; sellerSubtotal?: number; total: number; status: string; createdAt: string }>;
}

interface ApiError { response?: { data?: { message?: string } } }
const getErrorMessage = (error: unknown, fallback: string) => (error as ApiError)?.response?.data?.message ?? fallback;

const SellerDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const { data } = await api.get('/seller/dashboard', { signal: controller.signal });
        setStats(data?.data ?? null);
      } catch (err) {
        if ((err as { code?: string })?.code === 'ERR_CANCELED') return;
        setError(getErrorMessage(err, 'Failed to load seller dashboard.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  const user = auth?.user;
  const overview = stats?.overview;
  const unread = overview?.unreadNotifications ?? 0;
  const navItems = useMemo(() => SELLER_NAV.map(item => item.href === '/seller/notifications' ? { ...item, badge: unread } : item), [unread]);
  const orderStatuses = useMemo(() => Object.entries(stats?.ordersByStatus ?? {}), [stats?.ordersByStatus]);
  const recentOrders = useMemo(() => (stats?.recentOrders ?? []).slice(0, 6), [stats?.recentOrders]);

  const handleLogout = async () => { await auth?.logoutUser?.(); window.location.href = '/login'; };

  return <DashboardLayout
    navItems={navItems}
    role='seller'
    userName={user?.name ?? 'Seller'}
    userAvatar={user?.profilePic}
    storeName={user?.storeName}
    notificationCount={unread} onLogout={handleLogout}>
    
    <div className='space-y-6'>
      <div className='flex items-center justify-between flex-wrap gap-3'><div><h1 className='text-2xl font-bold text-gray-900'>{user?.storeName ?? 'My Store'}</h1><p className='text-gray-500 text-sm mt-1'>Your commission rate: <span className='font-semibold text-brand-600'>{overview?.commission ?? 0}%</span></p></div>{(overview?.lowStockProducts ?? 0)>0 && <Link to='/seller/products?status=active&lowStock=true' className='flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors'><AlertTriangle size={15}/>{overview?.lowStockProducts} low stock item{overview?.lowStockProducts !== 1 ? 's':''}</Link>}</div>
      {error && <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>{error}</div>}
      {loading ? <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>{Array.from({length:8}).map((_,i)=><div key={i} className='h-28 bg-gray-100 rounded-2xl animate-pulse'/>)}</div> : <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard title='Monthly Revenue' value={formatPrice(overview?.thisMonthRevenue ?? 0)} icon={<DollarSign size={18}/>} color='green' change={overview?.revenueGrowth}/>
        <StatsCard title='Net Earnings' value={formatPrice(overview?.netRevenue ?? 0)} icon={<TrendingUp size={18}/>} color='teal'/>
        <StatsCard title='Monthly Orders' value={overview?.thisMonthOrders ?? 0} icon={<Package size={18}/>} color='blue'/>
        <StatsCard title='Total Orders' value={overview?.totalOrders ?? 0} icon={<ListOrdered size={18}/>} color='purple'/>
        <StatsCard title='Active Products' value={overview?.activeProducts ?? 0} icon={<ShoppingBag size={18}/>} color='blue'/>
        <StatsCard title='Total Products' value={overview?.totalProducts ?? 0} icon={<ShoppingBag size={18}/>} color='purple'/>
        <StatsCard title='Low Stock' value={overview?.lowStockProducts ?? 0} icon={<AlertTriangle size={18}/>} color='red'/>
        <StatsCard title='Notifications' value={unread} icon={<Bell size={18}/>} color='orange'/>
      </div>}
      {orderStatuses.length>0 && <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>{orderStatuses.map(([status,count])=><Link key={status} to={`/seller/orders?status=${encodeURIComponent(status)}`} className='bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow'><p className='text-2xl font-bold text-gray-900'>{count}</p><div className='mt-1'><StatusBadge status={status} size='sm'/></div></Link>)}</div>}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-xs p-5'><div className='flex items-center justify-between mb-4'><h2 className='font-bold text-gray-900'>Recent Orders</h2><Link to='/seller/orders' className='text-sm text-brand-600 hover:underline'>View all</Link></div><div className='space-y-3'>{recentOrders.map(order=><div key={order.id} className='flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors'><div className='min-w-0'><p className='text-sm font-medium text-gray-900 truncate'>{order.customer?.name ?? 'Customer'}</p><p className='text-xs text-gray-400'>{new Date(order.createdAt).toLocaleDateString()}</p></div><div className='flex items-center gap-3 shrink-0'><StatusBadge status={order.status} size='sm'/><span className='text-sm font-semibold text-gray-900'>{formatPrice(order.sellerSubtotal ?? order.total)}</span></div></div>)}{!loading && recentOrders.length===0 && <p className='text-center text-gray-400 py-6 text-sm'>No orders yet.</p>}</div></div>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-xs p-5'><div className='flex items-center justify-between mb-4'><h2 className='font-bold text-gray-900'>Top Products</h2><Link to='/seller/products' className='text-sm text-brand-600 hover:underline'>View all</Link></div><div className='space-y-3'>{(stats?.topProducts ?? []).map((product,i)=><div key={product.id} className='flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors'><span className='text-sm font-bold text-gray-300 w-5 text-center'>{i+1}</span><div className='w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0'>{product.images?.[0] && <img src={product.images[0]} alt={product.name} className='w-full h-full object-cover' loading='lazy'/>}</div><div className='flex-1 min-w-0'><p className='text-sm font-medium text-gray-900 truncate'>{product.name}</p><p className={`text-xs ${product.stock<=5 ? 'text-red-500 font-medium':'text-gray-400'}`}>{product.stock} in stock</p></div><div className='text-right shrink-0'><p className='text-sm font-semibold text-gray-900'>{product.sold} sold</p><p className='text-xs text-gray-400'>{formatPrice(product.price)}</p></div></div>)}{!loading && (stats?.topProducts?.length ?? 0)===0 && <div className='text-center py-8'><p className='text-gray-400 text-sm mb-3'>No products yet.</p><Link to='/seller/products/new' className='text-sm text-brand-600 font-medium hover:underline'>Add your first product →</Link></div>}</div></div>
      </div>
    </div>
  </DashboardLayout>;
};

export default SellerDashboard;
