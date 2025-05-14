import { useState, useEffect } from 'react';
import { itemsApi } from '../../services/api';

// Data dummy untuk Katalog
export const categories = [
  "Semua Kategori",
  "Electronics",
  "Documents",
  "Accessories",
  "Stationery",
  "Clothing",
  "Others",
];

// Sample data untuk barang hilang
export const lostItems = [
  {
    id: 1,
    title: "Dompet",
    location: "Kampus 2",
    date: "28 April 2025",
    description:
      "Dompet dengan warna abu2 ditemukan pada kanti kampus 2 gedung elektro, berisi KTM, KTP dan SIM atas nama Yudianto Panca N.",
    image: ["https://placehold.co/400x300/999999/FFFFFF?text=Dompet"],
    category: "Accessories",
    reports: [
      {
        id: 1,
        userName: "Andi Wijaya",
        message: "Saya melihat dompet ini terjatuh di sekitar kantin elektro kemarin sore.",
        date: "29 April 2025"
      },
      {
        id: 2,
        userName: "Budi Santoso",
        message: "Saya kenal dengan pemiliknya, akan saya hubungi segera.",
        date: "29 April 2025"
      }
    ]
  },
  {
    id: 2,
    title: "Laptop ASUS",
    location: "Perpustakaan Pusat",
    date: "27 April 2025",
    description:
      "Laptop ASUS warna silver dengan stiker logo programming ditemukan di meja pojok perpustakaan pusat lantai 2.",
    image: ["https://placehold.co/400x300/967259/FFFFFF?text=Laptop"],
    category: "Electronics",
    reports: [
      {
        id: 1,
        userName: "Dina Pratiwi",
        message: "Saya melihat ada mahasiswa jurusan Teknik Informatika yang mencari laptop dengan ciri-ciri seperti itu.",
        date: "28 April 2025"
      }
    ]
  },
  {
    id: 3,
    title: "Kunci Motor Honda",
    location: "Parkiran Fakultas Teknik",
    date: "26 April 2025",
    description:
      "Kunci motor Honda dengan gantungan kunci berbentuk ikan ditemukan di area parkir fakultas teknik dekat pos satpam.",
    image: ["https://placehold.co/400x300/22cc88/FFFFFF?text=Kunci+Motor"],
    category: "Others",
    reports: [
      {
        id: 1,
        userName: "Fajar Nugroho",
        message: "Sepertinya itu kunci saya, gantungan kuncinya ada stiker HMTI juga tidak?",
        date: "27 April 2025"
      },
      {
        id: 2,
        userName: "Admin Parkir",
        message: "Kunci sudah diamankan di pos satpam, silahkan datang dengan bukti kepemilikan.",
        date: "27 April 2025"
      }
    ]
  },
  {
    id: 4,
    title: "Jam Tangan Casio",
    location: "Gedung Olahraga",
    date: "25 April 2025",
    description:
      "Jam tangan merk Casio warna hitam ditemukan di ruang ganti gedung olahraga setelah acara kompetisi basket antar fakultas.",
    image: ["https://placehold.co/400x300/333333/FFFFFF?text=Jam+Tangan"],
    category: "Accessories",
    reports: []
  },
  {
    id: 5,
    title: "Flashdisk SanDisk 32GB",
    location: "Lab Komputer",
    date: "24 April 2025",
    description:
      "Flashdisk merk SanDisk 32GB warna merah hitam tertinggal di komputer nomor 12 Lab Komputer Fakultas Teknik.",
    image: ["https://placehold.co/400x300/FF0000/FFFFFF?text=Flashdisk"],
    category: "Electronics",
    reports: [
      {
        id: 1,
        userName: "Asisten Lab",
        message: "Flashdisk ini menyimpan file-file penting, saat ini sudah diamankan di ruang asisten lab.",
        date: "25 April 2025"
      }
    ]
  },
];

