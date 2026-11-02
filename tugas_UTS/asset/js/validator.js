// --- FORM VALIDATOR (Validasi Input Registrasi & Lahan) ---
export function validateRegistration(username, email, password, confirmPassword) {
    let isValid = true;
    let errors = {};

    if (!username.trim()) {
        errors.username = "Username wajib diisi!";
        isValid = false;
    } else if (username.length < 4) {
        errors.username = "Username minimal 4 karakter!";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        errors.email = "Email wajib diisi!";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        errors.email = "Format email tidak valid!";
        isValid = false;
    }

    if (!password) {
        errors.password = "Password wajib diisi!";
        isValid = false;
    } else if (password.length < 6) {
        errors.password = "Password minimal 6 karakter!";
        isValid = false;
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Konfirmasi password wajib diisi!";
        isValid = false;
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Konfirmasi password tidak cocok!";
        isValid = false;
    }

    return { isValid, errors };
}

export function validateLahanInput(nama, kategori, luas) {
    if (!nama.trim() || !kategori || isNaN(luas) || luas <= 0) {
        return false;
    }
    return true;
}