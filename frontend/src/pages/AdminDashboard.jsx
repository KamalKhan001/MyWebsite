import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Mail,
  Phone,
  Building2,
  Globe,
  Package,
  MessageSquare,
  Trash2,
  RefreshCcw,
  Filter,
  Inbox,
  CheckCircle2,
  Clock as ClockIcon,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { adminAPI, authAPI } from '../services/api';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'closed', label: 'Closed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const statusMeta = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s]));

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminUser, setAdminUser] = useState(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.listInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Error loading inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const me = await authAPI.me();
        setAdminUser(me);
      } catch {
        authAPI.clearToken();
        navigate('/admin/login');
        return;
      }
      await loadInquiries();
    };
    init();
  }, []);

  const handleLogout = () => {
    authAPI.clearToken();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      toast.success(`Status updated to ${statusMeta[newStatus]?.label || newStatus}`);
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      toast.success('Inquiry deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.country.toLowerCase().includes(q) ||
          i.product_interest.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inquiries, statusFilter, search]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === 'new').length,
      in_progress: inquiries.filter((i) => i.status === 'in_progress').length,
      closed: inquiries.filter((i) => i.status === 'closed').length,
    };
  }, [inquiries]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">KK-TRUST Admin</h1>
              <p className="text-xs text-gray-500">
                {adminUser ? `Signed in as ${adminUser.email}` : 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadInquiries}
              disabled={loading}
              data-testid="refresh-inquiries-btn"
              className="border-gray-300 text-gray-700"
            >
              <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="admin-logout-btn"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="stat-total">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Inbox className="text-gray-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-2xl font-bold text-blue-600" data-testid="stat-new">{stats.new}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="text-blue-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-amber-600" data-testid="stat-in-progress">{stats.in_progress}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ClockIcon className="text-amber-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Closed</p>
                  <p className="text-2xl font-bold text-emerald-600" data-testid="stat-closed">{stats.closed}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              data-testid="inquiry-search-input"
              placeholder="Search by name, email, company, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-300 bg-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48 border-gray-300 bg-white" data-testid="status-filter-select">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Loading inquiries...</p>
            </CardContent>
          </Card>
        ) : filteredInquiries.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-12 text-center">
              <Inbox className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 font-medium">No inquiries found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'New customer inquiries will appear here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const meta = statusMeta[inq.status] || STATUS_OPTIONS[0];
              return (
                <Card
                  key={inq.id}
                  data-testid={`inquiry-card-${inq.id}`}
                  className="border-none shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{inq.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(inq.created_at)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} className="text-gray-400 flex-shrink-0" />
                            <a href={`mailto:${inq.email}`} className="hover:text-blue-600 truncate">
                              {inq.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} className="text-gray-400 flex-shrink-0" />
                            <a href={`tel:${inq.phone}`} className="hover:text-blue-600 truncate">
                              {inq.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{inq.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Globe size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{inq.country}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{inq.product_interest}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {inq.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center gap-2 md:w-44">
                        <Select
                          value={inq.status}
                          onValueChange={(v) => handleStatusChange(inq.id, v)}
                        >
                          <SelectTrigger
                            className="border-gray-300 bg-white w-full"
                            data-testid={`status-select-${inq.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`delete-inquiry-${inq.id}`}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the inquiry from {inq.name} ({inq.company}). This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(inq.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