// Sample data untuk barang ditemukan
export const foundItems = [
  {
    id: 1,
    title: "AirPods Pro",
    location: "Kafetaria Utama",
    date: "28 April 2025",
    description:
      "AirPods Pro dalam case putih ditemukan di meja kafetaria utama dekat konter minuman. Sudah diamankan oleh petugas kafetaria.",
    image: [
      "https://placehold.co/400x300/333333/FFFFFF?text=Airpods", "https://placehold.co/400x300/333333/FFFFFF?text=Airpods2"
    ],
    category: "Electronics",
    reports: [
      {
        id: 1,
        userName: "Petugas Kafetaria",
        message: "AirPods ini sudah kami simpan di loker barang hilang kafetaria. Silahkan hubungi nomor 08123456789 untuk klaim.",
        date: "28 April 2025"
      }
    ]
  },
  {
    id: 2,
    title: "Kartu Tanda Mahasiswa",
    location: "Gedung Administrasi",
    date: "27 April 2025",
    description:
      "KTM atas nama Indah Permata dari Fakultas Psikologi ditemukan di lorong gedung administrasi lantai 2.",
    image: ["https://placehold.co/400x300/22cc88/FFFFFF?text=KTM"],
    category: "Documents",
    reports: [
      {
        id: 1,
        userName: "Petugas Administrasi",
        message: "KTM sudah kami amankan di loket layanan mahasiswa. Bisa diambil di jam kerja.",
        date: "27 April 2025"
      },
      {
        id: 2,
        userName: "Indah Permata",
        message: "Terima kasih banyak, saya akan ambil hari ini.",
        date: "27 April 2025"
      }
    ]
  },
  {
    id: 3,
    title: "Buku Catatan",
    location: "Ruang Kelas E305",
    date: "26 April 2025",
    description:
      "Buku catatan sampul biru berisi catatan mata kuliah Algoritma dan Pemrograman ditemukan tertinggal di meja paling belakang.",
    image: ["https://placehold.co/400x300/967259/FFFFFF?text=Notebook"],
    category: "Stationery",
    reports: []
  },
  {
    id: 4,
    title: "Payung Lipat",
    location: "Shelter Bus Kampus",
    date: "25 April 2025",
    description:
      "Payung lipat warna navy ditemukan di shelter bus kampus setelah hujan sore kemarin. Kondisi masih bagus.",
    image: ["https://placehold.co/400x300/999999/FFFFFF?text=Payung"],
    category: "Others",
    reports: [
      {
        id: 1,
        userName: "Novi Susanti",
        message: "Sepertinya itu payung saya yang ketinggalan. Ada stiker merah di gagangnya?",
        date: "26 April 2025"
      }
    ]
  },
  {
    id: 5,
    title: "Jaket Denim",
    location: "Ruang Seminar Lt.3",
    date: "24 April 2025",
    description: 
      "Jaket denim biru tertinggal di kursi belakang setelah acara seminar karir kemarin sore. Ada pin fakultas teknik di bagian lengan.",
    image: ["https://placehold.co/400x300/0000FF/FFFFFF?text=Jaket"],
    category: "Clothing",
    reports: [
      {
        id: 1,
        userName: "Panitia Seminar",
        message: "Jaket sudah kami simpan di ruang sekretariat panitia. Hub. 081234567890 untuk pengambilan.",
        date: "25 April 2025"
      },
      {
        id: 2,
        userName: "Wahyu Firmansyah",
        message: "Itu jaket saya, terima kasih sudah mengamankannya. Akan saya ambil besok.",
        date: "25 April 2025"
      }
    ]
  },
]; 

export const useKatalogData = (initialTab = 'lost') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  
  // Fungsi untuk mengambil data dari API
  const fetchItems = async (type) => {
    try {
      setLoading(true);
      const response = await itemsApi.getAll({ type });
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error(`Error fetching ${type} items:`, err);
      setError(`Gagal memuat data barang ${type === 'lost' ? 'hilang' : 'ditemukan'}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Mengambil data barang hilang dan ditemukan saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      const [lost, found] = await Promise.all([
        fetchItems('lost'),
        fetchItems('found')
      ]);
      
      setLostItems(lost);
      setFoundItems(found);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  // Menghandle perubahan tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return {
    activeTab,
    loading,
    error,
    lostItems,
    foundItems,
    handleTabChange
  };
};

export const useKatalogFilters = (items = []) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mendapatkan kategori unik dari data
  const getUniqueCategories = () => {
    const categories = new Set(items.map(item => item.category));
    return ['Semua Kategori', ...categories];
  };
  
  // Filter item berdasarkan kategori dan pencarian
  const filteredItems = items.filter(item => {
    // Filter kategori
    const matchesCategory = selectedCategory === 'Semua Kategori' || 
      item.category === selectedCategory;
    
    // Filter pencarian
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories: getUniqueCategories(),
    filteredItems
  };
};

export const useKatalogModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const openModal = (item) => {
    // Pastikan properti image selalu array
    const itemCopy = { ...item };
    if (itemCopy.image && !Array.isArray(itemCopy.image)) {
      itemCopy.image = [itemCopy.image];
    }
    setSelectedItem(itemCopy);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  
  return {
    isModalOpen,
    selectedItem,
    openModal,
    closeModal
  };
}; 