const STORAGE_KEY = "dataLahan";

export function getStoredData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        { id: 1, nama: "Lahan Blok A - Padi Ciherang", kategori: "Pangan", luas: 2.5 },
        { id: 2, nama: "Lahan Blok D - Cabai Merah", kategori: "Hortikultura", luas: 0.8 },
        { id: 3, nama: "Lahan Blok R - Tomat", kategori: "Hortikultura", luas: 2.3 }
    ];
}

export function saveStoredData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}