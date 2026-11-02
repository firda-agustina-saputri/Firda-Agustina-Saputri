import { getStoredData, saveStoredData } from "./modules/product_service.js";
import { validateRegistration, validateLahanInput } from "./validator.js";

document.addEventListener("DOMContentLoaded", () => {
    let listLahan = getStoredData();

    console.warn("=== [DEBUG] ISI ARRAY DATA LAHAN GLOBAL ===");
    console.log(listLahan);
    console.table(listLahan);

    // --- LOGIKA MENAMPILKAN USER & LOGOUT DI HALAMAN INTERNAL ---
    const salamUserSpan = document.getElementById("salam-user");
    const btnLogout = document.getElementById("btn-logout");


    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Apakah Anda yakin ingin keluar dari sesi ini?")) {
                localStorage.removeItem("activeUser");
                window.location.href = "index.html";
            }
        });
    }

    // --- LOGIKA HALAMAN LOGIN / REGISTRASI ---
    const formRegistrasi = document.getElementById("form-registrasi");

    if (formRegistrasi) {
        formRegistrasi.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            // Reset error states
            ["username", "email", "password", "confirm-password"].forEach(id => {
                const group = document.getElementById(`group-${id}`);
                const errSpan = document.getElementById(`error-${id}`);

                if (group) group.classList.remove("has-error");
                if (errSpan) errSpan.textContent = "";
            });

            const { isValid, errors } = validateRegistration(
                username, email, password, confirmPassword
            );

            if (!isValid) {
                if (errors.username) showError("username", errors.username);
                if (errors.email) showError("email", errors.email);
                if (errors.password) showError("password", errors.password);
                if (errors.confirmPassword) {
                    showError("confirm-password", errors.confirmPassword);
                }
                return;
            }

            // Simpan data akun ke localStorage sebagai sesi login
            const userAkun = {
                username: username,
                email: email,
                waktuDaftar: new Date().toISOString()
            };
            localStorage.setItem("activeUser", JSON.stringify(userAkun));

            alert("OK! Registrasi Berhasil.");
            formRegistrasi.reset();
            window.location.href = "tambahproduk.html";
        });

        function showError(fieldId, message) {
            const group = document.getElementById(`group-${fieldId}`);
            const errorSpan = document.getElementById(`error-${fieldId}`);

            if (group) group.classList.add("has-error");
            if (errorSpan) errorSpan.textContent = message;
        }
    }

    // --- LOGIKA HALAMAN TAMBAH PRODUK & KELOLA LAHAN ---
    const formLahan = document.getElementById("form-tambah-lahan");

    if (formLahan) {
        formLahan.noValidate = true;

        const inputNama = document.getElementById("nama-lahan");
        const inputKategori = document.getElementById("kategori-lahan");
        const inputLuas = document.getElementById("luas-lahan");
        const inputEditId = document.getElementById("edit-id");
        const btnSubmit = document.getElementById("btn-submit");
        const tabelBody = document.getElementById("tabel-kelola-body");
        const searchBox = document.getElementById("search-box");
        const filterKategori = document.getElementById("filter-kategori");

        function tampilkanTabel(dataArray = listLahan) {
            if (!tabelBody) return;

            tabelBody.innerHTML = "";

            if (dataArray.length === 0) {
                tabelBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center; padding:20px;">
                            Data tidak ditemukan.
                        </td>
                    </tr>`;
                return;
            }

            dataArray.forEach((item, index) => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td><strong>${item.nama}</strong></td>
                    <td><span class="badge-kategori">${item.kategori}</span></td>
                    <td>${item.luas} Ha</td>
                    <td>
                        <button type="button" class="btn-edit"
                            data-id="${item.id}"
                            style="background:#ffc107; color:#000; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px;">
                            Edit
                        </button>

                        <button type="button" class="btn-hapus"
                            data-id="${item.id}"
                            style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px;">
                            Hapus
                        </button>
                    </td>
                `;

                tabelBody.appendChild(tr);
            });

            document.querySelectorAll(".btn-edit").forEach(btn => {
                btn.addEventListener("click", () => {
                    prosesEdit(Number(btn.dataset.id));
                });
            });

            document.querySelectorAll(".btn-hapus").forEach(btn => {
                btn.addEventListener("click", () => {
                    prosesHapus(Number(btn.dataset.id));
                });
            });
        }

        formLahan.addEventListener("submit", function (e) {
            e.preventDefault();

            const nama = inputNama.value.trim();
            const kategori = inputKategori.value;
            const luas = parseFloat(inputLuas.value);
            const idEdit = inputEditId.value;

            if (!validateLahanInput(nama, kategori, luas)) {
                tampilkanNotifikasi(
                    "Data gagal ditambahkan! Silakan lengkapi semua kolom dengan benar.",
                    "error"
                );
                return;
            }

            let pesanSukses = "";

            if (idEdit === "") {
                const dataBaru = {
                    id: Date.now(),
                    nama: nama,
                    kategori: kategori,
                    luas: luas
                };

                listLahan.push(dataBaru);
                pesanSukses = `Data lahan "${nama}" berhasil ditambahkan.`;

            } else {
                const index = listLahan.findIndex(item => item.id == idEdit);

                if (index !== -1) {
                    listLahan[index].nama = nama;
                    listLahan[index].kategori = kategori;
                    listLahan[index].luas = luas;

                    pesanSukses = `Data lahan "${nama}" berhasil diperbarui.`;
                }

                inputEditId.value = "";
                btnSubmit.textContent = "Tambah Data Lahan";
            }

            saveStoredData(listLahan);
            formLahan.reset();
            tampilkanTabel();

            tampilkanNotifikasi(pesanSukses, "sukses");
        });

        function prosesEdit(id) {
            const data = listLahan.find(item => item.id === id);

            if (data) {
                inputNama.value = data.nama;
                inputKategori.value = data.kategori;
                inputLuas.value = data.luas;
                inputEditId.value = data.id;

                btnSubmit.textContent = "Update Data Lahan";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }

        function prosesHapus(id) {
            if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                listLahan = listLahan.filter(item => item.id !== id);

                saveStoredData(listLahan);
                tampilkanTabel();
            }
        }

        function filterTabel() {
            const kataKunci = searchBox.value.toLowerCase();
            const katPilihan = filterKategori.value;

            const hasilFilter = listLahan.filter(item => {
                const cocokNama = item.nama.toLowerCase().includes(kataKunci);
                const cocokKategori =
                    katPilihan === "Semua" || item.kategori === katPilihan;

                return cocokNama && cocokKategori;
            });

            tampilkanTabel(hasilFilter);
        }

        function tampilkanNotifikasi(pesan, tipe) {
            let notifBox = document.getElementById("notifikasi-pesan");

            if (!notifBox) {
                notifBox = document.createElement("div");
                notifBox.id = "notifikasi-pesan";
                btnSubmit.insertAdjacentElement("afterend", notifBox);
            }

            notifBox.textContent = pesan;
            notifBox.style.display = "block";
            notifBox.style.marginTop = "15px";
            notifBox.style.padding = "12px 16px";
            notifBox.style.borderRadius = "6px";
            notifBox.style.fontSize = "14px";
            notifBox.style.fontWeight = "500";

            if (tipe === "sukses") {
                notifBox.style.backgroundColor = "#d1e7dd";
                notifBox.style.color = "#0f5132";
                notifBox.style.border = "1px solid #badbcc";
            } else {
                notifBox.style.backgroundColor = "#f8d7da";
                notifBox.style.color = "#842029";
                notifBox.style.border = "1px solid #f5c2c7";
            }

            setTimeout(() => {
                notifBox.style.display = "none";
                notifBox.textContent = "";
            }, 3500);
        }

        if (searchBox) {
            searchBox.addEventListener("input", filterTabel);
        }

        if (filterKategori) {
            filterKategori.addEventListener("change", filterTabel);
        }

        tampilkanTabel();
    }

    // --- LOGIKA HALAMAN KATALOG UTAMA ---
    const containerCard = document.getElementById("land-card-container");

    if (containerCard) {
        const totalCountSpan = document.getElementById("total-count");

        containerCard.innerHTML = "";

        if (totalCountSpan) {
            totalCountSpan.textContent = `${listLahan.length} Lahan`;
        }

        if (listLahan.length === 0) {
            containerCard.innerHTML = `
                <p style="color:#6c757d;">
                    Belum ada data lahan yang tersedia.
                </p>`;
            return;
        }

        listLahan.forEach(item => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "land-card";

            cardDiv.innerHTML = `
                <h4 class="card-title">${item.nama}</h4>
                <div class="card-info">
                    <p><strong>Luas Lahan:</strong> ${item.luas} Ha</p>
                    <p><strong>Kategori:</strong> ${item.kategori}</p>
                    <p><strong>Status:</strong> Aktif</p>
                </div>
            `;

            containerCard.appendChild(cardDiv);
        });
    }
});