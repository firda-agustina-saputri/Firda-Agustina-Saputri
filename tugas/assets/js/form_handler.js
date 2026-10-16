// In-memory collection data produk
const localProductList = [
    { id: 1, name: "Teh Original", category: "Minuman", price: 3500, stok: 50 },
    { id: 2, name: "Teh susu", category: "Minuman", price: 5000, stok: 30 },
    { id: 3, name: "Teh yakult", category: "Minuman", price: 7000, stok: 25 },
    { id: 4, name: "Teh cappucino", category: "Minuman", price: 7000, stok: 40 },
    { id: 5, name: "Teh susu coklat", category: "Minuman", price: 5000, stok: 30 },
    { id: 6, name: "Teh lemon", category: "Minuman", price: 5000, stok: 40 },
    { id: 7, name: "Teh strowbery", category: "Minuman", price: 5000, stok: 30 },
    { id: 8, name: "Teh madu", category: "Minuman", price: 5000, stok: 35 },
];

// Helper Arrow Function untuk formatting mata uang
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

// Fungsi Pengolahan & Filter Data Kategori (Materi Pertemuan 3)
function processProductData(products, filterCategory) {
    console.log(`=== Menjalankan Filter Kategori: ${filterCategory} ===`);

    let totalPrice = 0;
    let matchCount = 0;

    for (const product of products) {
        if (product.category === filterCategory) {
            matchCount++;
            totalPrice += product.price;

            const isAvailable = product.stok > 30 ? "Stok Aman" : "Stok Terbatas";
            console.log(`[ID: ${product.id}] ${product.name} - Harga: ${formatRupiah(product.price)} (${isAvailable})`);
        }
    }

    const averagePrice = matchCount > 0 ? (totalPrice / matchCount).toFixed(0) : 0;
    return {
        category: filterCategory,
        totalProducts: matchCount,
        averagePrice: parseFloat(averagePrice)
    };
}

// Eksekusi fungsi pengolahan data awal agar tampil di console
const result = processProductData(localProductList, "Minuman");
console.log("Hasil Rekapitulasi:", result);

// Inisialisasi Event Listener pada Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const feedback = document.getElementById('form-feedback');

    // Referensi Elemen Input Form & Live Preview
    const nameInputEl = document.getElementById('product-name');
    const categoryInputEl = document.getElementById('product-category');
    const priceInputEl = document.getElementById('product-price');
    const stokInputEl = document.getElementById('product-stok');

    const previewName = document.getElementById('preview-name');
    const previewCategory = document.getElementById('preview-category');
    const previewPrice = document.getElementById('preview-price');
    const previewStok = document.getElementById('preview-stok');

    // Event Handling 'input' & 'change' untuk Live Preview
    if (nameInputEl && previewName) {
        nameInputEl.addEventListener('input', (e) => {
            previewName.textContent = e.target.value.trim() !== "" ? e.target.value : "-";
        });
    }
    if (categoryInputEl && previewCategory) {
        categoryInputEl.addEventListener('change', (e) => {
            previewCategory.textContent = e.target.value !== "" ? e.target.value : "-";
        });
    }
    if (priceInputEl && previewPrice) {
        priceInputEl.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            previewPrice.textContent = !isNaN(val) ? formatRupiah(val) : "-";
        });
    }
    if (stokInputEl && previewStok) {
        stokInputEl.addEventListener('input', (e) => {
            previewStok.textContent = e.target.value !== "" ? `${e.target.value} pcs` : "-";
        });
    }

    // Menangani submit event form menggunakan Arrow Function
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah reload halaman
        
        const nameInput = nameInputEl.value.trim();
        const categoryInput = categoryInputEl ? categoryInputEl.value : "";
        const priceInput = parseFloat(priceInputEl.value);
        const stokInput = stokInputEl ? parseInt(stokInputEl.value) : 0;

        // 1. Validasi sederhana client-side (kosong atau angka negatif)
        if (!nameInput || !categoryInput || isNaN(priceInput) || priceInput <= 0 || isNaN(stokInput) || stokInput < 0) {
            feedback.textContent = "Mohon isi nama, kategori, harga, dan stok produk dengan valid!";
            feedback.className = "feedback-msg error";
            feedback.style.color = "red";
            return;
        }

        // 2. Validasi Tambahan: Cek apakah nama produk sudah ada (duplikat) di dalam localProductList
        const isDuplicate = localProductList.some(
            (product) => product.name.toLowerCase() === nameInput.toLowerCase()
        );

        if (isDuplicate) {
            feedback.textContent = `Gagal! Produk dengan nama '${nameInput}' sudah terdaftar di sistem.`;
            feedback.className = "feedback-msg error";
            feedback.style.color = "red";
            return;
        }

        // Konstruksi objek baru selaras dengan skema Backend POST /api/v1/products
        const newProduct = {
            id: localProductList.length + 1,
            name: nameInput, 
            category: categoryInput,
            price: priceInput,
            stok: stokInput
        };

        localProductList.push(newProduct);
        console.log("Data produk berhasil ditambahkan:", newProduct);

        // Tampilkan feedback sukses ke pengguna
        feedback.textContent = `Sukses! Produk '${newProduct.name}' (${newProduct.category}) seharga ${formatRupiah(newProduct.price)} tersimpan.`;
        feedback.className = "feedback-msg success";
        feedback.style.color = "green";

        // Reset form input
        form.reset();
        if (previewName) previewName.textContent = "-";
        if (previewCategory) previewCategory.textContent = "-";
        if (previewPrice) previewPrice.textContent = "-";
        if (previewStok) previewStok.textContent = "-";
    });
});