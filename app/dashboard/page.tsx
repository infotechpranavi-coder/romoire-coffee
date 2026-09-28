'use client'

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import CreatePackageModal from "../../components/CreatePackageModal";
import CreateTourModal from "../../components/CreateTourModal";
import CreateTicketModal from "../../components/CreateTicketModal";
import EditTourModal from "../../components/EditTourModal";
import EditTicketModal from "../../components/EditTicketModal";
import EditPackageModal from "../../components/EditPackageModal";
import CreateBannerModal from "../../components/CreateBannerModal";
import CreateGalleryModal from "../../components/CreateGalleryModal";
import EditBannerModal from "../../components/EditBannerModal";
import CreateBlogModal from "../../components/CreateBlogModal";
import EditBlogModal from "../../components/EditBlogModal";
import CreateTestimonialModal from "../../components/CreateTestimonialModal";
import EditTestimonialModal from "../../components/EditTestimonialModal";
import ReplyEnquiryModal from "../../components/ReplyEnquiryModal";
import DashboardCategoriesPanel from "../../components/DashboardCategoriesPanel";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import {
  Package,
  Star,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Copy,
  MessageSquare,
  FileText,
  Coffee,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  LogOut,
  Compass,
  Plane,
  Image as ImageIcon,
  LayoutGrid,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Save,
  Check,
  ExternalLink,
  FolderTree
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { cn } from "../../lib/utils";
import { SITE_NAME, LOGO_SRC } from "@/lib/branding";
import { packageMatchesExperienceCategory, packageMatchesNavGroup } from "@/lib/packageExperienceCategories";
import { useCategoryLabels } from "@/contexts/CategoryLabelsContext";

import { getBannerPreviewImage, getBannerMediaLabel } from "@/lib/bannerMedia";
import { PackageData, TourData, TicketData, BannerData, BlogData, GalleryData } from "@/lib/types";

type DashboardView = 'packages' | 'categories' | 'tours' | 'tickets' | 'banners' | 'gallery' | 'testimonials' | 'blogs' | 'enquiries' | 'reports' | 'settings' | 'socials';

export default function DashboardPage() {
  const router = useRouter();
  const { navGroups, getCategoryByValue: resolveCategoryByValue, catalog } = useCategoryLabels();
  const [activeView, setActiveView] = useState<DashboardView>('packages');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreatePackageModalOpen, setIsCreatePackageModalOpen] = useState(false);
  const [isCreateTourModalOpen, setIsCreateTourModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false);
  const [isEditTourModalOpen, setIsEditTourModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [isCreateBannerModalOpen, setIsCreateBannerModalOpen] = useState(false);
  const [isCreateGalleryModalOpen, setIsCreateGalleryModalOpen] = useState(false);
  const [isEditBannerModalOpen, setIsEditBannerModalOpen] = useState(false);
  const [isCreateTestimonialModalOpen, setIsCreateTestimonialModalOpen] = useState(false);
  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [selectedTour, setSelectedTour] = useState<TourData | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<BannerData | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [tours, setTours] = useState<TourData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryData[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeFilter, setPlaceFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [miniFilter, setMiniFilter] = useState("all");
  const [reportModule, setReportModule] = useState<DashboardView>('packages');
  const [seedingPackages, setSeedingPackages] = useState(false);
  const [seedingTours, setSeedingTours] = useState(false);
  const [seedingTickets, setSeedingTickets] = useState(false);
  const [seedingBanners, setSeedingBanners] = useState(false);
  const [seedingBlogs, setSeedingBlogs] = useState(false);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [isCreateBlogModalOpen, setIsCreateBlogModalOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ 
    popularSection: true, 
    upcomingSection: true,
    destinationsSection: true,
    exploreSection: true,
    testimonialsSection: true,
    facebookUrl: "",
    facebookEnabled: true,
    instagramUrl: "",
    instagramEnabled: true,
    twitterUrl: "",
    twitterEnabled: true,
    linkedinUrl: "",
    linkedinEnabled: true,
    youtubeUrl: "",
    youtubeEnabled: true,
    whatsappUrl: "",
    whatsappEnabled: true
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages', { cache: 'no-store' });
      const data = await response.json();
      console.log('Fetched packages:', data);
      if (data.success && data.data) {
        setPackages(data.data);
        console.log(`Loaded ${data.data.length} packages`);
      } else {
        console.warn('No packages data in response:', data);
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setTours(data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setTickets(data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setBanners(data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setGalleryItems(data.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setEnquiries(data.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setTestimonials(data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', { cache: 'no-store' });
      const data = await response.json();
      if (data.success && data.data) {
        // Merge with existing state to preserve defaults for missing fields
        setSiteSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: boolean | string) => {
    try {
      setSettingsLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSocialSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.data);
        alert("Social media settings updated successfully!");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSeedPackages = async () => {
    setSeedingPackages(true);
    try {
      const res = await fetch('/api/packages/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Romoire premix products seeded successfully! (${data.results.created} created, ${data.results.updated} updated)`);
        await fetchPackages();
      } else {
        alert('❌ Failed to seed packages: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error seeding packages. Please try again.');
    } finally {
      setSeedingPackages(false);
    }
  };

  const handleSeedTours = async () => {
    setSeedingTours(true);
    try {
      const res = await fetch('/api/tours/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Sample tours added: ${data.results.created} created, ${data.results.skipped} already existed.`);
        await fetchTours();
      } else {
        alert('❌ Failed to seed tours: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error seeding tours. Please try again.');
    } finally {
      setSeedingTours(false);
    }
  };

  const handleSeedTickets = async () => {
    setSeedingTickets(true);
    try {
      const res = await fetch('/api/tickets/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Sample tickets added: ${data.results.created} created, ${data.results.skipped} already existed.`);
        await fetchTickets();
      } else {
        alert('❌ Failed to seed tickets: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error seeding tickets. Please try again.');
    } finally {
      setSeedingTickets(false);
    }
  };

  const handleSeedBanners = async () => {
    setSeedingBanners(true);
    try {
      const res = await fetch('/api/banners/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Sample banners added: ${data.results.created} created, ${data.results.skipped} already existed.`);
        await fetchBanners();
      } else {
        alert('❌ Failed to seed banners: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error seeding banners. Please try again.');
    } finally {
      setSeedingBanners(false);
    }
  };

  const handleSeedBlogs = async () => {
    setSeedingBlogs(true);
    try {
      const res = await fetch('/api/blogs/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Sample blogs added: ${data.results.created} created, ${data.results.skipped} already existed.`);
        await fetchBlogs();
      } else {
        alert('❌ Failed to seed blogs: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Error seeding blogs. Please try again.');
    } finally {
      setSeedingBlogs(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchTours();
    fetchTickets();
    fetchBanners();
    fetchGallery();
    fetchEnquiries();
    fetchTestimonials();
    fetchBlogs();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeView === 'enquiries') {
      fetchEnquiries();
    }
  }, [activeView]);

  useEffect(() => {
    if (activeView === 'packages') {
      fetchPackages();
    }
  }, [catalog.groupLabels, catalog.categoryLabels, catalog.customGroups, catalog.customSubcategories, catalog.customMiniCategories, activeView]);

  const filterCategoryOptions = useMemo(() => {
    if (groupFilter === "all") {
      return navGroups.flatMap((group) => group.items);
    }
    const group = navGroups.find((g) => g.slug === groupFilter);
    return group?.items ?? [];
  }, [groupFilter, navGroups]);

  const filterMiniOptions = useMemo(() => {
    if (categoryFilter !== "all") {
      const sub = filterCategoryOptions.find(
        (item) =>
          item.value === categoryFilter ||
          item.value.toLowerCase() === categoryFilter.toLowerCase()
      );
      return sub?.miniItems ?? [];
    }
    if (groupFilter !== "all") {
      const group = navGroups.find((g) => g.slug === groupFilter);
      return group?.items.flatMap((item) => item.miniItems ?? []) ?? [];
    }
    return navGroups.flatMap((group) => group.items.flatMap((item) => item.miniItems ?? []));
  }, [categoryFilter, groupFilter, filterCategoryOptions, navGroups]);

  const resolveMiniLabel = useCallback(
    (miniValue: string | undefined) => {
      if (!miniValue) return '';
      const allMinis = navGroups.flatMap((g) => g.items.flatMap((item) => item.miniItems ?? []));
      return allMinis.find((m) => m.value.toLowerCase() === miniValue.toLowerCase())?.label ?? miniValue;
    },
    [navGroups]
  );

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value);
    setCategoryFilter("all");
    setMiniFilter("all");
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setMiniFilter("all");
  };

  const filterPackages = useCallback(() => {
    let filtered = packages;

    if (groupFilter !== "all") {
      const group = navGroups.find((item) => item.slug === groupFilter);
      filtered = filtered.filter((pkg) => {
        if (!group) return packageMatchesNavGroup(pkg.packageCategory, groupFilter);
        return group.items.some(
          (cat) =>
            cat.value.toLowerCase() === String(pkg.packageCategory || '').toLowerCase() ||
            packageMatchesExperienceCategory(pkg.packageCategory, cat)
        );
      });
    }

    if (categoryFilter !== "all") {
      const category = resolveCategoryByValue(categoryFilter);
      filtered = filtered.filter((pkg) =>
        category
          ? packageMatchesExperienceCategory(pkg.packageCategory, category)
          : pkg.packageCategory === categoryFilter
      );
    }

    if (miniFilter !== "all") {
      filtered = filtered.filter(
        (pkg) => String(pkg.packageMiniCategory || '').toLowerCase() === miniFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Place filter
    if (placeFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.place === placeFilter);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, placeFilter, groupFilter, categoryFilter, miniFilter, resolveCategoryByValue, navGroups]);

  useEffect(() => {
    filterPackages();
  }, [filterPackages]);

  const handlePackageCreated = (newPackage: PackageData) => {
    setPackages(prev => [newPackage, ...prev]);
    setIsCreatePackageModalOpen(false);
  };

  const handleTourCreated = (newTour: TourData) => {
    setTours(prev => [newTour, ...prev]);
    setIsCreateTourModalOpen(false);
  };

  const handleTicketCreated = (newTicket: TicketData) => {
    setTickets(prev => [newTicket, ...prev]);
    setIsCreateTicketModalOpen(false);
  };

  const handleBannerCreated = (newBanner: BannerData) => {
    setBanners(prev => [newBanner, ...prev]);
    setIsCreateBannerModalOpen(false);
  };

  const handleGalleryCreated = (newItem: GalleryData) => {
    setGalleryItems(prev => [newItem, ...prev]);
    setIsCreateGalleryModalOpen(false);
  };

  const handleTestimonialCreated = (newTestimonial: any) => {
    setTestimonials(prev => [newTestimonial, ...prev]);
    setIsCreateTestimonialModalOpen(false);
  };

  const handleEditTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsEditTestimonialModalOpen(true);
  };

  const handleTestimonialUpdated = (updatedTestimonial: any) => {
    setTestimonials(prev => prev.map(t => t._id === updatedTestimonial._id ? updatedTestimonial : t));
    setSelectedTestimonial(null);
    setIsEditTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = async (testimonial: any) => {
    if (window.confirm(`Are you sure you want to delete feedback from "${testimonial.name}"?`)) {
      try {
        const res = await fetch(`/api/testimonials/${testimonial._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setTestimonials(prev => prev.filter(t => t._id !== testimonial._id));
        }
      } catch (err) {
        console.error('Error deleting testimonial:', err);
      }
    }
  };

  const handleDeleteTour = async (tour: TourData) => {
    if (window.confirm(`Are you sure you want to delete tour "${tour.title}"?`)) {
      try {
        const res = await fetch(`/api/tours/${tour._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setTours(prev => prev.filter(t => t._id !== tour._id));
        }
      } catch (err) {
        console.error('Error deleting tour:', err);
      }
    }
  };

  const handleDeleteTicket = async (ticket: TicketData) => {
    if (window.confirm(`Are you sure you want to delete ticket "${ticket.title}"?`)) {
      try {
        const res = await fetch(`/api/tickets/${ticket._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setTickets(prev => prev.filter(t => t._id !== ticket._id));
        }
      } catch (err) {
        console.error('Error deleting ticket:', err);
      }
    }
  };

  const handleDeleteBanner = async (banner: BannerData) => {
    if (window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
      try {
        const res = await fetch(`/api/banners/${banner._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setBanners(prev => prev.filter(b => b._id !== banner._id));
        }
      } catch (err) {
        console.error('Error deleting banner:', err);
      }
    }
  };

  const handleDeleteGalleryItem = async (item: GalleryData) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}" from the gallery?`)) {
      try {
        const res = await fetch(`/api/gallery/${item._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setGalleryItems(prev => prev.filter(g => g._id !== item._id));
        }
      } catch (err) {
        console.error('Error deleting gallery item:', err);
      }
    }
  };

  const handleToggleGalleryActive = async (item: GalleryData) => {
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setGalleryItems(prev => prev.map(g => g._id === item._id ? data.data : g));
      }
    } catch (err) {
      console.error('Error updating gallery item:', err);
    }
  };

  const handleDeleteBlog = async (blog: BlogData) => {
    if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return;
    try {
      const res = await fetch(`/api/blogs/${blog._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(b => b._id !== blog._id));
      }
    } catch (err) {
      alert('Failed to delete blog narrative');
    }
  };

  const openCreatePackageModal = () => {
    if (activeView === 'packages') setIsCreatePackageModalOpen(true);
    else if (activeView === 'tours') setIsCreateTourModalOpen(true);
    else if (activeView === 'tickets') setIsCreateTicketModalOpen(true);
    else if (activeView === 'banners') setIsCreateBannerModalOpen(true);
    else if (activeView === 'gallery') setIsCreateGalleryModalOpen(true);
  };

  const handleEditPackage = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setIsEditPackageModalOpen(true);
  };

  const handleDeletePackage = async (pkg: PackageData) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/packages/${pkg._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPackages(prev => prev.filter(p => p._id !== pkg._id));
          alert('Package deleted successfully!');
        } else {
          let errorMessage = 'Failed to delete package';
          try {
            const errorResult = await response.json();
            errorMessage = errorResult.error || errorMessage;
          } catch (parseError) {
            // If response is not JSON, get the text content
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        alert(`Error deleting package: ${error.message}`);
      }
    }
  };

  const handlePackageUpdated = (updatedPackage: PackageData) => {
    setPackages(prev => prev.map(p => p._id === updatedPackage._id ? updatedPackage : p));
    setSelectedPackage(null);
    setIsEditPackageModalOpen(false);
  };

  const handleTourUpdated = (updatedTour: TourData) => {
    setTours(prev => prev.map(t => t._id === updatedTour._id ? updatedTour : t));
    setSelectedTour(null);
    setIsEditTourModalOpen(false);
  };

  const handleTicketUpdated = (updatedTicket: TicketData) => {
    setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
    setSelectedTicket(null);
    setIsEditTicketModalOpen(false);
  };

  const handleBannerUpdated = (updatedBanner: BannerData) => {
    setBanners(prev => prev.map(b => b._id === updatedBanner._id ? updatedBanner : b));
    setSelectedBanner(null);
    setIsEditBannerModalOpen(false);
  };

  const handleDuplicatePackage = async (pkg: PackageData) => {
    try {
      // Create a duplicate package with modified title and remove _id
      const duplicatePackage = {
        ...pkg,
        title: `${pkg.title} (Copy)`,
        subtitle: `${pkg.subtitle} (Copy)`,
        bookings: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove the _id so it creates a new package
      delete (duplicatePackage as any)._id;

      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatePackage),
      });

      if (response.ok) {
        const result = await response.json();
        setPackages(prev => [result.data, ...prev]);
        alert('Package duplicated successfully!');
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to duplicate package');
      }
    } catch (error) {
      console.error('Error duplicating package:', error);
      alert(`Error duplicating package: ${error.message}`);
    }
  };

  const handleExportToWord = async () => {
    try {
      // Create table rows for packages
      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Title", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Place", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Duration", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Location", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Price", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rating", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bookings", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Created", bold: true })] })] }),
          ],
        }),
        ...filteredPackages.map((pkg, index) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString() })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.title })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.packageType === 'domestic' ? 'Domestic' : 'International' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.place === 'bhutan' ? 'Bhutan' : 'Nepal' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.duration || 'N/A' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.location || 'N/A' })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `R ${pkg.price?.toLocaleString() || '0'}` })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (pkg.rating || 0).toString() })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (pkg.bookings || 0).toString() })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: new Date(pkg.createdAt).toLocaleDateString() })] })] }),
            ],
          })
        ),
      ];

      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${SITE_NAME} - Package Report`, bold: true, size: 32 })],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Generated on: ${new Date().toLocaleDateString()}`, size: 20 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            new Table({
              rows: tableRows,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            }),
            new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            new Paragraph({
              children: [new TextRun({ text: "Summary:", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Packages: ${filteredPackages.length}`, size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Domestic Packages: ${filteredPackages.filter(p => p.packageType === 'domestic').length}`, size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `International Packages: ${filteredPackages.filter(p => p.packageType === 'international').length}`, size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Bookings: ${filteredPackages.reduce((sum, p) => sum + (p.bookings || 0), 0)}`, size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Average Rating: ${filteredPackages.length > 0 ? (filteredPackages.reduce((sum, p) => sum + (p.rating || 0), 0) / filteredPackages.length).toFixed(1) : '0.0'}`, size: 20 })],
            }),
          ],
        }],
      });

      // Generate and save the Word document
      const buffer = await Packer.toBuffer(doc);
      const arrayBuffer = new ArrayBuffer(buffer.byteLength);
      const view = new Uint8Array(arrayBuffer);
      view.set(new Uint8Array(buffer));
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, `tia-tours-packages-${new Date().toISOString().split('T')[0]}.docx`);

      alert('Package data exported to Word document successfully!');
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Error exporting to Word document. Please try again.');
    }
  };

  // Helper function to download image as base64
  const downloadImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 10000, // 10 second timeout
      });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:${response.headers['content-type'] || 'image/jpeg'};base64,${base64}`;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  };

  // Helper function to get formatted place name
  const getFormattedPlace = (place: string) => {
    const placeMap: { [key: string]: string } = {
      'bhutan': 'Bhutan',
      'nepal': 'Nepal',
      'vietnam': 'Vietnam',
      'sri-lanka': 'Sri Lanka',
      'bali': 'Bali',
      'malaysia': 'Malaysia',
      'singapore': 'Singapore',
      'dubai': 'Dubai',
      'thailand': 'Thailand',
      'indonesia': 'Indonesia',
      'philippines': 'Philippines',
      'japan': 'Japan',
      'china': 'China',
      'south-korea': 'South Korea',
      'taiwan': 'Taiwan',
      'hong-kong': 'Hong Kong',
      'macau': 'Macau',
      'myanmar': 'Myanmar',
      'cambodia': 'Cambodia',
      'laos': 'Laos',
      'bangladesh': 'Bangladesh',
      'pakistan': 'Pakistan',
      'afghanistan': 'Afghanistan',
      'iran': 'Iran',
      'turkey': 'Turkey',
      'egypt': 'Egypt',
      'morocco': 'Morocco',
      'south-africa': 'South Africa',
      'kenya': 'Kenya',
      'tanzania': 'Tanzania',
      'mauritius': 'Mauritius',
      'seychelles': 'Seychelles',
      'maldives': 'Maldives',
      'fiji': 'Fiji',
      'australia': 'Australia',
      'new-zealand': 'New Zealand',
      'europe': 'Europe',
      'france': 'France',
      'italy': 'Italy',
      'spain': 'Spain',
      'germany': 'Germany',
      'switzerland': 'Switzerland',
      'austria': 'Austria',
      'netherlands': 'Netherlands',
      'belgium': 'Belgium',
      'greece': 'Greece',
      'portugal': 'Portugal',
      'norway': 'Norway',
      'sweden': 'Sweden',
      'denmark': 'Denmark',
      'finland': 'Finland',
      'iceland': 'Iceland',
      'ireland': 'Ireland',
      'uk': 'United Kingdom',
      'england': 'England',
      'scotland': 'Scotland',
      'wales': 'Wales',
      'canada': 'Canada',
      'usa': 'United States',
      'america': 'America',
      'brazil': 'Brazil',
      'argentina': 'Argentina',
      'chile': 'Chile',
      'peru': 'Peru',
      'colombia': 'Colombia',
      'mexico': 'Mexico',
      'cuba': 'Cuba',
      'jamaica': 'Jamaica',
      'costa-rica': 'Costa Rica',
      'india': 'India',
      'kashmir': 'Kashmir',
      'leh': 'Leh',
      'ladakh': 'Ladakh',
      'himachal': 'Himachal Pradesh',
      'manali': 'Manali',
      'shimla': 'Shimla',
      'dharamshala': 'Dharamshala',
      'mcleodganj': 'McLeodganj',
      'uttarakhand': 'Uttarakhand',
      'rishikesh': 'Rishikesh',
      'haridwar': 'Haridwar',
      'dehradun': 'Dehradun',
      'mussoorie': 'Mussoorie',
      'nainital': 'Nainital',
      'rajasthan': 'Rajasthan',
      'jaipur': 'Jaipur',
      'udaipur': 'Udaipur',
      'jodhpur': 'Jodhpur',
      'jaisalmer': 'Jaisalmer',
      'bikaner': 'Bikaner',
      'mount-abu': 'Mount Abu',
      'goa': 'Goa',
      'kerala': 'Kerala',
      'munnar': 'Munnar',
      'alleppey': 'Alleppey',
      'kochi': 'Kochi',
      'trivandrum': 'Trivandrum',
      'karnataka': 'Karnataka',
      'bangalore': 'Bangalore',
      'mysore': 'Mysore',
      'coorg': 'Coorg',
      'ooty': 'Ooty',
      'tamil-nadu': 'Tamil Nadu',
      'chennai': 'Chennai',
      'madurai': 'Madurai',
      'pondicherry': 'Pondicherry',
      'mahabalipuram': 'Mahabalipuram',
      'andhra-pradesh': 'Andhra Pradesh',
      'hyderabad': 'Hyderabad',
      'visakhapatnam': 'Visakhapatnam',
      'telangana': 'Telangana',
      'maharashtra': 'Maharashtra',
      'mumbai': 'Mumbai',
      'pune': 'Pune',
      'nashik': 'Nashik',
      'aurangabad': 'Aurangabad',
      'gujarat': 'Gujarat',
      'ahmedabad': 'Ahmedabad',
      'surat': 'Surat',
      'vadodara': 'Vadodara',
      'rajkot': 'Rajkot',
      'bhavnagar': 'Bhavnagar',
      'madhya-pradesh': 'Madhya Pradesh',
      'bhopal': 'Bhopal',
      'indore': 'Indore',
      'gwalior': 'Gwalior',
      'ujjain': 'Ujjain',
      'khajuraho': 'Khajuraho',
      'west-bengal': 'West Bengal',
      'kolkata': 'Kolkata',
      'darjeeling': 'Darjeeling',
      'kalimpong': 'Kalimpong',
      'gangtok': 'Gangtok',
      'sikkim': 'Sikkim',
      'assam': 'Assam',
      'guwahati': 'Guwahati',
      'kaziranga': 'Kaziranga',
      'manipur': 'Manipur',
      'imphal': 'Imphal',
      'meghalaya': 'Meghalaya',
      'shillong': 'Shillong',
      'cherrapunji': 'Cherrapunji',
      'mizoram': 'Mizoram',
      'aizawl': 'Aizawl',
      'nagaland': 'Nagaland',
      'kohima': 'Kohima',
      'tripura': 'Tripura',
      'agartala': 'Agartala',
      'arunachal-pradesh': 'Arunachal Pradesh',
      'itanagar': 'Itanagar',
      'tawang': 'Tawang',
      'odisha': 'Odisha',
      'bhubaneswar': 'Bhubaneswar',
      'puri': 'Puri',
      'konark': 'Konark',
      'jharkhand': 'Jharkhand',
      'ranchi': 'Ranchi',
      'bihar': 'Bihar',
      'patna': 'Patna',
      'bodh-gaya': 'Bodh Gaya',
      'nalanda': 'Nalanda',
      'chhattisgarh': 'Chhattisgarh',
      'raipur': 'Raipur',
      'jagdalpur': 'Jagdalpur',
      'punjab': 'Punjab',
      'chandigarh': 'Chandigarh',
      'amritsar': 'Amritsar',
      'haryana': 'Haryana',
      'gurgaon': 'Gurgaon',
      'faridabad': 'Faridabad',
      'himachal-pradesh': 'Himachal Pradesh',
      'uttar-pradesh': 'Uttar Pradesh',
      'lucknow': 'Lucknow',
      'agra': 'Agra',
      'varanasi': 'Varanasi',
      'allahabad': 'Allahabad',
      'kanpur': 'Kanpur',
      'jhansi': 'Jhansi',
      'mathura': 'Mathura',
      'vrindavan': 'Vrindavan'
    };

    return placeMap[place] || place || 'N/A';
  };

  const handleExportSinglePackageToWord = async (pkg: PackageData) => {
    try {
      // Create document children array
      const children = [
        new Paragraph({
          children: [new TextRun({ text: SITE_NAME, bold: true, size: 32 })],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: pkg.title, bold: true, size: 28 })],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: pkg.subtitle || '', size: 20 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
      ];

      // Add package images section with actual images
      if (pkg.images && pkg.images.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Package Images", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: `${pkg.images.length} Images`, size: 20 })],
          }),
          new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
        );

        // Download and add images
        for (let i = 0; i < pkg.images.length; i++) {
          const image = pkg.images[i];
          const filename = image.url.split('/').pop() || `image_${i + 1}.jpg`;

          children.push(
            new Paragraph({
              children: [new TextRun({ text: `Image ${i + 1}: ${filename}`, bold: true, size: 18 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Alt: ${image.alt || 'Package Image'}`, size: 16 })],
            }),
          );

          // Try to download and embed the image
          const imageBase64 = await downloadImageAsBase64(image.url);
          if (imageBase64) {
            try {
              // Convert base64 to buffer for docx
              const base64Data = imageBase64.split(',')[1];
              const imageBuffer = Buffer.from(base64Data, 'base64');

              children.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffer,
                      transformation: {
                        width: 300,
                        height: 200,
                      },
                      type: 'png',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              );
            } catch (imageError) {
              console.error('Error embedding image:', imageError);
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: "[Image could not be loaded]", size: 14, italics: true })],
                  alignment: AlignmentType.CENTER,
                }),
              );
            }
          } else {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: "[Image could not be downloaded]", size: 14, italics: true })],
                alignment: AlignmentType.CENTER,
              }),
            );
          }

          children.push(new Paragraph({ children: [new TextRun({ text: "" })] })); // Empty line
        }
      }

      // Add package details table
      const packageDetailsTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Detail", bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Duration" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.duration || 'N/A' })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Location" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.location || 'N/A' })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Price" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `R ${pkg.price?.toLocaleString() || '0'}` })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: pkg.packageType === 'domestic' ? 'Domestic' : 'International' })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Place" })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: getFormattedPlace(pkg.place) })] })] }),
            ],
          }),
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      });

      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Package Details", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
      );

      // Add About section
      if (pkg.about) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "About", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: pkg.about, size: 20 })],
          }),
          new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
        );
      }

      // Add Itinerary section
      if (pkg.itinerary && pkg.itinerary.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Itinerary", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_2,
          }),
        );

        pkg.itinerary.forEach((day, index) => {
          const cleanTitle = day.title.replace(/[â­ *]/g, '').trim();
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `Day ${day.day}`, bold: true, size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: cleanTitle, bold: true, size: 18 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: day.description, size: 16 })],
            }),
            new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
          );
        });
      }

      // Create Word document with all content including tables
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            ...children,
            packageDetailsTable,
            new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            ...(pkg.tourDetails && pkg.place === 'bhutan' ? [
              new Paragraph({
                children: [new TextRun({ text: "Tour Details", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Details", bold: true })] })] }),
                    ],
                  }),
                  ...pkg.tourDetails.split('\n').filter(line => line.trim() !== '').map(line =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: line.trim() })] })] }),
                      ],
                    })
                  ),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            ] : []),
            ...(pkg.transportation && pkg.transportation.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Transportation", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Vehicle", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                    ],
                  }),
                  ...pkg.transportation.map(transport =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: transport.type })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: transport.vehicle })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: transport.description || 'N/A' })] })] }),
                      ],
                    })
                  ),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            ] : []),
            ...(pkg.accommodation && pkg.accommodation.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Accommodation", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "City", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hotel/Resort", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rooms", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Room Type", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Nights", bold: true })] })] }),
                    ],
                  }),
                  ...pkg.accommodation.map(accommodation =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: accommodation.city })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: accommodation.hotel })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: accommodation.rooms })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: accommodation.roomType })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: accommodation.nights })] })] }),
                      ],
                    })
                  ),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ] : []),
            // Add Inclusions section
            ...(pkg.inclusions && pkg.inclusions.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "What's Included", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Inclusions", bold: true })] })] }),
                    ],
                  }),
                  ...pkg.inclusions.map(inclusion =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `â€¢ ${inclusion}` })] })] }),
                      ],
                    })
                  ),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new Paragraph({ children: [new TextRun({ text: "" })] }), // Empty line
            ] : []),
            // Add Exclusions section
            ...(pkg.exclusions && pkg.exclusions.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "What's Not Included", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exclusions", bold: true })] })] }),
                    ],
                  }),
                  ...pkg.exclusions.map(exclusion =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `â€¢ ${exclusion}` })] })] }),
                      ],
                    })
                  ),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ] : []),
          ],
        }],
      });

      // Generate and save the Word document
      const buffer = await Packer.toBuffer(doc);
      const arrayBuffer = new ArrayBuffer(buffer.byteLength);
      const view = new Uint8Array(arrayBuffer);
      view.set(new Uint8Array(buffer));
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const fileName = `${pkg.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      saveAs(blob, fileName);

      alert('Package exported to Word document successfully!');
    } catch (error) {
      console.error('Error exporting package to Word:', error);
      alert('Error exporting package to Word document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    {
      id: 'packages' as DashboardView,
      label: 'Packages',
      icon: Package,
    },
    {
      id: 'categories' as DashboardView,
      label: 'Categories',
      icon: FolderTree,
    },
    {
      id: 'banners' as DashboardView,
      label: 'Banners',
      icon: ImageIcon,
    },
    {
      id: 'gallery' as DashboardView,
      label: 'Gallery',
      icon: LayoutGrid,
    },
    {
      id: 'testimonials' as DashboardView,
      label: 'Testimonials',
      icon: Users,
    },
    {
      id: 'blogs' as DashboardView,
      label: 'Blogs',
      icon: FileText,
    },
    {
      id: 'enquiries' as DashboardView,
      label: 'Customer Enquiries',
      icon: MessageSquare,
    },
    {
      id: 'settings' as DashboardView,
      label: 'Home Settings',
      icon: SettingsIcon,
    },
    {
      id: 'socials' as DashboardView,
      label: 'Social Media',
      icon: Share2,
    },
  ];

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    router.push("/login");
  };

  return (
    <div className="h-screen bg-cream flex font-inter overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 transition-all duration-500 ease-in-out relative z-30",
          sidebarOpen ? "w-72" : "w-0",
          "overflow-hidden"
        )}
      >
        {/* Sidebar Background */}
        <div className="w-72 h-full absolute inset-0 bg-espresso z-0 shadow-2xl"></div>

        <div className="relative h-full flex flex-col z-10 w-72">
          {/* Sidebar Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream flex items-center justify-center shadow-lg">
                  <Image
                    src={LOGO_SRC}
                    alt={`${SITE_NAME} Logo`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tighter uppercase">{SITE_NAME}</h2>
                  <p className="text-[10px] font-bold text-hazelnut uppercase tracking-widest">Management</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                    isActive
                      ? "bg-hazelnut text-white shadow-xl shadow-hazelnut/20"
                      : "text-white/60 hover:bg-cream/5 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-cream/20" : "bg-cream/5 group-hover:bg-cream/10"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-sm tracking-tight">{item.label}</div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="bg-cream/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5A0D0D] to-orange-300 flex items-center justify-center font-bold text-white shadow-lg">
                  AD
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-tighter">Admin User</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Yaoundé HQ</div>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="w-full justify-start text-white/50 hover:text-white hover:bg-red-500/10 hover:text-red-400 p-2 h-auto text-xs font-bold uppercase tracking-widest"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile — optional close on tap */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="bg-cream/50 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/50">
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-5">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="bg-espresso text-white hover:bg-hazelnut rounded-xl p-2 h-auto"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                )}
                <div>
                  <h1 className="text-4xl font-black text-espresso tracking-tighter uppercase">
                    {activeView === 'packages' && 'Package Management'}
                    {activeView === 'categories' && 'Category Management'}
                    {activeView === 'tours' && 'Tours Management'}
                    {activeView === 'tickets' && 'Tickets Inventory'}
                    {activeView === 'banners' && 'Home Banners'}
                    {activeView === 'gallery' && 'Photo Gallery'}
                    {activeView === 'testimonials' && 'Guest Feedback'}
                    {activeView === 'blogs' && 'Content Studio'}
                    {activeView === 'settings' && 'Home Configuration'}
                    {activeView === 'socials' && 'Social Presence'}
                  </h1>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                    {activeView === 'packages' && 'Curating premium experiences for global travelers'}
                    {activeView === 'categories' && 'Add and edit experience types and subcategories for packages'}
                    {activeView === 'tours' && 'Managing specialized guided local experiences'}
                    {activeView === 'tickets' && 'Coordinating global air travel inventory'}
                    {activeView === 'banners' && 'Management of homepage hero slider visuals'}
                    {activeView === 'gallery' && 'Upload and manage photos shown on the public gallery page'}
                    {activeView === 'testimonials' && 'Monitoring guest satisfaction and reviews'}
                    {activeView === 'blogs' && 'Managing luxury travel narratives'}
                    {activeView === 'settings' && 'Customize homepage section visibility and features'}
                    {activeView === 'socials' && 'Centralized control for all brand digital touchpoints'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl mr-2">
                  <div className="px-4 py-2 bg-cream rounded-xl shadow-sm text-[10px] font-black uppercase text-espresso tracking-widest">
                    v2.1 Stable
                  </div>
                </div>
                {(activeView === 'packages' || activeView === 'tours' || activeView === 'tickets') && (
                  <Button
                    onClick={openCreatePackageModal}
                    className="bg-espresso hover:bg-hazelnut text-white font-black px-6 py-6 rounded-2xl shadow-xl shadow-espresso/10 transition-all uppercase text-xs tracking-widest flex gap-3"
                  >
                    <Plus className="h-5 w-5" />
                    {activeView === 'packages' ? 'New Product' : activeView === 'tours' ? 'New Tour' : activeView === 'tickets' ? 'New Ticket' : 'New Banner'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeView === 'packages' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { label: 'Total Packages', value: packages.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                  {
                    label: 'Enquiries Received',
                    value: enquiries.length,
                    icon: MessageSquare,
                    color: 'text-hazelnut',
                    bg: 'bg-hazelnut/10'
                  },
                  {
                    label: 'Avg Rating',
                    value: packages.length > 0
                      ? (packages.reduce((sum, p) => sum + (p.rating || 0), 0) / packages.length).toFixed(1)
                      : '0.0',
                    icon: Star,
                    color: 'text-orange-500',
                    bg: 'bg-orange-50'
                  },
                ].map((stat, i) => (
                  <Card key={i} className="rounded-[40px] border-none shadow-sm p-10 hover:shadow-md transition-all duration-500 bg-cream/80 backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-8">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", stat.bg)}>
                        <stat.icon className={cn("h-7 w-7", stat.color)} />
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black tracking-widest">+12%</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-5xl font-black text-espresso tracking-tighter leading-none">{stat.value}</div>
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3 ml-0.5">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Packages Table UI Refined */}
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">PRODUCT INVENTORY</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Total catalog of Romoire coffee premix products</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleSeedPackages}
                        disabled={seedingPackages}
                        variant="outline"
                        className="border-espresso/20 text-espresso hover:bg-espresso hover:text-white font-black text-xs uppercase tracking-wider rounded-2xl py-5 px-5 flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Coffee className="h-4 w-4 text-hazelnut" />
                        {seedingPackages ? 'Seeding Premixes...' : 'Seed Premix Products'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  {/* Filters Section Refined */}
                  <div className="mb-10 p-6 bg-gray-50/50 rounded-[30px] border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
                      {/* Main Category Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          Main Category
                        </label>
                        <Select value={groupFilter} onValueChange={handleGroupFilterChange}>
                          <SelectTrigger className="h-14 rounded-2xl border-white shadow-sm bg-cream">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-white shadow-xl">
                            <SelectItem value="all">All Types</SelectItem>
                            {navGroups.map((group) => (
                              <SelectItem key={group.slug} value={group.slug}>
                                {group.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subcategory Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          Subcategory
                        </label>
                        <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                          <SelectTrigger className="h-14 rounded-2xl border-white shadow-sm bg-cream">
                            <SelectValue placeholder="All Subcategories" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-white shadow-xl max-h-72">
                            <SelectItem value="all">All Subcategories</SelectItem>
                            {filterCategoryOptions.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}{category.isFuture ? ' (Future)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Mini Category Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          Mini Category
                        </label>
                        <Select value={miniFilter} onValueChange={setMiniFilter}>
                          <SelectTrigger className="h-14 rounded-2xl border-white shadow-sm bg-cream">
                            <SelectValue placeholder="All Mini Categories" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-white shadow-xl max-h-72">
                            <SelectItem value="all">All Mini Categories</SelectItem>
                            {filterMiniOptions.map((mini) => (
                              <SelectItem key={mini.slug} value={mini.value}>
                                {mini.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Search */}
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          Search
                        </label>
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-hazelnut h-4 w-4 transition-colors" />
                          <Input
                            placeholder="Find package..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-12 pr-4 rounded-2xl border-white shadow-sm focus:ring-[#5A0D0D] focus:border-hazelnut"
                          />
                        </div>
                      </div>

                      {/* Place Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          Region
                        </label>
                        <Select value={placeFilter} onValueChange={setPlaceFilter}>
                          <SelectTrigger className="h-14 rounded-2xl border-white shadow-sm bg-cream">
                            <SelectValue placeholder="All Regions" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-white shadow-xl">
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="cape-town">Cape Town</SelectItem>
                            <SelectItem value="kruger">Kruger</SelectItem>
                            <SelectItem value="garden-route">Garden Route</SelectItem>
                            <SelectItem value="dubai">Dubai</SelectItem>
                            <SelectItem value="mauritius">Mauritius</SelectItem>
                            <SelectItem value="vietnam">Vietnam</SelectItem>
                            <SelectItem value="namibia">Namibia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || placeFilter !== "all" || groupFilter !== "all" || categoryFilter !== "all" || miniFilter !== "all") && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTerm("");
                            setPlaceFilter("all");
                            setGroupFilter("all");
                            setCategoryFilter("all");
                            setMiniFilter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Package Title</th>
                          <th className="text-left p-3">Subcategory</th>
                          <th className="text-left p-3">Mini Category</th>
                          <th className="text-left p-3">Place</th>
                          <th className="text-left p-3">Duration</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Rating</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPackages.length > 0 ? (
                          filteredPackages.map((pkg) => (
                            <tr key={pkg._id} className="group hover:bg-cream transition-colors">
                              <td className="p-4">
                                <div className="flex items-center space-x-4">
                                  {pkg.images && pkg.images.length > 0 ? (
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                      <img
                                        src={pkg.images[0].url}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 rounded-2xl border-2 border-white bg-gray-50 flex items-center justify-center shadow-sm flex-shrink-0">
                                      <Package className="h-6 w-6 text-gray-300" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-espresso truncate leading-tight tracking-tight uppercase text-sm">{pkg.title}</div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-0.5 truncate uppercase tracking-widest">{pkg.subtitle?.substring(0, 30)}...</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tight">
                                  {resolveCategoryByValue(pkg.packageCategory)?.label || pkg.packageCategory || 'Yachts & Sailing Cruises'}
                                </span>
                              </td>
                              <td className="p-4">
                                {pkg.packageMiniCategory ? (
                                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-tight">
                                    {resolveMiniLabel(pkg.packageMiniCategory)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-gray-300">—</span>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-espresso uppercase tracking-tighter italic">{getFormattedPlace(pkg.place)}</span>
                                  <span className="text-[10px] font-medium text-gray-400">{pkg.location || "Global HQ"}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
                                  <Clock className="h-3 w-3 text-hazelnut" />
                                  {pkg.duration?.split(' ')[0]}D / {pkg.duration?.split(' ')[3]}N
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm font-black text-espresso tracking-tight">
                                  R {pkg.price?.toLocaleString()}
                                </div>
                                <div className="text-[9px] font-bold text-hazelnut uppercase tracking-widest">Premium Tier</div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl w-fit">
                                  <Star className="h-3.5 w-3.5 text-orange-500 fill-current" />
                                  <span className="text-xs font-black text-orange-600">{pkg.rating || 5.0}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-10 h-10 rounded-xl bg-cream border border-gray-100 hover:bg-hazelnut hover:text-white shadow-sm flex items-center justify-center p-0 transition-all"
                                      >
                                        <Menu className="h-5 w-5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-white shadow-2xl p-2 w-48">
                                      <DropdownMenuItem onClick={() => handleEditPackage(pkg)} className="rounded-xl flex gap-3 font-bold text-xs uppercase tracking-widest p-3">
                                        <Edit className="h-4 w-4 text-blue-500" /> Modify Package
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDuplicatePackage(pkg)} className="rounded-xl flex gap-3 font-bold text-xs uppercase tracking-widest p-3">
                                        <Copy className="h-4 w-4 text-hazelnut" /> Clone Entry
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleExportSinglePackageToWord(pkg)} className="rounded-xl flex gap-3 font-bold text-xs uppercase tracking-widest p-3">
                                        <Download className="h-4 w-4 text-emerald-500" /> Export Doc
                                      </DropdownMenuItem>
                                      <div className="h-px bg-gray-100 my-1" />
                                      <DropdownMenuItem onClick={() => handleDeletePackage(pkg)} className="rounded-xl flex gap-3 font-bold text-xs uppercase tracking-widest p-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" /> Delete Forever
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              <div className="flex flex-col items-center space-y-2">
                                <Package className="h-12 w-12 text-gray-300" />
                                {packages.length === 0 ? (
                                  <>
                                    <p>No packages created yet</p>
                                    <div className="flex gap-3">
                                      <Button onClick={openCreatePackageModal} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Package
                                      </Button>
                                      <Button onClick={handleSeedPackages} disabled={seedingPackages} size="sm" variant="outline" className="rounded-xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white">
                                        {seedingPackages ? 'Adding...' : '✨ Add Sample Packages'}
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p>No packages found matching your filters</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSearchTerm("");
                                        setPlaceFilter("all");
                                        setCategoryFilter("all");
                                      }}
                                    >
                                      Clear Filters
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'categories' && (
            <div className="container mx-auto px-8 py-10">
              <DashboardCategoriesPanel />
            </div>
          )}

          {activeView === 'tours' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Tours Inventory</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Total catalog of curated guided tours</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Tour Title</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Type</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Location</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Rating</th>
                          <th className="text-center p-3 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tours.length > 0 ? tours.map((tour) => (
                          <tr key={tour._id} className="group hover:bg-cream transition-colors border-b border-gray-50 last:border-0">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                {tour.images?.[0] ? (
                                  <img src={tour.images[0].url} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><Compass className="h-5 w-5 text-gray-300" /></div>
                                )}
                                <div className="font-bold text-sm text-espresso">{tour.title}</div>
                              </div>
                            </td>
                            <td className="p-4"><Badge variant="outline" className="rounded-lg text-[10px] uppercase font-black">{tour.tourType}</Badge></td>
                            <td className="p-4 text-xs font-bold text-gray-500 uppercase">{tour.location}</td>
                            <td className="p-4 text-sm font-black text-espresso">R {tour.price?.toLocaleString()}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-orange-500 font-black text-xs">
                                <Star className="h-3 w-3 fill-current" /> {tour.rating || 5.0}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedTour(tour); setIsEditTourModalOpen(true); }} className="text-blue-500 hover:bg-blue-50 rounded-xl"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTour(tour)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="p-12 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <Compass className="h-12 w-12 text-gray-200" />
                                <p className="font-bold text-gray-500">No tours yet</p>
                                <div className="flex gap-3">
                                  <Button onClick={() => setIsCreateTourModalOpen(true)} size="sm" className="bg-espresso text-white rounded-xl">
                                    <Plus className="h-4 w-4 mr-2" /> Create Tour
                                  </Button>
                                  <Button onClick={handleSeedTours} disabled={seedingTours} size="sm" variant="outline" className="rounded-xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white">
                                    {seedingTours ? 'Adding...' : '✨ Add Sample Tours'}
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'tickets' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Tickets Inventory</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Available flight tickets and airline inventory</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Title</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Carrier</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Route</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Class</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                          <th className="text-center p-3 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.length > 0 ? tickets.map((ticket) => (
                          <tr key={ticket._id} className="group hover:bg-cream transition-colors border-b border-gray-50 last:border-0">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                {ticket.images?.[0] ? (
                                  <img src={ticket.images[0].url} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <Plane className="h-5 w-5 text-hazelnut" />
                                  </div>
                                )}
                                <div className="font-bold text-sm text-espresso">{ticket.title}</div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-bold uppercase">{ticket.carrier}</td>
                            <td className="p-4 text-xs font-bold text-gray-500">{ticket.route}</td>
                            <td className="p-4"><Badge className="bg-blue-50 text-blue-600 rounded-lg text-[10px] uppercase font-black">{ticket.travelClass}</Badge></td>
                            <td className="p-4 text-sm font-black text-espresso">R {ticket.price?.toLocaleString()}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedTicket(ticket); setIsEditTicketModalOpen(true); }} className="text-blue-500 hover:bg-blue-50 rounded-xl"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTicket(ticket)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="p-12 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <Plane className="h-12 w-12 text-gray-200" />
                                <p className="font-bold text-gray-500">No tickets yet</p>
                                <div className="flex gap-3">
                                  <Button onClick={() => setIsCreateTicketModalOpen(true)} size="sm" className="bg-espresso text-white rounded-xl">
                                    <Plus className="h-4 w-4 mr-2" /> Create Ticket
                                  </Button>
                                  <Button onClick={handleSeedTickets} disabled={seedingTickets} size="sm" variant="outline" className="rounded-xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white">
                                    {seedingTickets ? 'Adding...' : '✨ Add Sample Tickets'}
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'banners' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Home Page Banners</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Manage the hero slider banners on the home page — multiple banners create a slideshow</CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSeedBanners} disabled={seedingBanners} variant="outline" className="rounded-2xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white font-black uppercase tracking-widest text-xs h-12 px-6">
                        {seedingBanners ? 'Adding...' : '✨ Add Sample Banners'}
                      </Button>
                      <Button onClick={() => setIsCreateBannerModalOpen(true)} className="bg-espresso hover:bg-hazelnut text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs shadow-xl flex gap-2">
                        <Plus className="h-4 w-4" /> New Banner
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map((banner) => {
                      const previewImage = getBannerPreviewImage(banner);
                      const mediaLabel = getBannerMediaLabel(banner.mediaType);
                      return (
                      <Card key={banner._id} className="rounded-3xl border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative aspect-video">
                          {banner.mediaType === 'video' && banner.video?.url ? (
                            <video src={banner.video.url} className="w-full h-full object-cover" muted playsInline />
                          ) : previewImage ? (
                            <img src={previewImage} className="w-full h-full object-cover" alt={banner.title} />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="text-white font-black text-lg uppercase tracking-tighter leading-none">{banner.title}</h4>
                            <p className="text-hazelnut font-bold text-[10px] uppercase tracking-widest mt-1">{banner.subtitle}</p>
                          </div>
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className={cn(
                              "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none",
                              banner.isActive ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                            )}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge className="rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none bg-espresso/80 text-white">
                              {mediaLabel}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" onClick={() => { setSelectedBanner(banner); setIsEditBannerModalOpen(true); }} className="h-8 w-8 rounded-lg bg-cream/90 text-espresso hover:bg-hazelnut hover:text-white"><Edit className="h-4 w-4" /></Button>
                            <Button variant="secondary" size="icon" onClick={() => handleDeleteBanner(banner)} className="h-8 w-8 rounded-lg bg-cream/90 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <CardContent className="p-4 bg-cream flex justify-between items-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Order: {banner.order}
                          </div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                    {banners.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/30">
                        <ImageIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h4 className="text-espresso font-black uppercase tracking-tighter text-xl">No Banners Found</h4>
                        <p className="text-gray-400 text-sm font-medium mt-2">Add sample banners to instantly populate the homepage slider, or create your own custom banners.</p>
                        <div className="flex justify-center gap-3 mt-6">
                          <Button onClick={handleSeedBanners} disabled={seedingBanners} className="bg-hazelnut hover:bg-espresso text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] transition-all">
                            {seedingBanners ? 'Adding...' : '✨ Add Sample Banners'}
                          </Button>
                          <Button onClick={() => setIsCreateBannerModalOpen(true)} variant="outline" className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                            Create Custom Banner
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'gallery' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Gallery Images</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">
                        Upload photos that appear on the public gallery page at /gallery
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="rounded-2xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white font-black uppercase tracking-widest text-xs h-12 px-6">
                        <Link href="/gallery" target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2 inline" />
                          View Gallery
                        </Link>
                      </Button>
                      <Button onClick={() => setIsCreateGalleryModalOpen(true)} className="bg-espresso hover:bg-hazelnut text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs shadow-xl flex gap-2">
                        <Plus className="h-4 w-4" /> Upload Image
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galleryItems.map((item) => (
                      <Card key={item._id} className="rounded-3xl border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative aspect-square">
                          <img src={item.image?.url} className="w-full h-full object-cover" alt={item.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <h4 className="text-white font-black text-sm uppercase tracking-tight leading-tight">{item.title}</h4>
                            {item.caption && (
                              <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.caption}</p>
                            )}
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className={cn(
                              "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none",
                              item.isActive ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                            )}>
                              {item.isActive ? 'Visible' : 'Hidden'}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => handleToggleGalleryActive(item)}
                              className="h-8 w-8 rounded-lg bg-cream/90 text-espresso hover:bg-hazelnut hover:text-white"
                              title={item.isActive ? 'Hide from gallery' : 'Show on gallery'}
                            >
                              {item.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button variant="secondary" size="icon" onClick={() => handleDeleteGalleryItem(item)} className="h-8 w-8 rounded-lg bg-cream/90 text-red-500 hover:bg-red-500 hover:text-white">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3 bg-cream flex justify-between items-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Order: {item.order ?? 0}
                          </div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {galleryItems.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/30">
                        <LayoutGrid className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h4 className="text-espresso font-black uppercase tracking-tighter text-xl">No Gallery Images Yet</h4>
                        <p className="text-gray-400 text-sm font-medium mt-2">Upload your first photo to populate the gallery page.</p>
                        <Button onClick={() => setIsCreateGalleryModalOpen(true)} className="mt-6 bg-hazelnut hover:bg-espresso text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                          Upload First Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'testimonials' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Guest Feedback</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Manage client testimonials shown on the homepage</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateTestimonialModalOpen(true)} className="bg-espresso hover:bg-hazelnut text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-espresso/10 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Feedback
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Client Info</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Feedback</th>
                           <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                           <th className="text-center p-3 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.length > 0 ? (
                          testimonials.map((testimonial) => (
                            <tr key={testimonial._id} className="group hover:bg-cream transition-colors border-b border-gray-50 last:border-0">
                               <td className="p-4">
                                  <div className="flex items-center gap-4">
                                     {testimonial.image?.url ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                           <img src={testimonial.image.url} alt={testimonial.name} className="w-full h-full object-cover" />
                                        </div>
                                     ) : (
                                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center shadow-sm flex-shrink-0">
                                           <MessageSquare className="h-5 w-5 text-gray-400" />
                                        </div>
                                     )}
                                     <div>
                                        <div className="font-bold text-sm text-espresso">{testimonial.name}</div>
                                        <div className="text-xs text-gray-500 uppercase">{testimonial.role}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="p-4">
                                  <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl w-fit">
                                    <Star className="h-3.5 w-3.5 text-orange-500 fill-current" />
                                    <span className="text-xs font-black text-orange-600">{testimonial.rating}</span>
                                  </div>
                               </td>
                               <td className="p-4">
                                  <p className="text-xs text-gray-600 line-clamp-2 max-w-[400px]">{testimonial.content}</p>
                               </td>
                               <td className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                  {new Date(testimonial.createdAt).toLocaleDateString()}
                               </td>
                               <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                     <Button variant="ghost" size="sm" onClick={() => handleEditTestimonial(testimonial)} className="text-blue-500 hover:bg-blue-50 rounded-xl">
                                        <Edit className="h-4 w-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(testimonial)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                                        <Trash2 className="h-4 w-4" />
                                     </Button>
                                  </div>
                               </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">
                              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                              <p className="font-bold text-sm">No testimonials found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'blogs' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Content Studio</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Manage your travel blog narratives, tips, and experiences</CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSeedBlogs} disabled={seedingBlogs} variant="outline" className="rounded-2xl border-hazelnut text-hazelnut hover:bg-hazelnut hover:text-white font-black uppercase tracking-widest text-xs h-12 px-6">
                        {seedingBlogs ? 'Adding...' : '✨ Seed Stories'}
                      </Button>
                      <Button onClick={() => setIsCreateBlogModalOpen(true)} className="bg-espresso hover:bg-hazelnut text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs shadow-xl flex gap-2">
                        <Plus className="h-4 w-4" /> New Narrative
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Narrative Title</th>
                          <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                          <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Author</th>
                          <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Featured</th>
                          <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {blogs.length > 0 ? blogs.map((blog) => (
                          <tr key={blog._id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                {blog.image?.url ? (
                                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                    <img src={blog.image.url} className="w-full h-full object-cover" alt="" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-hazelnut" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-sm text-espresso line-clamp-1">{blog.title}</div>
                                  <div className="text-[10px] text-gray-400 font-medium">/{blog.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-blue-50 text-blue-600 rounded-lg text-[9px] uppercase font-black tracking-tight whitespace-nowrap">
                                {blog.category}
                              </Badge>
                            </td>
                            <td className="p-4 text-[11px] font-bold text-gray-500">{blog.author}</td>
                            <td className="p-4">
                              {blog.isFeatured && (
                                <Badge className="bg-orange-50 text-orange-600 rounded-lg text-[9px] uppercase font-black tracking-tight">
                                  Featured
                                </Badge>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedBlog(blog); setIsEditBlogModalOpen(true); }} className="text-blue-500 hover:bg-blue-50 rounded-xl">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(blog)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="p-12 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <FileText className="h-12 w-12 text-gray-200" />
                                <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No narratives published yet</p>
                                <Button onClick={() => setIsCreateBlogModalOpen(true)} className="bg-espresso text-white rounded-2xl px-8">
                                  <Plus className="h-4 w-4 mr-2" /> Start Writing
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'reports' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">System Reports</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Preview and generate data insights across all modules</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Select value={reportModule} onValueChange={(val: DashboardView) => setReportModule(val)}>
                        <SelectTrigger className="w-full sm:w-[220px] h-12 rounded-2xl border-gray-100 shadow-sm font-bold bg-cream text-espresso">
                          <SelectValue placeholder="Select Module" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                          {sidebarItems.filter(item => item.id !== 'reports').map(item => (
                            <SelectItem key={item.id} value={item.id} className="font-bold cursor-pointer">
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={reportModule === 'packages' ? handleExportToWord : undefined}
                        disabled={reportModule !== 'packages'}
                        className="w-full sm:w-auto bg-espresso hover:bg-hazelnut text-white font-black h-12 px-6 rounded-2xl shadow-xl shadow-espresso/10 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export {sidebarItems.find(i => i.id === reportModule)?.label}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="overflow-x-auto rounded-[24px] border border-gray-100 bg-gray-50/30">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {reportModule === 'packages' && (
                            <>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Package Title</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Type</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Region</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Price</th>
                            </>
                          )}
                          {reportModule === 'tours' && (
                            <>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Tour Title</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Duration</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Price</th>
                            </>
                          )}
                          {reportModule === 'tickets' && (
                            <>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Flight Route</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Class</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Price</th>
                            </>
                          )}
                          {reportModule === 'banners' && (
                            <>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Banner Title</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Status</th>
                            </>
                          )}
                          {reportModule === 'enquiries' && (
                            <>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Date/Time</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Customer Info</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Package Interest</th>
                              <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Subject</th>
                            </>
                          )}
                          {['testimonials', 'blogs'].includes(reportModule) && (
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Status</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {reportModule === 'packages' && packages.map((pkg) => (
                           <tr key={pkg._id} className="border-b border-gray-100 last:border-0 hover:bg-cream transition-colors">
                             <td className="p-4 font-bold text-sm text-espresso">{pkg.title}</td>
                             <td className="p-4 text-xs font-medium text-gray-500 uppercase">{pkg.packageType}</td>
                             <td className="p-4 text-xs font-medium text-gray-500 uppercase">{pkg.place}</td>
                             <td className="p-4 text-xs font-black text-espresso">R {pkg.price}</td>
                           </tr>
                        ))}
                        {reportModule === 'tours' && tours.map((tour) => (
                           <tr key={tour._id} className="border-b border-gray-100 last:border-0 hover:bg-cream transition-colors">
                             <td className="p-4 font-bold text-sm text-espresso">{tour.title}</td>
                             <td className="p-4 text-xs font-medium text-gray-500">{tour.duration}</td>
                             <td className="p-4 text-xs font-black text-espresso">R {tour.price}</td>
                           </tr>
                        ))}
                        {reportModule === 'tickets' && tickets.map((ticket) => (
                           <tr key={ticket._id} className="border-b border-gray-100 last:border-0 hover:bg-cream transition-colors">
                             <td className="p-4 font-bold text-sm text-espresso">{ticket.title}</td>
                             <td className="p-4 text-xs font-medium text-gray-500">{(ticket as any).classType || 'Economy'}</td>
                             <td className="p-4 text-xs font-black text-espresso">R {ticket.price}</td>
                           </tr>
                        ))}
                        {reportModule === 'banners' && banners.map((banner) => (
                           <tr key={banner._id} className="border-b border-gray-100 last:border-0 hover:bg-cream transition-colors">
                             <td className="p-4 font-bold text-sm text-espresso">{banner.title}</td>
                             <td className="p-4 text-xs font-medium text-hazelnut uppercase">{banner.isActive ? 'Active' : 'Inactive'}</td>
                           </tr>
                        ))}
                        {reportModule === 'enquiries' && enquiries.map((enq) => (
                           <tr key={enq._id} className="border-b border-gray-100 last:border-0 hover:bg-cream transition-colors">
                              <td className="p-4 text-xs font-bold text-gray-500 uppercase">
                                {new Date(enq.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-sm text-espresso">{enq.name}</div>
                                <div className="text-xs text-gray-500">{enq.email}</div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="text-xs font-bold text-gray-700 uppercase">{enq.packageType || 'General'}</div>
                                {enq.packageName && <div className="text-[10px] text-gray-500 font-bold mb-1">{enq.packageName}</div>}
                                {enq.destination && <div className="text-[10px] text-gray-500">📍 {enq.destination}</div>}
                                {enq.travelDate && <div className="text-[10px] text-gray-500">📅 {enq.travelDate}</div>}
                                {enq.travelers && <div className="text-[10px] text-gray-500">👥 {enq.travelers} Guests</div>}
                                {enq.budget && <div className="text-[10px] text-gray-500">💰 {enq.budget}</div>}
                              </td>
                              <td className="p-4 text-xs font-bold text-gray-700">{enq.subject}</td>
                           </tr>
                        ))}
                        {['testimonials', 'blogs'].includes(reportModule) && (
                          <tr>
                            <td className="p-12 text-center text-sm font-bold text-gray-400">
                              Module coming in v2.2
                            </td>
                          </tr>
                        )}
                        {!['testimonials', 'blogs'].includes(reportModule) &&
                         ((reportModule === 'packages' && packages.length === 0) ||
                          (reportModule === 'tours' && tours.length === 0) ||
                          (reportModule === 'tickets' && tickets.length === 0) ||
                          (reportModule === 'banners' && banners.length === 0) ||
                          (reportModule === 'enquiries' && enquiries.length === 0)) && (
                          <tr>
                            <td colSpan={4} className="p-12 text-center text-sm font-bold text-gray-400">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'enquiries' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Customer Enquiries</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-400">Package enquiries from category pages, detail pages, and the contact form</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Date/Time</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Customer Info</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Interest / Travel Info</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Subject</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Message / Req.</th>
                          <th className="text-left p-3 text-xs font-black uppercase tracking-widest text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.length > 0 ? (
                          enquiries.map((enq) => (
                            <tr key={enq._id} className="group hover:bg-cream transition-colors border-b border-gray-50 last:border-0">
                              <td className="p-4 text-[10px] font-bold text-gray-500 uppercase">
                                {new Date(enq.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-sm text-espresso">{enq.name}</div>
                                <div className="text-xs text-gray-500">{enq.email}</div>
                                <div className="text-xs text-gray-500">{enq.phone}</div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="text-xs font-bold text-gray-700 uppercase">{enq.packageType || 'General'}</div>
                                {enq.packageName && <div className="text-[10px] text-gray-500 font-bold mb-1">{enq.packageName}</div>}
                                {enq.packageDuration && <div className="text-[10px] text-gray-400 mb-1">Ref: {enq.packageDuration}</div>}
                                {enq.destination && <div className="text-[10px] text-gray-500">📍 {enq.destination}</div>}
                                {enq.travelDate && <div className="text-[10px] text-gray-500">📅 {enq.travelDate}</div>}
                                {enq.travelers && <div className="text-[10px] text-gray-500">👥 {enq.travelers} Guests</div>}
                                {enq.budget && <div className="text-[10px] text-gray-500">💰 {enq.budget}</div>}
                              </td>
                              <td className="p-4 text-xs font-bold text-gray-700 align-top">{enq.subject}</td>
                              <td className="p-4 align-top">
                                <p className="text-xs text-gray-600 line-clamp-4 max-w-[300px]" title={enq.message}>{enq.message}</p>
                              </td>
                              <td className="p-4 align-top">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedEnquiry(enq);
                                    setIsReplyModalOpen(true);
                                  }}
                                  className="text-[10px] font-black uppercase tracking-widest text-espresso border-gray-200 hover:bg-gray-50 h-8 rounded-xl"
                                >
                                  Reply
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                              <p className="font-bold text-sm">No enquiries found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div>
                    <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Home Page Configuration</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-400 font-bold uppercase tracking-widest mt-1">Control the visibility of dynamic sections on your main landing page</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Popular Section Toggle */}
                    <div className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between h-full",
                      siteSettings.popularSection 
                        ? "bg-cream border-hazelnut/20 shadow-xl shadow-[#5A0D0D]/5" 
                        : "bg-gray-50/50 border-gray-100"
                    )}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          siteSettings.popularSection ? "bg-hazelnut text-white shadow-hazelnut/20" : "bg-gray-200 text-gray-400"
                        )}>
                          <Star className="h-7 w-7" />
                        </div>
                        <Switch 
                          disabled={settingsLoading}
                          checked={siteSettings.popularSection} 
                          onCheckedChange={(val) => updateSetting('popularSection', val)}
                          className="data-[state=checked]:bg-hazelnut"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Popular Packages</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Display the curated collection of top-rated travel packages on the home screen.</p>
                        
                        <div className="flex items-center gap-2">
                          {siteSettings.popularSection ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Visible Live
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Section Toggle */}
                    <div className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between h-full",
                      siteSettings.upcomingSection 
                        ? "bg-cream border-hazelnut/20 shadow-xl shadow-[#5A0D0D]/5" 
                        : "bg-gray-50/50 border-gray-100"
                    )}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          siteSettings.upcomingSection ? "bg-hazelnut text-white shadow-hazelnut/20" : "bg-gray-200 text-gray-400"
                        )}>
                          <Compass className="h-7 w-7" />
                        </div>
                        <Switch 
                          disabled={settingsLoading}
                          checked={siteSettings.upcomingSection} 
                          onCheckedChange={(val) => updateSetting('upcomingSection', val)}
                          className="data-[state=checked]:bg-hazelnut"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Featured Water Trips</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Showcase yacht cruises, kayaking, rafting, and other water experiences on the homepage.</p>
                        
                        <div className="flex items-center gap-2">
                          {siteSettings.upcomingSection ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Visible Live
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Destinations Section Toggle */}
                    <div className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between h-full",
                      siteSettings.destinationsSection 
                        ? "bg-cream border-hazelnut/20 shadow-xl shadow-[#5A0D0D]/5" 
                        : "bg-gray-50/50 border-gray-100"
                    )}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          siteSettings.destinationsSection ? "bg-hazelnut text-white shadow-hazelnut/20" : "bg-gray-200 text-gray-400"
                        )}>
                          <MapPin className="h-7 w-7" />
                        </div>
                        <Switch 
                          disabled={settingsLoading}
                          checked={siteSettings.destinationsSection} 
                          onCheckedChange={(val) => updateSetting('destinationsSection', val)}
                          className="data-[state=checked]:bg-hazelnut"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Destinations Grid</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Manage visibility of the global destinations gallery and featured location cards.</p>
                        
                        <div className="flex items-center gap-2">
                          {siteSettings.destinationsSection ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Visible Live
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Explore Section Toggle */}
                    <div className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between h-full",
                      siteSettings.exploreSection 
                        ? "bg-cream border-hazelnut/20 shadow-xl shadow-[#5A0D0D]/5" 
                        : "bg-gray-50/50 border-gray-100"
                    )}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          siteSettings.exploreSection ? "bg-hazelnut text-white shadow-hazelnut/20" : "bg-gray-200 text-gray-400"
                        )}>
                          <LayoutDashboard className="h-7 w-7" />
                        </div>
                        <Switch 
                          disabled={settingsLoading}
                          checked={siteSettings.exploreSection} 
                          onCheckedChange={(val) => updateSetting('exploreSection', val)}
                          className="data-[state=checked]:bg-hazelnut"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Explore Us</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Toggle the main branding and mission statement section below the hero banner.</p>
                        
                        <div className="flex items-center gap-2">
                          {siteSettings.exploreSection ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Visible Live
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Testimonials Section Toggle */}
                    <div className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col justify-between h-full",
                      siteSettings.testimonialsSection 
                        ? "bg-cream border-hazelnut/20 shadow-xl shadow-[#5A0D0D]/5" 
                        : "bg-gray-50/50 border-gray-100"
                    )}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          siteSettings.testimonialsSection ? "bg-hazelnut text-white shadow-hazelnut/20" : "bg-gray-200 text-gray-400"
                        )}>
                          <Users className="h-7 w-7" />
                        </div>
                        <Switch 
                          disabled={settingsLoading}
                          checked={siteSettings.testimonialsSection} 
                          onCheckedChange={(val) => updateSetting('testimonialsSection', val)}
                          className="data-[state=checked]:bg-hazelnut"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Client Feedback</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">Show or hide the customer testimonials and travel reviews section.</p>
                        
                        <div className="flex items-center gap-2">
                          {siteSettings.testimonialsSection ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Visible Live
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 p-6 bg-cream rounded-[32px] border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shadow-sm">
                      <LayoutDashboard className="h-5 w-5 text-hazelnut" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-espresso uppercase tracking-widest">Administrator Pro-Tip</p>
                      <p className="text-xs text-gray-500 font-medium">Changes made here reflect immediately on the frontend without requiring a redeploy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === 'socials' && (
            <div className="container mx-auto px-8 py-10 space-y-10">
              <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div>
                    <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase">Social Media Presence</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your brand's digital touchpoints and profile links across the web</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Facebook */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                            <Facebook className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">Facebook</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.facebookEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, facebookEnabled: val})}
                          className="data-[state=checked]:bg-[#1877F2]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Profile URL</p>
                        <Input 
                          value={siteSettings.facebookUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, facebookUrl: e.target.value})}
                          placeholder="https://facebook.com/..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.facebookUrl && (
                          <Link href={siteSettings.facebookUrl} target="_blank" className="text-[9px] text-hazelnut flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433]/10 via-[#e6683c]/10 to-[#dc2743]/10 text-[#e6683c] flex items-center justify-center">
                            <Instagram className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">Instagram</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.instagramEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, instagramEnabled: val})}
                          className="data-[state=checked]:bg-[#e6683c]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Profile URL</p>
                        <Input 
                          value={siteSettings.instagramUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, instagramUrl: e.target.value})}
                          placeholder="https://instagram.com/..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.instagramUrl && (
                          <Link href={siteSettings.instagramUrl} target="_blank" className="text-[9px] text-[#e6683c] flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Twitter / X */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-black/10 text-black flex items-center justify-center">
                            <Twitter className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">X / Twitter</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.twitterEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, twitterEnabled: val})}
                          className="data-[state=checked]:bg-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Profile URL</p>
                        <Input 
                          value={siteSettings.twitterUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, twitterUrl: e.target.value})}
                          placeholder="https://x.com/..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.twitterUrl && (
                          <Link href={siteSettings.twitterUrl} target="_blank" className="text-[9px] text-gray-500 flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center">
                            <Linkedin className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">LinkedIn</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.linkedinEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, linkedinEnabled: val})}
                          className="data-[state=checked]:bg-[#0A66C2]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Profile URL</p>
                        <Input 
                          value={siteSettings.linkedinUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, linkedinUrl: e.target.value})}
                          placeholder="https://linkedin.com/in/..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.linkedinUrl && (
                          <Link href={siteSettings.linkedinUrl} target="_blank" className="text-[9px] text-[#0A66C2] flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* YouTube */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center">
                            <Youtube className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">YouTube</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.youtubeEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, youtubeEnabled: val})}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Channel URL</p>
                        <Input 
                          value={siteSettings.youtubeUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, youtubeUrl: e.target.value})}
                          placeholder="https://youtube.com/c/..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.youtubeUrl && (
                          <Link href={siteSettings.youtubeUrl} target="_blank" className="text-[9px] text-red-600 flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="p-6 rounded-[32px] bg-cream border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                            <MessageSquare className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform</p>
                            <p className="text-sm font-black text-espresso uppercase">WhatsApp Business</p>
                          </div>
                        </div>
                        <Switch 
                          checked={siteSettings.whatsappEnabled}
                          onCheckedChange={(val) => setSiteSettings({...siteSettings, whatsappEnabled: val})}
                          className="data-[state=checked]:bg-[#25D366]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Link (wa.me)</p>
                        <Input 
                          value={siteSettings.whatsappUrl || ""}
                          onChange={(e) => setSiteSettings({...siteSettings, whatsappUrl: e.target.value})}
                          placeholder="https://wa.me/237..."
                          className="bg-cream border-gray-100 rounded-xl h-11 text-xs font-medium"
                        />
                        {siteSettings.whatsappUrl && (
                          <Link href={siteSettings.whatsappUrl} target="_blank" className="text-[9px] text-[#25D366] flex items-center gap-1 mt-1 font-bold uppercase truncate hover:underline px-1">
                            <ExternalLink className="h-2.5 w-2.5" /> View Live Profile
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-8 bg-espresso rounded-[40px] flex flex-col md:flex-row items-center gap-8 border border-white/5 relative">
                    <div className="w-20 h-20 rounded-3xl bg-hazelnut flex items-center justify-center shadow-xl shadow-hazelnut/20 shrink-0">
                      <Share2 className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">Expanding your reach</h4>
                      <p className="text-sm text-white/50 font-medium">Adding social media links helps build trust with potential customers. Ensure all URLs are correct and active before enabling them on the live site.</p>
                    </div>
                    <div className="shrink-0">
                      <Button 
                        onClick={saveSocialSettings}
                        disabled={settingsLoading}
                        className="bg-hazelnut hover:bg-espresso text-white font-black px-10 py-8 rounded-[24px] shadow-2xl shadow-hazelnut/20 transition-all uppercase text-sm tracking-widest flex gap-3 group"
                      >
                        {settingsLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            Save Configuration
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <CreatePackageModal
        isOpen={isCreatePackageModalOpen}
        onClose={() => setIsCreatePackageModalOpen(false)}
        onPackageCreated={handlePackageCreated}
      />

      <CreateTourModal
        isOpen={isCreateTourModalOpen}
        onClose={() => setIsCreateTourModalOpen(false)}
        onTourCreated={handleTourCreated}
      />

      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      {/* Edit Package Modal */}
      <EditPackageModal
        isOpen={isEditPackageModalOpen}
        onClose={() => {
          setIsEditPackageModalOpen(false);
          setSelectedPackage(null);
        }}
        packageData={selectedPackage}
        onPackageUpdated={handlePackageUpdated}
      />

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isCreateBlogModalOpen}
        onClose={() => setIsCreateBlogModalOpen(false)}
        onBlogCreated={() => fetchBlogs()}
      />

      {/* Edit Blog Modal */}
      <EditBlogModal
        isOpen={isEditBlogModalOpen}
        onClose={() => {
          setIsEditBlogModalOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
        onBlogUpdated={() => fetchBlogs()}
      />

      {/* Edit Tour Modal */}
      <EditTourModal
        isOpen={isEditTourModalOpen}
        onClose={() => {
          setIsEditTourModalOpen(false);
          setSelectedTour(null);
        }}
        tourData={selectedTour}
        onTourUpdated={handleTourUpdated}
      />

      {/* Edit Ticket Modal */}
      <EditTicketModal
        isOpen={isEditTicketModalOpen}
        onClose={() => {
          setIsEditTicketModalOpen(false);
          setSelectedTicket(null);
        }}
        ticketData={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
      <CreateBannerModal
        isOpen={isCreateBannerModalOpen}
        onClose={() => setIsCreateBannerModalOpen(false)}
        onBannerCreated={handleBannerCreated}
      />

      <CreateGalleryModal
        isOpen={isCreateGalleryModalOpen}
        onClose={() => setIsCreateGalleryModalOpen(false)}
        onGalleryCreated={handleGalleryCreated}
      />

      <EditBannerModal
        isOpen={isEditBannerModalOpen}
        onClose={() => {
          setIsEditBannerModalOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
        onBannerUpdated={handleBannerUpdated}
      />

      <CreateTestimonialModal
        isOpen={isCreateTestimonialModalOpen}
        onClose={() => setIsCreateTestimonialModalOpen(false)}
        onTestimonialCreated={handleTestimonialCreated}
      />

      <EditTestimonialModal
        isOpen={isEditTestimonialModalOpen}
        onClose={() => {
          setIsEditTestimonialModalOpen(false);
          setSelectedTestimonial(null);
        }}
        testimonial={selectedTestimonial}
        onTestimonialUpdated={handleTestimonialUpdated}
      />
      
      <ReplyEnquiryModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedEnquiry(null);
        }}
        enquiryData={selectedEnquiry}
      />
    </div>
  );
}

