// validate.js
document.addEventListener('DOMContentLoaded', () => {
const form       = document.getElementById('contact-form');
const emailInput = document.getElementById('email');

  // Access Key MailboxLayer
const MAILBOXLAYER_KEY = '6b66e4db08aa73a2462c10be221521eb';

form.addEventListener('submit', async function handler(e) {
    e.preventDefault();  // Hentikan submit default ke Formspree

    const email = emailInput.value.trim();
    if (!email) {
    alert('Email tidak boleh kosong.');
    return;
    }

    try {
      // Panggil MailboxLayer API
    const url = `https://apilayer.net/api/check?access_key=${MAILBOXLAYER_KEY}&email=${encodeURIComponent(email)}`;
    const res = await fetch(url);
    const data = await res.json();

      // Beberapa properti utama dari response MailboxLayer:
      //   - format_valid    (boolean) : format user@domain
      //   - mx_found        (boolean) : MX record ada
      //   - smtp_check      (boolean) : hasil SMTP handshake
      //   - disposable      (boolean) : email sekali-pakai
    if (!data.format_valid) {
        throw new Error('Format email tidak valid.');
    }
    if (!data.mx_found) {
        throw new Error('Domain email tidak ditemukan (MX record gagal).');
    }
    if (!data.smtp_check) {
        throw new Error('Mailbox tidak dapat dihubungi (SMTP check gagal).');
    }
    if (data.disposable) {
        throw new Error('Harap gunakan email bukan sekali-pakai.');
    }

      // Semua pengecekan OK → lepaskan listener, lalu submit form
    form.removeEventListener('submit', handler);
    form.submit();

    } catch (err) {
    alert(err.message);
    }
});
});
